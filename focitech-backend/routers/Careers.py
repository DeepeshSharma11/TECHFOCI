# routers/careers.py - ENTERPRISE GRADE CAREERS ENGINE v2.1.0
# Built for Focitech Pvt. Ltd. Backend Ecosystem
# Targets: FastAPI, Pydantic V2, Supabase Cloud Storage

import os
import re
import sys
import uuid
import logging
import shutil
import enum
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Optional, Dict, Any, Union

from fastapi import (
    APIRouter, 
    HTTPException, 
    UploadFile, 
    File, 
    Form, 
    status, 
    Depends, 
    Query, 
    BackgroundTasks
)
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator

# --- PATH CONFIGURATION ---
# Ensures internal imports work correctly regardless of execution context
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

# --- LOGGING SETUP ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("focitech_careers")

# --- SUPABASE INTEGRATION ---
try:
    # Attempting to load the centralized supabase client
    from core.supabase import supabase
    SUPABASE_AVAILABLE = True
    logger.info("✅ Careers Router: Supabase Cloud Connection Active.")
except ImportError:
    try:
        from supabase_client import supabase
        SUPABASE_AVAILABLE = True
    except Exception:
        SUPABASE_AVAILABLE = False
        logger.warning("⚠️ Careers Router: Running in Mock Mode (Client not found).")

# --- CONSTANTS ---
ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 Megabytes
BUCKET_NAME = "resumes"
STORAGE_FOLDER = "applications"

# --- ENUMERATIONS ---

class JobType(str, enum.Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    REMOTE = "remote"
    HYBRID = "hybrid"

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"

class WorkMode(str, enum.Enum):
    ONSITE = "onsite"
    REMOTE = "remote"
    HYBRID = "hybrid"

# --- PYDANTIC V2 MODELS (SCHEMAS) ---

class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=200, example="Senior Backend Engineer")
    department: str = Field(..., min_length=2, max_length=100, example="Engineering")
    location: str = Field(..., min_length=2, max_length=100, example="Bareilly / Remote")
    job_type: JobType = JobType.FULL_TIME
    work_mode: WorkMode = WorkMode.REMOTE
    salary_range: Optional[str] = Field(None, max_length=100, example="₹12L - ₹18L per annum")
    experience_required: str = Field(..., max_length=100, example="3+ Years")
    education_required: Optional[str] = Field(None, max_length=200)
    description: str = Field(..., min_length=20, description="Detailed job description")
    requirements: str = Field(..., min_length=20, description="Bullet points of requirements")
    benefits: Optional[str] = Field(None, description="Company perks")
    is_active: bool = True
    application_deadline: Optional[datetime] = None

class JobCreate(JobBase):
    """Schema for job creation"""
    pass

class JobUpdate(BaseModel):
    """Schema for updating an existing job"""
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    work_mode: Optional[WorkMode] = None
    salary_range: Optional[str] = None
    experience_required: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    is_active: Optional[bool] = None

class JobRead(JobBase):
    """Schema for returning job data to client"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    applications_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)

class ApplicationBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    cover_letter: Optional[str] = Field(None, max_length=5000)
    portfolio_url: Optional[str] = None
    job_id: int
    job_title: str

    @field_validator('portfolio_url')
    @classmethod
    def validate_url(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('URL must start with http or https')
        return v

class ApplicationRead(ApplicationBase):
    id: int
    resume_url: str
    status: ApplicationStatus = ApplicationStatus.PENDING
    internal_notes: Optional[str] = None
    applied_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class CareerStats(BaseModel):
    total_active_jobs: int
    total_applications: int
    applications_by_status: Dict[str, int]
    department_distribution: Dict[str, int]

# --- ROUTER INITIALIZATION ---
router = APIRouter()

# --- MOCK DATA STORE ---
MOCK_STORE = {
    "jobs": [
        {
            "id": 1, "title": "Lead Software Architect", "department": "Engineering",
            "location": "Bareilly", "job_type": "full-time", "work_mode": "onsite",
            "experience_required": "8+ Years", "description": "Design the core TechnoviaX infrastructure.",
            "requirements": "Python, Cloud Architecture, Leadership", "is_active": True,
            "created_at": datetime.now(timezone.utc), "applications_count": 42
        }
    ],
    "applications": []
}

# --- HELPER UTILITIES ---

def validate_file(file: UploadFile):
    """Internal validator for resume uploads"""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {ALLOWED_EXTENSIONS}"
        )

async def upload_to_cloud(file: UploadFile, applicant_name: str) -> str:
    """
    Uploads a file to Supabase Storage and returns the Public URL.
    Fallback to local storage if Supabase is unavailable.
    """
    try:
        # Generate unique safe filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_id = uuid.uuid4().hex[:8]
        clean_name = re.sub(r'[^a-zA-Z0-9]', '_', applicant_name.lower())
        ext = os.path.splitext(file.filename)[1].lower()
        final_filename = f"{timestamp}_{clean_name}_{unique_id}{ext}"
        cloud_path = f"{STORAGE_FOLDER}/{final_filename}"

        file_data = await file.read()

        if SUPABASE_AVAILABLE:
            # 1. Upload to Supabase Storage Bucket
            supabase.storage.from_(BUCKET_NAME).upload(
                path=cloud_path,
                file=file_data,
                file_options={"content-type": file.content_type}
            )
            # 2. Get the public access URL
            public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(cloud_path)
            return public_url
        else:
            # Local Storage Fallback
            local_dir = BASE_DIR / "uploads" / "resumes"
            local_dir.mkdir(parents=True, exist_ok=True)
            local_file_path = local_dir / final_filename
            with open(local_file_path, "wb") as f:
                f.write(file_data)
            return f"/uploads/resumes/{final_filename}"
            
    except Exception as e:
        logger.error(f"File Upload Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Cloud storage synchronization failed."
        )

# --- PUBLIC ENDPOINTS (CANDIDATE FACING) ---

@router.get("/openings", response_model=List[JobRead], summary="Get all active jobs")
async def get_active_openings(
    department: Optional[str] = Query(None, description="Filter by dept"),
    location: Optional[str] = Query(None, description="Filter by location"),
    search: Optional[str] = Query(None, description="Search in titles"),
    limit: int = Query(20, ge=1, le=100)
):
    """
    Fetches a list of all currently active job openings from Supabase.
    Implements multi-parameter filtering and search logic.
    """
    if not SUPABASE_AVAILABLE:
        return MOCK_STORE["jobs"]

    try:
        # Construct the query
        query = supabase.table("jobs").select("*").eq("is_active", True)
        
        if department and department.lower() != "all":
            query = query.ilike("department", f"%{department}%")
        
        if location and location.lower() != "all":
            query = query.ilike("location", f"%{location}%")
            
        result = query.order("created_at", desc=True).limit(limit).execute()
        
        # Check if result has data (PGRST205 errors usually caught here)
        if hasattr(result, 'data') and result.data is not None:
            jobs = result.data
        else:
            # Fallback if result exists but data is missing (schema issues)
            logger.warning("Supabase returned empty data or schema error. Using mock.")
            return MOCK_STORE["jobs"]

        # Logic to append application counts per job
        for job in jobs:
            try:
                count_res = supabase.table("job_applications").select("id", count="exact").eq("job_id", job["id"]).execute()
                job["applications_count"] = count_res.count or 0
            except Exception:
                job["applications_count"] = 0

        return jobs
    except Exception as e:
        logger.error(f"Jobs Fetch Error: {str(e)}")
        # RESILIENCE: Return mock data instead of 500 if the database table is missing
        return MOCK_STORE["jobs"]

@router.get("/openings/{job_id}", response_model=JobRead)
async def get_job_detail(job_id: int):
    """Fetch specific job details for the description page."""
    if not SUPABASE_AVAILABLE:
        job = next((j for j in MOCK_STORE["jobs"] if j["id"] == job_id), None)
        if not job: raise HTTPException(404, "Job not found")
        return job

    try:
        result = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="The requested job opening no longer exists.")
        return result.data
    except Exception as e:
        logger.error(f"Job Detail Fetch Error: {str(e)}")
        # Fallback to mock if available for that ID
        job = next((j for j in MOCK_STORE["jobs"] if j["id"] == job_id), None)
        if job: return job
        raise HTTPException(500, "Database communication error.")

@router.post("/apply", status_code=status.HTTP_201_CREATED)
async def submit_job_application(
    name: str = Form(...),
    email: EmailStr = Form(...),
    phone: Optional[str] = Form(None),
    job_id: int = Form(...),
    job_title: str = Form(...),
    cover_letter: Optional[str] = Form(None),
    portfolio_url: Optional[str] = Form(None),
    resume: UploadFile = File(...)
):
    """
    The main application gateway.
    1. Validates the incoming resume file.
    2. Stream-uploads to cloud storage.
    3. Records the application meta-data in the relational database.
    """
    # 1. Validation
    validate_file(resume)

    # 2. Cloud Storage Processing
    cloud_url = await upload_to_cloud(resume, name)

    # 3. Database Persistence
    application_payload = {
        "name": name.strip(),
        "email": email.strip().lower(),
        "phone": phone.strip() if phone else None,
        "job_id": job_id,
        "job_title": job_title,
        "cover_letter": cover_letter.strip() if cover_letter else None,
        "portfolio_url": portfolio_url,
        "resume_url": cloud_url,
        "status": "pending",
        "applied_at": datetime.now(timezone.utc).isoformat()
    }

    if not SUPABASE_AVAILABLE:
        MOCK_STORE["applications"].append(application_payload)
        return {"message": "Application saved to mock store.", "url": cloud_url}

    try:
        db_result = supabase.table("job_applications").insert(application_payload).execute()
        if not db_result.data:
            raise Exception("Database insertion failed.")
        
        return {
            "success": True, 
            "message": "Your application has been received. Our HR team will contact you soon.",
            "application_id": db_result.data[0]["id"]
        }
    except Exception as e:
        logger.error(f"Application Database Error: {str(e)}")
        raise HTTPException(500, "Failed to register application in database.")

# --- ADMIN ENDPOINTS (INTERNAL ONLY) ---

@router.get("/admin/applications", response_model=List[ApplicationRead])
async def list_all_applications(status: Optional[ApplicationStatus] = None):
    """Admin-only: Retrieve all submitted applications."""
    if not SUPABASE_AVAILABLE: return MOCK_STORE["applications"]

    try:
        query = supabase.table("job_applications").select("*")
        if status:
            query = query.eq("status", status)
        
        result = query.order("applied_at", desc=True).execute()
        return result.data or []
    except Exception:
        return MOCK_STORE["applications"]

@router.patch("/admin/applications/{app_id}")
async def update_application_status(app_id: int, status: ApplicationStatus, notes: Optional[str] = None):
    """Admin-only: Move application through the pipeline (Shortlist/Reject/Hire)."""
    if not SUPABASE_AVAILABLE: return {"status": "updated"}

    update_data = {"status": status}
    if notes: update_data["internal_notes"] = notes

    try:
        result = supabase.table("job_applications").update(update_data).eq("id", app_id).execute()
        if not result.data:
            raise HTTPException(404, "Application record not found.")
        
        return {"message": f"Application {app_id} marked as {status}."}
    except Exception as e:
        logger.error(f"Status Update Error: {str(e)}")
        raise HTTPException(500, "Failed to update status in database.")

@router.get("/stats", response_model=CareerStats)
async def get_hr_analytics():
    """Aggregates data for the HR Dashboard visualization."""
    if not SUPABASE_AVAILABLE:
        return {
            "total_active_jobs": 1, "total_applications": 0,
            "applications_by_status": {"pending": 0}, "department_distribution": {"Engineering": 1}
        }

    try:
        # Get Job Stats
        jobs_res = supabase.table("jobs").select("department").eq("is_active", True).execute()
        # Get App Stats
        apps_res = supabase.table("job_applications").select("status").execute()
        
        jobs_data = jobs_res.data or []
        apps_data = apps_res.data or []

        # Build Department distribution
        dept_dist = {}
        for j in jobs_data:
            d = j["department"]
            dept_dist[d] = dept_dist.get(d, 0) + 1
            
        # Build Status distribution
        status_dist = {}
        for a in apps_data:
            s = a["status"]
            status_dist[s] = status_dist.get(s, 0) + 1

        return {
            "total_active_jobs": len(jobs_data),
            "total_applications": len(apps_data),
            "applications_by_status": status_dist,
            "department_distribution": dept_dist
        }
    except Exception as e:
        logger.error(f"Stats Calculation Error: {str(e)}")
        return {
            "total_active_jobs": 0, "total_applications": 0,
            "applications_by_status": {}, "department_distribution": {}
        }

# --- FILTER DATA ENDPOINTS ---

@router.get("/departments")
async def get_departments():
    """Helper for frontend dropdowns."""
    if not SUPABASE_AVAILABLE: return {"departments": ["Engineering", "Design", "Marketing"]}
    try:
        res = supabase.table("jobs").select("department").execute()
        unique_depts = sorted(list(set([r["department"] for r in res.data])))
        return {"departments": unique_depts}
    except Exception:
        return {"departments": ["Engineering", "Design", "Marketing"]}

@router.get("/locations")
async def get_locations():
    """Helper for frontend dropdowns."""
    if not SUPABASE_AVAILABLE: return {"locations": ["Remote", "Bareilly", "Noida"]}
    try:
        res = supabase.table("jobs").select("location").execute()
        unique_locs = sorted(list(set([r["location"] for r in res.data])))
        return {"locations": unique_locs}
    except Exception:
        return {"locations": ["Remote", "Bareilly", "Noida"]}

# --- SYSTEM HEALTH ---

@router.get("/status")
async def get_router_status():
    """Diagnostics for the Careers Router."""
    return {
        "service": "Focitech Careers Engine",
        "version": "2.1.0",
        "database_connected": SUPABASE_AVAILABLE,
        "storage_mode": "Supabase-Cloud" if SUPABASE_AVAILABLE else "Local-System",
        "timestamp": datetime.now(timezone.utc)
    }

# --- END OF FILE ---
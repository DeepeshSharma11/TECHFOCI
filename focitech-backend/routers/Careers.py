# routers/Careers.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from typing import List, Optional
from datetime import datetime
import shutil
import os
from pathlib import Path
import uuid

from supabase_client import supabase  # Your existing Supabase client
from schemas import (
    CareerApplicationCreate, CareerApplicationResponse, 
    JobOpeningCreate, JobOpeningResponse,
    CareerStats, MessageResponse
)

router = APIRouter(prefix="/api/v1/careers", tags=["Careers"])

# Table names
JOBS_TABLE = "job_openings"
APPLICATIONS_TABLE = "career_applications"

# File upload configuration
UPLOAD_DIR = Path("uploads/resumes")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx"}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

# Helper functions
def validate_file(file: UploadFile):
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="File size exceeds 5MB limit"
        )
    
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    return True

def save_resume_file(file: UploadFile) -> str:
    ext = Path(file.filename).suffix.lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    file_path = UPLOAD_DIR / filename
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return str(filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Failed to save file: {str(e)}"
        )

# Job Openings Endpoints
@router.get("/openings", response_model=List[JobOpeningResponse])
async def get_job_openings(
    department: Optional[str] = None,
    location: Optional[str] = None,
    job_type: Optional[str] = None,
    is_active: bool = True
):
    """
    Get all active job openings with optional filters
    """
    try:
        query = supabase.table(JOBS_TABLE).select("*").eq("is_active", is_active)
        
        if department:
            query = query.eq("department", department)
        if location:
            query = query.eq("location", location)
        if job_type:
            query = query.eq("job_type", job_type)
        
        response = query.order("posted_date", desc=True).execute()
        jobs = response.data
        
        if not jobs:
            return []
            
        return jobs
        
    except Exception as e:
        print(f"Error fetching job openings: {e}")
        # Return empty array instead of error for frontend
        return []

@router.post("/apply", response_model=CareerApplicationResponse)
async def submit_application(
    name: str = Form(...),
    email: str = Form(...),
    phone: Optional[str] = Form(None),
    cover_letter: Optional[str] = Form(None),
    portfolio_url: Optional[str] = Form(None),
    job_id: int = Form(...),
    job_title: str = Form(...),
    resume: UploadFile = File(...)
):
    """
    Submit a job application with resume upload
    """
    try:
        # Validate file
        validate_file(resume)
        
        # Save resume file
        resume_filename = save_resume_file(resume)
        
        # Check if job exists
        job_response = supabase.table(JOBS_TABLE).select("*").eq("id", job_id).eq("is_active", True).execute()
        
        if not job_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Job opening not found or closed"
            )
        
        # Create application record
        application_data = {
            "name": name.strip(),
            "email": email.lower().strip(),
            "phone": phone.strip() if phone else None,
            "cover_letter": cover_letter.strip() if cover_letter else None,
            "portfolio_url": portfolio_url.strip() if portfolio_url else None,
            "job_id": job_id,
            "job_title": job_title.strip(),
            "resume_filename": resume_filename,
            "status": "pending",
            "applied_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table(APPLICATIONS_TABLE).insert(application_data).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to submit application"
            )
        
        return response.data[0]
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Application submission error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit application. Please try again."
        )

# Add other endpoints as needed
@router.get("/stats", response_model=CareerStats)
async def get_career_stats():
    """
    Get career statistics (Admin only)
    """
    try:
        # For now, return empty stats
        return CareerStats(
            total_applications=0,
            pending_applications=0,
            active_openings=0,
            departments=[],
            status_distribution={}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch career stats: {str(e)}"
        )
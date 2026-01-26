from pydantic import BaseModel, EmailStr, Field, validator  # ADDED validator here
from typing import List, Optional
from datetime import datetime
from enum import Enum

# --- ENUMS FOR DATA INTEGRITY ---
class InquiryStatus(str, Enum):
    PENDING = "pending"
    RESOLVED = "resolved"
    SPAM = "spam"

# --- AUTHENTICATION & USER SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, min_length=3, max_length=50)

class UserAuth(BaseModel):
    email: EmailStr
    password: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserRead(UserBase):
    id: str  
    is_active: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

# --- INQUIRY (CONTACT FORM) SCHEMAS ---
class InquiryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=3, max_length=200) 
    message: str = Field(..., min_length=2, max_length=2000)

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    status: Optional[InquiryStatus] = None
    admin_note: Optional[str] = None

class InquiryRead(InquiryBase):
    id: int
    created_at: datetime
    status: InquiryStatus

    class Config:
        from_attributes = True

# --- PROJECT (PORTFOLIO) SCHEMAS ---
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=20)
    tech_stack: List[str] = Field(default_factory=list) 
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    is_featured: bool = False

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    is_featured: Optional[bool] = None

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- TEAM MEMBER (CORPORATE) SCHEMAS ---
class TeamMemberBase(BaseModel):
    name: str = Field(..., min_length=2)
    role: str = Field(..., min_length=2)
    bio: Optional[str] = Field(None, max_length=500)
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class TeamMemberRead(TeamMemberBase):
    id: int

    class Config:
        from_attributes = True


# --- Careers MODELS ---
class JobType(str, Enum):
    FULL_TIME = "full-time"
    PART_TIME = "part-time"
    CONTRACT = "contract"
    INTERNSHIP = "internship"
    REMOTE = "remote"
    HYBRID = "hybrid"

class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"

# Job Schemas
class JobBase(BaseModel):
    title: str
    department: str
    location: str
    job_type: JobType = JobType.FULL_TIME
    salary_range: Optional[str] = None
    experience_required: str
    education_required: Optional[str] = None
    description: str
    requirements: str
    benefits: Optional[str] = None
    is_active: bool = True
    application_deadline: Optional[datetime] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    location: Optional[str] = None
    job_type: Optional[JobType] = None
    salary_range: Optional[str] = None
    experience_required: Optional[str] = None
    education_required: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    is_active: Optional[bool] = None
    application_deadline: Optional[datetime] = None

class JobInDB(JobBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    applications_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

# Application Schemas
class ApplicationBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    cover_letter: Optional[str] = None
    portfolio_url: Optional[str] = None
    source: Optional[str] = "Company Website"
    job_id: int
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not v.replace('+', '').replace(' ', '').replace('-', '').replace('(', '').replace(')', '').isdigit():
            raise ValueError('Invalid phone number')
        return v

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[ApplicationStatus] = None
    internal_notes: Optional[str] = None

class ApplicationInDB(ApplicationBase):
    id: int
    job_title: str
    job_department: str
    job_type: str
    resume_filename: str
    status: ApplicationStatus = ApplicationStatus.PENDING
    internal_notes: Optional[str] = None
    applied_at: datetime
    status_updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Response Schemas
class JobResponse(JobInDB):
    pass

class ApplicationResponse(ApplicationInDB):
    pass

class ApplicationWithJob(ApplicationResponse):
    job: Optional[JobInDB] = None

class JobWithApplications(JobResponse):
    applications: List[ApplicationResponse] = []

# Stats Schemas
class CareerStats(BaseModel):
    total_jobs: int
    active_jobs: int
    total_applications: int
    pending_applications: int
    hired_applications: int
    average_time_to_hire: Optional[str] = None
    application_status_distribution: dict
    department_distribution: dict
    top_performing_jobs: List[dict]
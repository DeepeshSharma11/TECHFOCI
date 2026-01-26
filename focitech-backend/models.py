# models.py - UPDATED FOR PYDANTIC V2
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, field_validator, model_validator, ConfigDict
import re
import enum

# --- BASE MODELS ---
class TimestampMixin(BaseModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None

# --- PROJECT MODELS ---
class ProjectBase(BaseModel):
    """Base model for project operations"""
    title: str = Field(..., min_length=2, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    tech_stack: List[str] = Field(default_factory=list)
    image_url: Optional[str] = None
    live_url: Optional[str] = None  
    github_url: Optional[str] = None  
    
    @field_validator('tech_stack')
    @classmethod
    def validate_tech_stack(cls, v):
        if not v:
            raise ValueError('Tech stack cannot be empty')
        return v
    
    @field_validator('image_url', 'live_url', 'github_url')
    @classmethod
    def validate_urls(cls, v, info):
        if v:
            # Allow empty URLs but validate if provided
            if not v.startswith(('http://', 'https://', '/')) and v != '':
                raise ValueError(f'{info.field_name} must be a valid URL starting with http://, https://, or /')
        return v

class ProjectCreate(ProjectBase):
    """Model for creating new projects"""
    pass

class ProjectUpdate(BaseModel):
    """Model for updating projects"""
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    description: Optional[str] = Field(None, min_length=10, max_length=5000)
    tech_stack: Optional[List[str]] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None

class ProjectRead(ProjectBase):
    """Model for reading project data"""
    id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# --- TEAM MEMBER MODELS ---
class TeamMemberBase(BaseModel):
    """Base model for team members"""
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None  
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    
    @field_validator('image_url', 'github_url', 'linkedin_url', 'twitter_url')
    @classmethod
    def validate_urls(cls, v, info):
        if v:
            if not v.startswith(('http://', 'https://', '/')) and v != '':
                raise ValueError(f'{info.field_name} must be a valid URL starting with http://, https://, or /')
        return v

class TeamMemberCreate(TeamMemberBase):
    """Model for creating new team members"""
    pass

class TeamMemberUpdate(BaseModel):
    """Model for updating team members"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None

class TeamMemberRead(TeamMemberBase):
    """Model for reading team member data"""
    id: int
    created_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- INQUIRY MODELS ---
class InquiryBase(BaseModel):
    """Base model for contact inquiries"""
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    company: Optional[str] = Field(None, max_length=100)

class InquiryCreate(InquiryBase):
    """Model for creating new inquiries"""
    pass

class InquiryUpdate(BaseModel):
    """Model for updating inquiries (admin use)"""
    status: Optional[str] = Field(None, pattern=r'^(pending|responded|resolved|spam)$')
    notes: Optional[str] = Field(None, max_length=1000)
    is_resolved: Optional[bool] = None

class InquiryRead(InquiryBase):
    """Model for reading inquiry data"""
    id: int
    status: str = "pending"
    is_resolved: bool = False
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

# --- AUTHENTICATION MODELS ---
class UserSignup(BaseModel):
    """Model for user registration"""
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    
    @field_validator('password')
    @classmethod
    def validate_password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserLogin(BaseModel):
    """Model for user login"""
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str

class UserProfile(BaseModel):
    """Model for user profile"""
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    """Model for JWT token"""
    access_token: str
    token_type: str = "bearer"
    user_id: Optional[str] = None

# --- RESPONSE MODELS ---
class MessageResponse(BaseModel):
    """Generic message response"""
    message: str
    success: bool = True

class DetailResponse(MessageResponse):
    """Response with additional details"""
    data: Optional[dict] = None
    detail: Optional[str] = None

# --- Careers PYDANTIC Models (for request/response) ---
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

# Job Pydantic Models
class JobBase(BaseModel):
    """Base model for job operations"""
    title: str = Field(..., min_length=2, max_length=200)
    department: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=2, max_length=100)
    job_type: JobType = JobType.FULL_TIME
    salary_range: Optional[str] = Field(None, max_length=100)
    experience_required: str = Field(..., min_length=2, max_length=200)
    education_required: Optional[str] = Field(None, max_length=200)
    description: str = Field(..., min_length=10)
    requirements: str = Field(..., min_length=10)
    benefits: Optional[str] = None
    is_active: bool = True
    application_deadline: Optional[datetime] = None
    
    @field_validator('application_deadline')
    @classmethod
    def validate_deadline(cls, v):
        if v and v < datetime.utcnow():
            raise ValueError('Application deadline must be in the future')
        return v

class JobCreate(JobBase):
    """Model for creating new jobs"""
    pass

class JobUpdate(BaseModel):
    """Model for updating jobs"""
    title: Optional[str] = Field(None, min_length=2, max_length=200)
    department: Optional[str] = Field(None, min_length=2, max_length=100)
    location: Optional[str] = Field(None, min_length=2, max_length=100)
    job_type: Optional[JobType] = None
    salary_range: Optional[str] = Field(None, max_length=100)
    experience_required: Optional[str] = Field(None, min_length=2, max_length=200)
    education_required: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = Field(None, min_length=10)
    requirements: Optional[str] = Field(None, min_length=10)
    benefits: Optional[str] = None
    is_active: Optional[bool] = None
    application_deadline: Optional[datetime] = None

class JobRead(JobBase):
    """Model for reading job data"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    applications_count: int = 0
    
    model_config = ConfigDict(from_attributes=True)

# Application Pydantic Models
class ApplicationBase(BaseModel):
    """Base model for job applications"""
    name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    cover_letter: Optional[str] = Field(None, max_length=5000)
    portfolio_url: Optional[str] = None
    source: str = "Company Website"
    job_id: int
    additional_info: Optional[str] = Field(None, max_length=2000)
    
    @field_validator('portfolio_url')
    @classmethod
    def validate_portfolio_url(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            raise ValueError('Portfolio URL must start with http:// or https://')
        return v

class ApplicationCreate(ApplicationBase):
    """Model for creating new applications"""
    pass

class ApplicationUpdate(BaseModel):
    """Model for updating applications (admin use)"""
    status: Optional[ApplicationStatus] = None
    internal_notes: Optional[str] = Field(None, max_length=2000)
    rating: Optional[int] = Field(None, ge=1, le=5)

class ApplicationRead(ApplicationBase):
    """Model for reading application data"""
    id: int
    job_title: str
    job_department: str
    job_type: str
    resume_filename: Optional[str] = None
    status: ApplicationStatus = ApplicationStatus.PENDING
    internal_notes: Optional[str] = None
    rating: Optional[int] = None
    applied_at: datetime
    status_updated_at: Optional[datetime] = None
    reviewed_by: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

# Combined response models
class ApplicationWithJob(ApplicationRead):
    """Application data with full job details"""
    job: Optional[JobRead] = None

class JobWithApplications(JobRead):
    """Job data with its applications"""
    applications: List[ApplicationRead] = []

# Stats models
class ApplicationStatusCount(BaseModel):
    """Counts of applications by status"""
    pending: int = 0
    reviewing: int = 0
    shortlisted: int = 0
    rejected: int = 0
    hired: int = 0

class DepartmentStats(BaseModel):
    """Statistics for a department"""
    department: str
    active_jobs: int
    total_jobs: int
    total_applications: int

class CareerStats(BaseModel):
    """Comprehensive career statistics"""
    total_jobs: int
    active_jobs: int
    total_applications: int
    status_counts: ApplicationStatusCount
    department_stats: List[DepartmentStats]
    average_time_to_hire: Optional[float] = None
    top_performing_jobs: List[dict] = []

# File upload models
class ResumeUpload(BaseModel):
    """Model for resume upload validation"""
    filename: str
    content_type: str
    size: int
    
    @field_validator('content_type')
    @classmethod
    def validate_content_type(cls, v):
        allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        if v not in allowed_types:
            raise ValueError(f'File type not allowed. Allowed: {", ".join(allowed_types)}')
        return v
    
    @field_validator('size')
    @classmethod
    def validate_size(cls, v):
        max_size = 5 * 1024 * 1024  # 5MB
        if v > max_size:
            raise ValueError('File size too large. Maximum size is 5MB')
        return v

# --- DATABASE TABLE MODELS (for reference/ORM if needed) ---
# Note: These are only needed if you use SQLAlchemy directly with Supabase
# If using Supabase client, the above Pydantic models are sufficient

# class ProjectTable(BaseModel, table=True):
#     __tablename__ = "projects"
#     id: Optional[int] = Field(default=None, primary_key=True)
#     title: str = Field(max_length=200)
#     description: str
#     tech_stack: List[str] = Field(default_factory=list)
#     image_url: Optional[str] = None
#     live_url: Optional[str] = None
#     github_url: Optional[str] = None
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: Optional[datetime] = None

# class TeamMemberTable(BaseModel, table=True):
#     __tablename__ = "team"
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str = Field(max_length=100)
#     role: str = Field(max_length=100)
#     bio: Optional[str] = None
#     image_url: Optional[str] = None
#     github_url: Optional[str] = None
#     linkedin_url: Optional[str] = None
#     twitter_url: Optional[str] = None
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: Optional[datetime] = None

# class InquiryTable(BaseModel, table=True):
#     __tablename__ = "inquiries"
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str = Field(max_length=100)
#     email: str = Field(max_length=255)
#     subject: Optional[str] = Field(None, max_length=200)
#     message: str
#     phone: Optional[str] = None
#     company: Optional[str] = Field(None, max_length=100)
#     status: str = Field(default="pending")
#     is_resolved: bool = Field(default=False)
#     created_at: datetime = Field(default_factory=datetime.utcnow)
#     updated_at: Optional[datetime] = None
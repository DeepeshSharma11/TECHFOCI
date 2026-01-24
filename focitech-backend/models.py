# models.py
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, validator
import re

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
    live_url: Optional[str] = None  # Changed from live_link
    github_url: Optional[str] = None  # Changed from github_link
    
    @validator('tech_stack')
    def validate_tech_stack(cls, v):
        if not v:
            raise ValueError('Tech stack cannot be empty')
        return v
    
    @validator('image_url', 'live_url', 'github_url')
    def validate_urls(cls, v, field):
        if v:
            # Allow empty URLs but validate if provided
            if not v.startswith(('http://', 'https://', '/')) and v != '':
                raise ValueError(f'{field.name} must be a valid URL starting with http://, https://, or /')
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
    
    class Config:
        from_attributes = True

# --- TEAM MEMBER MODELS ---
class TeamMemberBase(BaseModel):
    """Base model for team members"""
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None  # Changed from photo_url
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    
    @validator('image_url', 'github_url', 'linkedin_url', 'twitter_url')
    def validate_urls(cls, v, field):
        if v:
            if not v.startswith(('http://', 'https://', '/')) and v != '':
                raise ValueError(f'{field.name} must be a valid URL starting with http://, https://, or /')
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
    
    class Config:
        from_attributes = True

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
    
    class Config:
        from_attributes = True

# --- AUTHENTICATION MODELS ---
class UserSignup(BaseModel):
    """Model for user registration"""
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    
    @validator('password')
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
    
    class Config:
        from_attributes = True

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
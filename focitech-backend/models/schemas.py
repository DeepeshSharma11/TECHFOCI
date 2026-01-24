# schema.py
from pydantic import BaseModel, EmailStr, Field, validator, HttpUrl
from typing import List, Optional
from datetime import datetime
import re

# --- BASE MODELS ---
class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: datetime

# --- AUTHENTICATION SCHEMAS ---
class UserSignup(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=100)
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    
    @validator('password')
    def validate_password_strength(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str

class UserAuth(BaseModel):
    """Alternative auth schema for compatibility"""
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserProfile(BaseModel):
    """Schema for user profile data"""
    id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str = "bearer"
    user_id: str
    expires_in: Optional[int] = 3600  # seconds

# --- INQUIRY (CONTACT FORM) SCHEMAS ---
class InquiryBase(BaseModel):
    """Base schema for contact inquiries"""
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=10, max_length=2000)
    phone: Optional[str] = Field(None, pattern=r'^[\d\s\-\+\(\)]{10,20}$')
    company: Optional[str] = Field(None, max_length=100)

class InquiryCreate(InquiryBase):
    """Schema for creating new inquiries"""
    pass

class InquiryUpdate(BaseModel):
    """Schema for updating inquiries (admin use)"""
    status: Optional[str] = Field(None, pattern=r'^(pending|responded|resolved|spam)$')
    notes: Optional[str] = Field(None, max_length=1000)
    response: Optional[str] = Field(None, max_length=2000)

class InquiryRead(InquiryBase, TimestampMixin):
    """Schema for reading inquiry data"""
    id: int
    status: str = "pending"
    
    class Config:
        from_attributes = True

# --- PROJECT (PORTFOLIO) SCHEMAS ---
class ProjectBase(BaseModel):
    """Base schema for projects"""
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=20, max_length=5000)
    tech_stack: List[str] = Field(default_factory=list)
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: bool = False
    
    @validator('tech_stack')
    def validate_tech_stack(cls, v):
        if not v:
            raise ValueError('Tech stack cannot be empty')
        if len(v) > 10:
            raise ValueError('Tech stack cannot have more than 10 items')
        return v
    
    @validator('image_url', 'live_url', 'github_url')
    def validate_urls(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            # Allow relative URLs for image_url only
            if not v.startswith('/') and 'image_url' not in cls.__fields__:
                raise ValueError('URL must start with http://, https:// or /')
        return v

class ProjectCreate(ProjectBase):
    """Schema for creating new projects"""
    pass

class ProjectUpdate(BaseModel):
    """Schema for updating projects"""
    title: Optional[str] = Field(None, min_length=3, max_length=200)
    description: Optional[str] = Field(None, min_length=20, max_length=5000)
    tech_stack: Optional[List[str]] = None
    image_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    featured: Optional[bool] = None

class ProjectRead(ProjectBase, TimestampMixin):
    """Schema for reading project data"""
    id: int
    
    class Config:
        from_attributes = True

# --- TEAM MEMBER SCHEMAS ---
class TeamMemberBase(BaseModel):
    """Base schema for team members"""
    name: str = Field(..., min_length=2, max_length=100)
    role: str = Field(..., min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[EmailStr] = None
    order_index: int = 0  # For sorting team members
    
    @validator('image_url', 'github_url', 'linkedin_url', 'twitter_url')
    def validate_urls(cls, v):
        if v and not v.startswith(('http://', 'https://')):
            # Allow relative URLs for image_url only
            if not v.startswith('/') and 'image_url' not in cls.__fields__:
                raise ValueError('URL must start with http://, https:// or /')
        return v

class TeamMemberCreate(TeamMemberBase):
    """Schema for creating new team members"""
    pass

class TeamMemberUpdate(BaseModel):
    """Schema for updating team members"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    email: Optional[EmailStr] = None
    order_index: Optional[int] = None

class TeamMemberRead(TeamMemberBase, TimestampMixin):
    """Schema for reading team member data"""
    id: int
    
    class Config:
        from_attributes = True

# --- RESPONSE SCHEMAS ---
class MessageResponse(BaseModel):
    """Generic success/error response"""
    message: str
    success: bool = True
    status_code: int = 200

class DetailResponse(MessageResponse):
    """Response with additional details"""
    detail: Optional[dict] = None
    data: Optional[dict] = None

class ListResponse(BaseModel):
    """Response for list endpoints"""
    data: List
    total: int
    page: int = 1
    limit: int = 20
    has_more: bool = False

class ErrorResponse(BaseModel):
    """Error response schema"""
    detail: str
    error_code: Optional[str] = None
    field: Optional[str] = None

# --- FILTER/PAGINATION SCHEMAS ---
class PaginationParams(BaseModel):
    """Schema for pagination parameters"""
    page: int = 1
    limit: int = 20
    
    @validator('page')
    def validate_page(cls, v):
        if v < 1:
            return 1
        return v
    
    @validator('limit')
    def validate_limit(cls, v):
        if v < 1:
            return 1
        if v > 100:
            return 100
        return v

class ProjectFilterParams(PaginationParams):
    """Schema for project filtering"""
    search: Optional[str] = None
    tech: Optional[str] = None
    featured: Optional[bool] = None
    sort_by: str = "created_at"
    sort_order: str = "desc"

class TeamFilterParams(PaginationParams):
    """Schema for team filtering"""
    search: Optional[str] = None
    role: Optional[str] = None
    sort_by: str = "order_index"
    sort_order: str = "asc"

class InquiryFilterParams(PaginationParams):
    """Schema for inquiry filtering"""
    status: Optional[str] = None
    search: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    sort_by: str = "created_at"
    sort_order: str = "desc"
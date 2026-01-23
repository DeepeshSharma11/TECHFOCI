from pydantic import BaseModel, EmailStr, Field
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
    id: str  # Updated to string as Supabase uses UUID strings
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
    # FIXED: Made subject required to match database column requirements
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
    tech_stack: List[str] = Field(default_factory=list) # Critical for your 422 fix
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
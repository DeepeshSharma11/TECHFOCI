from pydantic import BaseModel, EmailStr, HttpUrl, Field
from typing import List, Optional
from datetime import datetime

# --- AUTHENTICATION SCHEMAS ---
# Used for processing Login and Signup requests
class UserAuth(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)

class Token(BaseModel):
    access_token: str
    token_type: str

# --- INQUIRY (CONTACT FORM) SCHEMAS ---
class InquiryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    message: str = Field(..., min_length=10, max_length=2000)

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    status: Optional[str] = "pending"  # e.g., 'pending', 'resolved', 'spam'
    message: Optional[str] = None

class InquiryRead(InquiryBase):
    id: int
    created_at: datetime
    status: str

    class Config:
        from_attributes = True

# --- PROJECT (PORTFOLIO) SCHEMAS ---
class ProjectBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: str
    tech_stack: List[str]
    image_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    image_url: Optional[HttpUrl] = None

class ProjectRead(ProjectBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- TEAM MEMBER SCHEMAS ---
class TeamMemberBase(BaseModel):
    name: str
    role: str
    bio: Optional[str] = None
    photo_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[HttpUrl] = None
    linkedin_url: Optional[HttpUrl] = None

class TeamMemberRead(TeamMemberBase):
    id: int
    
    class Config:
        from_attributes = True


# Signup ke liye data structure
class UserSignup(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str
    phone: Optional[str] = None

# Login ke liye data structure
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token response ke liye
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
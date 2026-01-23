from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, ARRAY, String, Column

# Base class for common fields
class BaseTimestamp(SQLModel):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# --- Projects Table ---
class Project(SQLModel, table=True):
    """
    Supabase 'projects' table definition.
    Includes validation for tech_stack and URLs.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True, max_length=100)
    description: str = Field(nullable=False)
    
    # Storing tech_stack as a list (Postgres Array)
    tech_stack: List[str] = Field(sa_column=Column(ARRAY(String)))
    
    image_url: Optional[str] = None
    live_link: Optional[str] = None
    github_link: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

# --- Team Table ---
class TeamMember(SQLModel, table=True):
    """
    Supabase 'team' table definition.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    role: str = Field(max_length=50) # e.g., "Lead Developer", "Founder"
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    
    # Social Links
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None

# --- Inquiries Table (Bonus for Admin Page) ---
class ContactInquiry(SQLModel, table=True):
    """
    For your AdminInquiries.jsx page.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    message: str
    is_resolved: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
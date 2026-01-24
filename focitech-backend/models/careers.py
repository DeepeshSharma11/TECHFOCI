# models/careers.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .base import Base

class JobOpening(Base):
    __tablename__ = "job_openings"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    department = Column(String(100), nullable=False)
    location = Column(String(100), nullable=False)
    job_type = Column(String(50), nullable=False)  # full-time, part-time, contract, internship, remote, hybrid
    salary_range = Column(String(100))
    experience_required = Column(String(100))
    description = Column(Text, nullable=False)
    requirements = Column(Text)
    benefits = Column(Text)
    is_active = Column(Boolean, default=True)
    posted_date = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CareerApplication(Base):
    __tablename__ = "career_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False, index=True)
    phone = Column(String(20))
    cover_letter = Column(Text)
    portfolio_url = Column(String(500))
    resume_filename = Column(String(200), nullable=False)
    job_id = Column(Integer, ForeignKey("job_openings.id"), nullable=False)
    job_title = Column(String(200), nullable=False)
    status = Column(String(50), default="pending")  # pending, reviewing, shortlisted, rejected, hired
    notes = Column(Text)
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
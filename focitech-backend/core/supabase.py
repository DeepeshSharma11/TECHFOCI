# core/supabase.py
import os
from supabase import create_client, Client
import logging

logger = logging.getLogger(__name__)

# Try to initialize Supabase client
try:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_KEY")
    supabase_service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    
    if supabase_url and supabase_key:
        supabase: Client = create_client(supabase_url, supabase_key)
        logger.info("✅ Supabase client initialized successfully")
        
        # Create tables if they don't exist
        try:
            # Check if jobs table exists
            result = supabase.table("jobs").select("count", count="exact").limit(1).execute()
            logger.info("✅ Jobs table is accessible")
        except Exception as e:
            logger.warning(f"⚠️ Jobs table may not exist: {e}")
            
            # SQL to create tables
            create_tables_sql = """
            -- Create jobs table
            CREATE TABLE IF NOT EXISTS jobs (
                id BIGSERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                department VARCHAR(100) NOT NULL,
                location VARCHAR(100) NOT NULL,
                job_type VARCHAR(50) NOT NULL,
                salary_range VARCHAR(100),
                experience_required VARCHAR(100) NOT NULL,
                education_required TEXT,
                description TEXT NOT NULL,
                requirements TEXT NOT NULL,
                benefits TEXT,
                is_active BOOLEAN DEFAULT true,
                application_deadline TIMESTAMP,
                posted_date TIMESTAMP DEFAULT NOW(),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            -- Create job_applications table
            CREATE TABLE IF NOT EXISTS job_applications (
                id BIGSERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                cover_letter TEXT,
                portfolio_url VARCHAR(500),
                resume_filename VARCHAR(255),
                job_id BIGINT NOT NULL,
                job_title VARCHAR(255),
                job_department VARCHAR(100),
                job_type VARCHAR(50),
                status VARCHAR(50) DEFAULT 'pending',
                internal_notes TEXT,
                source VARCHAR(100) DEFAULT 'Company Website',
                additional_info TEXT,
                applied_at TIMESTAMP DEFAULT NOW(),
                status_updated_at TIMESTAMP,
                FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
            );

            -- Create indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
            CREATE INDEX IF NOT EXISTS idx_jobs_department ON jobs(department);
            CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
            CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
            CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON job_applications(applied_at DESC);
            """
            
            logger.info("📋 Table creation SQL prepared (run this in Supabase SQL editor)")
            
    else:
        raise ValueError("Supabase URL or key not found in environment variables")
        
except Exception as e:
    logger.error(f"❌ Failed to initialize Supabase client: {e}")
    logger.warning("⚠️ Running in mock mode - data will not be persisted")
    
    # Create mock client for development
    class MockSupabase:
        class table:
            def __init__(self, name):
                self.name = name
                self.data = []
                
            def select(self, *args):
                return self
                
            def insert(self, data):
                if isinstance(data, dict):
                    data['id'] = len(self.data) + 1
                    self.data.append(data)
                elif isinstance(data, list):
                    for item in data:
                        item['id'] = len(self.data) + 1
                        self.data.append(item)
                return self
                
            def update(self, data):
                return self
                
            def delete(self):
                return self
                
            def eq(self, column, value):
                return self
                
            def ilike(self, column, pattern):
                return self
                
            def order(self, column, desc=False):
                return self
                
            def range(self, start, end):
                return self
                
            def execute(self):
                return type('obj', (object,), {'data': self.data})()
    
    supabase = MockSupabase()
    logger.warning("⚠️ Using mock Supabase client for development")
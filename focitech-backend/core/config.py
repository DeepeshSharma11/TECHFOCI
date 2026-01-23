import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic_settings import BaseSettings

# 1. Setup paths and load .env file for local testing
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    # --- Project Metadata ---
    PROJECT_NAME: str = "Focitech Pvt. Ltd. Enterprise API"
    PROJECT_VERSION: str = "2.0.0"
    
    # Converts "True" string to actual Boolean True/False
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # --- Supabase Configuration ---
    # These will be pulled from Render's Environment Variables
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET") 
    
    # --- Server Settings ---
    # IMPORTANT: Render gives you a dynamic port. This line catches it.
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = "0.0.0.0"
    
    # --- CORS Settings ---
    # Add your Netlify URL here so the frontend can talk to the backend
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://technoviax.netlify.app", # Replace with your live Netlify link
    ]

    class Config:
        case_sensitive = True

# Initialize settings
settings = Settings()

# --- Global Supabase Client Initialization ---
def init_supabase() -> Client:
    """Helper function to safely connect to Supabase."""
    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
            # If keys are missing, we print a clear error for Render logs
            print("❌ Error: SUPABASE_URL or SUPABASE_KEY is missing!")
            return None
            
        client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        print(f"✅ {settings.PROJECT_NAME} connected to Supabase successfully.")
        return client
    except Exception as e:
        print(f"❌ Connection Error: {str(e)}")
        return None

# Create the global supabase object
supabase = init_supabase()
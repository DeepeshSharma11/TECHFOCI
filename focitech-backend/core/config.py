import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic_settings import BaseSettings # Correct ✅

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    # --- Project Metadata ---
    PROJECT_NAME: str = "Focitech Pvt. Ltd. Enterprise API"
    PROJECT_VERSION: str = "2.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    
    # --- Supabase Configuration ---
    SUPABASE_URL: str = os.getenv("SUPABASE_URL")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY")
    # This is used to verify JWT tokens in your get_current_user middleware
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET") 
    
    # --- Server Settings ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # --- CORS Settings ---
    # Add your Vercel/Netlify URL here once you deploy
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        case_sensitive = True

# Initialize settings
settings = Settings()

# --- Global Supabase Client Initialization ---
try:
    if not settings.SUPABASE_URL or not settings.SUPABASE_KEY:
        raise ValueError("Missing Supabase credentials in .env")
        
    supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    print(f"✅ {settings.PROJECT_NAME} connected to Supabase successfully.")
except Exception as e:
    print(f"❌ Connection Error: {e}")
    # In a real enterprise app, we log this to a file
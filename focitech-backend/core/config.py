import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client
from pydantic_settings import BaseSettings

# 1. Setup paths and load .env file
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(os.path.join(BASE_DIR, ".env"))

class Settings(BaseSettings):
    # --- Project Metadata ---
    PROJECT_NAME: str = "Focitech Pvt. Ltd. Enterprise API"
    PROJECT_VERSION: str = "2.0.0"
    
    # Render environment variable handle
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # --- Supabase Configuration ---
    # Render environment variables se direct fetch karega
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "") 
    
    # --- Server Settings ---
    # Render automatically sets PORT variable
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = "0.0.0.0"
    
    # --- CORS Settings ---
    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://technoviax.netlify.app",
        "https://focitech.site"
    ]

    class Config:
        case_sensitive = True

# Settings initialize karein
settings = Settings()

# --- Global Supabase Client Initialization ---
def init_supabase() -> Client:
    """Safely connect to Supabase without crashing the app build."""
    try:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_KEY
        
        if not url or not key:
            print("⚠️ Warning: SUPABASE_URL or SUPABASE_KEY missing in Environment!")
            return None
            
        client = create_client(url, key)
        print(f"✅ {settings.PROJECT_NAME} connected to Supabase.")
        return client
    except Exception as e:
        # Build ke waqt error handle karein taaki Render deploy reject na kare
        print(f"❌ Supabase Connection Error: {str(e)}")
        return None

# Global client object
supabase = init_supabase()
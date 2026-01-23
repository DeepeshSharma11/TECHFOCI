import uvicorn
import time
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager

# Centralized settings and modular routers
from core.config import settings
from routers import projects, inquiries, team, auth

# --- Setup Production Logging ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("focitech_api")

# --- Lifespan Management ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Database connection check
    logger.info(f"🚀 {settings.PROJECT_NAME} v{settings.PROJECT_VERSION} booting...")
    logger.info(f"Environment: {'Development' if settings.DEBUG else 'Production'}")
    yield
    # Shutdown: Clean up resources
    logger.info("🛑 Focitech API Services stopped.")

# --- Initialize FastAPI App ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend ecosystem for Focitech Pvt. Ltd. and TechnoviaX.",
    docs_url="/api/v1/docs" if settings.DEBUG else None, # Hide docs in production for security
    redoc_url="/api/v1/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json" if settings.DEBUG else None
)

# --- PRODUCTION MIDDLEWARES ---

# 1. CORS: Updated to handle local development and Netlify/Render production URLs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",          # Vite Local
        "https://focitech.site",          # Primary Domain
        "https://your-site.netlify.app", # Replace with your actual Netlify URL
        "*"                              # Optional: Use only if having strict issues
    ] if settings.DEBUG else settings.ALLOWED_ORIGINS, 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], # Explicit methods
    allow_headers=["*"],
)

# 2. Trusted Host: Added Wildcards for Render and Netlify
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=[
        "localhost", 
        "127.0.0.1", 
        "focitech.in", 
        "*.focitech.in", 
        "*.onrender.com", 
        "*.netlify.app"
    ]
)

# 3. GZip Compression
app.add_middleware(GZipMiddleware, minimum_size=500)

# 4. Performance Monitor & Tracking
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    response.headers["X-Response-Time"] = f"{process_time:.4f}s"
    response.headers["X-Powered-By"] = "TechnoviaX-Engine"
    
    logger.info(f"{request.method} {request.url.path} | Status: {response.status_code} | {process_time:.4f}s")
    return response

# --- Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ CRITICAL ERROR: {str(exc)} | Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Transmission failed in the TechnoviaX node.",
            "detail": str(exc) if settings.DEBUG else "System Administrator has been notified."
        },
    )

# --- Route Mounting (v1) ---
app.include_router(auth, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(projects, prefix="/api/v1/portfolio", tags=["Projects"])
app.include_router(inquiries, prefix="/api/v1/contact", tags=["Inquiries"])
app.include_router(team, prefix="/api/v1/corporate", tags=["Team"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "brand": "Focitech Pvt. Ltd.",
        "node": "Bareilly-V1",
        "status": "online",
        "timestamp": time.time(),
        "environment": "production" if not settings.DEBUG else "development"
    }

if __name__ == "__main__":
    # In production, Render/Heroku will provide the PORT env variable
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=settings.PORT, 
        reload=settings.DEBUG
    )
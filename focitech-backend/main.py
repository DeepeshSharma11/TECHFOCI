import uvicorn
import time
import logging
from typing import Annotated
from fastapi import FastAPI, Request, Depends
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
    # Initial verification can be added here
    yield
    # Shutdown: Clean up resources
    logger.info("🛑 Focitech API Services stopped.")

# --- Initialize FastAPI App ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend ecosystem for Focitech Pvt. Ltd. and TechnoviaX.",
    # Auto-redirect for trailing slashes to avoid 404s
    redirect_slashes=True, 
    docs_url="/api/v1/docs" if settings.DEBUG else None, 
    redoc_url="/api/v1/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json" if settings.DEBUG else None
)

# --- PRODUCTION MIDDLEWARES ---

# 1. CORS: Fixed to ensure Netlify and Local Vite both work
# Added specific origins and handled the wildcard for preflight requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://focitech.site",
        "https://technoviax.netlify.app", # Your current Netlify build
        "https://focitech1.netlify.app",
    ] if not settings.DEBUG else ["*"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
    expose_headers=["X-Response-Time", "X-Powered-By"]
)

# 2. Trusted Host: Essential for Render production security
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=[
        "localhost", 
        "127.0.0.1", 
        "focitech.site",
        "techfoci.onrender.com", # Your Render Subdomain
        "*.onrender.com", 
        "*.netlify.app"
    ]
)

# 3. GZip Compression for faster data transfer
app.add_middleware(GZipMiddleware, minimum_size=500)

# 4. Performance Monitor Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        
        response.headers["X-Response-Time"] = f"{process_time:.4f}s"
        response.headers["X-Powered-By"] = "TechnoviaX-Engine"
        
        logger.info(f"{request.method} {request.url.path} | Status: {response.status_code} | {process_time:.4f}s")
        return response
    except Exception as e:
        logger.error(f"Middleware Error: {str(e)}")
        return JSONResponse(status_code=500, content={"detail": "Internal Server Error"})

# --- Global Exception Handler ---
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"❌ CRITICAL ERROR: {str(exc)} | Path: {request.url.path}")
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Transmission failed in the TechnoviaX node.",
            "detail": str(exc) if settings.DEBUG else "Internal Node Error"
        },
    )

# --- Route Mounting (v1) ---
# IMPORTANT: Ensure prefixes match exactly with what the frontend calls
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/v1/portfolio", tags=["Projects"])
app.include_router(inquiries.router, prefix="/api/v1/contact", tags=["Inquiries"])
app.include_router(team.router, prefix="/api/v1/corporate", tags=["Team"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "brand": "Focitech Pvt. Ltd.",
        "node": "Bareilly-V1",
        "status": "online",
        "timestamp": time.time(),
        "environment": "production" if not settings.DEBUG else "development",
        "engine": "TechnoviaX-V2"
    }

if __name__ == "__main__":
    # Render sets the PORT environment variable automatically
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=settings.PORT, 
        reload=settings.DEBUG,
        proxy_headers=True,
        forwarded_allow_ips="*"
    )
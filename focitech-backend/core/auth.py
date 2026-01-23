from fastapi import Request, HTTPException, Depends, status
from core.config import supabase
from typing import Annotated
import logging

# Configure logger for TechnoviaX tracking
logger = logging.getLogger("focitech_api")

async def get_current_user(request: Request):
    """
    Middleware to verify the Supabase JWT token.
    Extracts the user session and ensures they are authorized to access protected 
    Focitech endpoints.
    """
    auth_header = request.headers.get("Authorization")
    
    # 1. Strict Header Validation
    if not auth_header or not auth_header.startswith("Bearer "):
        logger.warning(f"Unauthorized access attempt on {request.url.path}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # 2. Secure Token Extraction
    try:
        # Split 'Bearer <token>' safely
        parts = auth_header.split()
        if len(parts) != 2:
            raise ValueError("Token format must be 'Bearer <token>'")
        token = parts[1]
    except (IndexError, ValueError) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Malformed Authorization header: {str(e)}",
        )
    
    # 3. Validation with Supabase Auth Server
    try:
        # This call verifies the JWT signature and expiration
        response = supabase.auth.get_user(token)
        
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User session is invalid or has expired."
            )
        
        # Log successful admin actions for security audit
        if request.method in ["POST", "PUT", "DELETE"]:
            logger.info(f"Admin Action: {request.method} by {response.user.email}")
            
        return response.user
        
    except Exception as e:
        # Specific handling for Supabase Auth errors
        error_msg = str(e)
        logger.error(f"Supabase Auth Error: {error_msg}")
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Your session has expired. Please sign in again."
        )

# --- Role Based Access Control (RBAC) ---

def role_required(required_role: str):
    """
    Enforces specific roles (e.g., 'admin') for TechnoviaX internal routes.
    """
    async def role_checker(user: Annotated[dict, Depends(get_current_user)]):
        # Extract role from Supabase app_metadata
        user_role = user.app_metadata.get("role", "authenticated")
        
        if user_role != required_role:
            logger.warning(f"Permission Denied: User {user.email} tried to access {required_role} route")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Access denied: This action requires {required_role} privileges."
            )
        return user
    return role_checker

# --- Type Alias for cleaner Router code ---
CurrentUser = Annotated[dict, Depends(get_current_user)]
AdminUser = Annotated[dict, Depends(role_required("admin"))]
from fastapi import Request, HTTPException, Depends, status
from core.config import supabase
from typing import Annotated
import logging

# Logger setup
logger = logging.getLogger("focitech_api")

async def get_current_user(request: Request):
    """
    Middleware to verify the Supabase JWT token.
    """
    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = auth_header.split(" ")[1]
    
    try:
        # Supabase se user verify kar rahe hain
        response = supabase.auth.get_user(token)
        
        if not response or not response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User session is invalid or expired."
            )
            
        return response.user
        
    except Exception as e:
        logger.error(f"Auth Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Session expired. Please sign in again."
        )

def role_required(required_role: str):
    """
    Check if the user has admin or other specific roles.
    """
    async def role_checker(user: Annotated[dict, Depends(get_current_user)]):
        # Supabase metadata se role check kar rahe hain
        user_role = user.app_metadata.get("role", "authenticated")
        
        if user_role != required_role:
            logger.warning(f"Access Denied: {user.email} tried to access {required_role} route")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, 
                detail=f"Access denied: {required_role} privileges required."
            )
        return user
    return role_checker

# --- Type Aliases for Routers ---
CurrentUser = Annotated[dict, Depends(get_current_user)]
AdminUser = Annotated[dict, Depends(role_required("admin"))]
from fastapi import APIRouter, Depends, HTTPException, status
from core.config import supabase
from schemas import UserAuth, Token, UserRead, UserCreate
from typing import Annotated
import logging

# Logger setup
logger = logging.getLogger("focitech_api")

router = APIRouter()

@router.post("/signup", response_model=UserRead, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate):
    """
    Register a new user in the Focitech ecosystem using Supabase Auth.
    """
    try:
        # 1. Create user in Supabase
        response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name,
                    "role": "authenticated" # Default role
                }
            }
        })

        if not response.user:
            raise HTTPException(
                status_code=400, 
                detail="Signup failed. User might already exist."
            )

        logger.info(f"🆕 New User Registered: {user_data.email}")
        
        return {
            "id": 0, # Supabase user IDs are UUID strings, adjust schema if needed
            "email": response.user.email,
            "full_name": user_data.full_name,
            "is_active": True,
            "created_at": response.user.created_at
        }

    except Exception as e:
        logger.error(f"Signup Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=Token)
async def login(credentials: UserAuth):
    """
    Authenticate user and return Supabase JWT token.
    """
    try:
        response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not response.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        logger.info(f"🔑 User Logged In: {credentials.email}")

        # Construct response with User data for frontend context
        return {
            "access_token": response.session.access_token,
            "token_type": "bearer",
            "user": {
                "id": 0,
                "email": response.user.email,
                "full_name": response.user.user_metadata.get("full_name"),
                "is_active": True,
                "created_at": response.user.created_at
            }
        }

    except Exception as e:
        logger.warning(f"Login failed for {credentials.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed. Please check your credentials."
        )

@router.post("/logout")
async def logout():
    """
    Global logout (Client will also need to clear local storage)
    """
    supabase.auth.sign_out()
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserRead)
async def get_me(current_user: Annotated[dict, Depends(supabase.auth.get_user)]):
    """
    Fetch current logged-in user details (Token validation test)
    """
    return {
        "email": current_user.user.email,
        "full_name": current_user.user.user_metadata.get("full_name"),
        "id": 0,
        "is_active": True,
        "created_at": current_user.user.created_at
    }
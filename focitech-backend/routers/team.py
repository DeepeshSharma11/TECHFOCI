from fastapi import APIRouter, HTTPException, Depends, status, Response
from typing import List, Optional
from core.config import supabase
from dependencies import AdminUser, CurrentUser # Using our refined dependency
from schemas import TeamMemberRead, TeamMemberCreate, TeamMemberUpdate
import logging

# Logger for HR/Team management
logger = logging.getLogger("focitech_api")

router = APIRouter()

# --- PUBLIC ENDPOINTS ---

@router.get("/", response_model=List[TeamMemberRead])
async def get_team():
    """
    READ: Fetch the entire Focitech team list.
    Public: Used for the 'About Us' or 'Team' page.
    """
    try:
        # Sorting by ID ensures consistent order on the UI
        response = supabase.table("team").select("*").order("id", desc=False).execute()
        return response.data
    except Exception as e:
        logger.error(f"Failed to fetch team: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Analytics engine failed to retrieve team data."
        )

@router.get("/{member_id}", response_model=TeamMemberRead)
async def get_team_member(member_id: int):
    """READ: Fetch deep details of a specific team member."""
    response = supabase.table("team").select("*").eq("id", member_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Team member profile not found.")
    return response.data[0]

# --- ADMIN PROTECTED ENDPOINTS (TechnoviaX Management) ---

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=TeamMemberRead)
async def add_team_member(member: TeamMemberCreate, admin: AdminUser):
    """
    CREATE: Add a new professional to the team.
    SECURE: Only Admins can modify the organization structure.
    """
    data = member.model_dump()
    
    # Default photo if none provided
    if not data.get("photo_url"):
        data["photo_url"] = "https://ui-avatars.com/api/?name=" + data["name"].replace(" ", "+")

    result = supabase.table("team").insert(data).execute()
    
    if not result.data:
        raise HTTPException(status_code=400, detail="Database rejected team entry.")
    
    logger.info(f"👤 New Team Member '{member.name}' added by {admin.email}")
    return result.data[0]

@router.patch("/{member_id}", response_model=TeamMemberRead)
async def update_team_member(
    member_id: int, 
    member: TeamMemberUpdate, 
    admin: AdminUser
):
    """
    UPDATE: Partially update team member details (Bio, Role, Socials).
    SECURE: Admin privileges required.
    """
    # exclude_unset=True ensures we only update fields sent by the frontend
    update_data = {k: v for k, v in member.model_dump(exclude_unset=True).items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="Modification request is empty.")

    result = supabase.table("team").update(update_data).eq("id", member_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Target member not found.")
        
    logger.info(f"🔄 Member {member_id} profile updated by {admin.email}")
    return result.data[0]

@router.delete("/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_team_member(member_id: int, admin: AdminUser):
    """
    DELETE: Remove a member from the database.
    SECURE: High-level admin action.
    """
    # Existence check
    check = supabase.table("team").select("id").eq("id", member_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Member already removed or non-existent.")

    supabase.table("team").delete().eq("id", member_id).execute()
    logger.warning(f"🗑️ Team Member {member_id} removed from ecosystem by {admin.email}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
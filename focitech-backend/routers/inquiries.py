from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from schemas import InquiryCreate, InquiryUpdate, InquiryRead
from core.config import supabase
from dependencies import AdminUser
from typing import List
import logging

logger = logging.getLogger("focitech_api")
router = APIRouter()

# --- HELPER: BACKGROUND TASKS ---
def notify_admin_of_inquiry(name: str, email: str):
    # Potential for future email integration (SendGrid/Postmark)
    logger.info(f"📧 NEW INQUIRY: {name} ({email}) registered in the Focitech ecosystem.")

# --- PUBLIC ENDPOINT: CONTACT FORM ---

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry: InquiryCreate, background_tasks: BackgroundTasks):
    """
    Public entry point for lead generation. 
    Matches the updated 'subject' mandatory schema.
    """
    try:
        data = inquiry.model_dump()
        result = supabase.table("inquiries").insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=400, detail="Database insertion failed.")

        background_tasks.add_task(notify_admin_of_inquiry, inquiry.name, inquiry.email)
        logger.info(f"✅ Secure Transmission: Lead received from {inquiry.email}")
        return {"status": "success", "message": "Your inquiry node has been synchronized."}

    except Exception as e:
        logger.error(f"❌ Transmission Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

# --- ADMIN PROTECTED ENDPOINTS ---

@router.get("/", response_model=List[InquiryRead])
async def get_all_inquiries(admin: AdminUser):
    """
    Retrieve all client leads. Admin node access required.
    """
    result = supabase.table("inquiries").select("*").order("created_at", desc=True).execute()
    return result.data

# FIXED: Changed from @router.patch to @router.put to fix the 405 error
@router.put("/{inquiry_id}") 
async def update_inquiry_status(inquiry_id: int, update: InquiryUpdate, admin: AdminUser):
    """
    UPDATE: Synchronize inquiry status (e.g., 'pending' to 'resolved').
    Matches Frontend PUT request protocol.
    """
    try:
        # Filter out unset fields to prevent accidental overwrites
        update_data = {k: v for k, v in update.model_dump(exclude_unset=True).items()}
        
        result = supabase.table("inquiries").update(update_data).eq("id", inquiry_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Inquiry node not found in cloud.")
            
        logger.info(f"🛠 Status Override: Node {inquiry_id} updated by Admin: {admin.email}")
        return {"message": "Protocol updated", "data": result.data[0]}
    except Exception as e:
        logger.error(f"❌ Protocol Update Failure: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_inquiry(inquiry_id: int, admin: AdminUser):
    """
    PURGE: Permanently erase an inquiry record.
    """
    check = supabase.table("inquiries").select("id").eq("id", inquiry_id).execute()
    if not check.data:
        raise HTTPException(status_code=404, detail="Inquiry node not found.")

    supabase.table("inquiries").delete().eq("id", inquiry_id).execute()
    logger.warning(f"🗑 Erasure Protocol: Node {inquiry_id} purged by Admin: {admin.email}")
    return None
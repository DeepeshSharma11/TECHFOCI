from fastapi import APIRouter, HTTPException, Query, Depends, status, Response
from typing import List, Optional
from core.config import supabase, settings
from dependencies import CurrentUser, AdminUser # Using the refined dependencies
from schemas import ProjectCreate, ProjectRead, ProjectUpdate
import json
import logging

# Logger for tracking portfolio activity
logger = logging.getLogger("focitech_api")

router = APIRouter()

# --- PUBLIC ENDPOINTS ---

@router.get("/", response_model=List[ProjectRead])
async def get_projects(
    tech: Optional[str] = Query(None, description="Filter by tech stack (e.g. React)"),
    search: Optional[str] = Query(None, description="Search in title or description"),
    limit: int = Query(20, le=100),
    offset: int = 0
):
    """
    READ: Fetch projects with advanced multi-filter and pagination.
    Perfect for infinite scroll or 'Load More' buttons on the frontend.
    """
    try:
        query = supabase.table("projects").select("*")

        if tech:
            # Postgres 'contains' operator for array column
            query = query.filter("tech_stack", "cs", f"{{{tech}}}")

        if search:
            # Case-insensitive partial search on Title or Description
            query = query.or_(f"title.ilike.%{search}%,description.ilike.%{search}%")
        
        # Applying pagination range and latest-first order
        result = query.order("created_at", desc=True).range(offset, offset + limit - 1).execute()
        
        return result.data
    except Exception as e:
        logger.error(f"Portfolio Fetch Error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Could not retrieve portfolio data."
        )

@router.get("/{project_id}", response_model=ProjectRead)
async def get_single_project(project_id: int):
    """READ: Fetch deep details for a single project card."""
    result = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Project not found.")
    return result.data[0]

# --- ADMIN PROTECTED ENDPOINTS ---

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=ProjectRead)
async def add_project(project: ProjectCreate, admin: AdminUser):
    """
    CREATE: Only Focitech Admins can add new projects.
    """
    data = project.model_dump()
    
    # Auto-sanitize tech_stack if sent as a string by mistake
    if isinstance(data.get('tech_stack'), str):
        data['tech_stack'] = [t.strip() for t in data['tech_stack'].split(',')]

    result = supabase.table("projects").insert(data).execute()
    if not result.data:
        raise HTTPException(status_code=400, detail="Database insertion failed.")
    
    logger.info(f"🚀 Project '{project.title}' added by {admin.email}")
    return result.data[0]

@router.patch("/{project_id}", response_model=ProjectRead) # Changed to PATCH for partial updates
async def update_project(
    project_id: int, 
    project: ProjectUpdate, 
    admin: AdminUser
):
    """UPDATE: Modify existing projects. Supports partial field updates."""
    update_data = {k: v for k, v in project.model_dump(exclude_unset=True).items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No changes provided.")

    result = supabase.table("projects").update(update_data).eq("id", project_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Target project not found.")
    
    logger.info(f"📝 Project {project_id} updated by {admin.email}")
    return result.data[0]

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, admin: AdminUser):
    """DELETE: Permanently wipe a project from the portfolio."""
    # Pre-check existence
    exists = supabase.table("projects").select("id").eq("id", project_id).execute()
    if not exists.data:
        raise HTTPException(status_code=404, detail="Project already deleted.")
         
    supabase.table("projects").delete().eq("id", project_id).execute()
    logger.warning(f"🗑️ Project {project_id} deleted by Admin {admin.email}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.get("/admin/export-data", tags=["Admin Only"])
async def export_projects_data(admin: AdminUser):
    """
    EXPORT: Secured data export for TechnoviaX internal records.
    """
    result = supabase.table("projects").select("*").execute()
    content = json.dumps(result.data, indent=4)
    filename = f"focitech_projects_export.json"
    
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
"""
Supabase Auth Service - Handles user authentication and session management.
"""
from typing import Optional
from fastapi import HTTPException, Request, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client

from ..config import get_settings
from ..schemas import UserResponse

security = HTTPBearer(auto_error=False)


def get_supabase_client() -> Client:
    """Get Supabase client instance."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_anon_key)


def get_supabase_admin_client() -> Client:
    """Get Supabase admin client with service role key."""
    settings = get_settings()
    return create_client(settings.supabase_url, settings.supabase_service_key)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[UserResponse]:
    """
    Get the current authenticated user from the JWT token.
    Returns None if no token is provided (for optional auth).
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        supabase = get_supabase_client()
        
        # Verify the JWT token with Supabase
        user_response = supabase.auth.get_user(token)
        
        if user_response and user_response.user:
            return UserResponse(
                id=user_response.user.id,
                email=user_response.user.email or "",
                created_at=str(user_response.user.created_at) if user_response.user.created_at else None
            )
        return None
    except Exception as e:
        print(f"Auth error: {e}")
        return None


async def require_auth(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> UserResponse:
    """
    Require authentication - raises 401 if not authenticated.
    Use this as a dependency for protected routes.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="Authentication required")
    
    user = await get_current_user(credentials)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    return user


# ============== CONTENT HISTORY DATABASE OPERATIONS ==============

async def save_content_history(
    user_id: str,
    format: str,
    content: str,
    original_title: Optional[str] = None,
    psychology: Optional[dict] = None,
    image_url: Optional[str] = None
) -> dict:
    """Save generated content to user's history."""
    supabase = get_supabase_admin_client()
    
    data = {
        "user_id": user_id,
        "format": format,
        "content": content,
        "original_title": original_title,
        "psychology": psychology,
        "image_url": image_url
    }
    
    result = supabase.table("content_history").insert(data).execute()
    
    if result.data:
        return result.data[0]
    raise HTTPException(status_code=500, detail="Failed to save content history")


async def get_content_history(user_id: str, limit: int = 50) -> list:
    """Get user's content history."""
    supabase = get_supabase_admin_client()
    
    result = supabase.table("content_history") \
        .select("*") \
        .eq("user_id", user_id) \
        .order("created_at", desc=True) \
        .limit(limit) \
        .execute()
    
    return result.data or []


async def delete_content_history(user_id: str, content_id: str) -> bool:
    """Delete a content history item."""
    supabase = get_supabase_admin_client()
    
    result = supabase.table("content_history") \
        .delete() \
        .eq("id", content_id) \
        .eq("user_id", user_id) \
        .execute()
    
    return len(result.data) > 0 if result.data else False

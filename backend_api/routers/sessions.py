"""
Session management router
"""
import secrets
import string
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException
from database import get_supabase
from schemas import SessionCreateRequest
from config import settings

router = APIRouter(prefix="/photobooth", tags=["sessions"])


def _generate_session_code(length: int = 8) -> str:
    alphabet = string.ascii_uppercase + string.digits
    return "".join(secrets.choice(alphabet) for _ in range(length))


@router.post("/session")
async def create_session(body: SessionCreateRequest | None = None):
    """Create a new photobooth session."""
    db = get_supabase()
    code = _generate_session_code()
    expires = (datetime.now(timezone.utc) + timedelta(minutes=settings.session_expiry_minutes)).isoformat()

    row = {
        "session_code": code,
        "status": "active",
        "device_info": body.device_info if body else {},
        "expires_at": expires,
    }

    result = db.table("photo_sessions").insert(row).execute()
    if not result.data:
        raise HTTPException(500, "Failed to create session")

    session = result.data[0]
    return {
        "success": True,
        "message": "Session created",
        "data": {
            "session_id": session["id"],
            "session_code": session["session_code"],
            "status": session["status"],
            "expires_at": session["expires_at"],
            "created_at": session["created_at"],
        },
    }


@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get session details with photos."""
    db = get_supabase()

    result = db.table("photo_sessions").select("*").eq("id", session_id).execute()
    if not result.data:
        raise HTTPException(404, "Session not found")

    session = result.data[0]

    photos_result = db.table("photos").select("*").eq("session_id", session_id).order("photo_number").execute()

    return {
        "success": True,
        "message": "Session retrieved",
        "data": {
            **session,
            "photos": photos_result.data or [],
        },
    }

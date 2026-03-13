"""
Health check router
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "success": True,
        "message": "AI Photobooth Kota Madiun - Backend API",
        "data": {
            "status": "healthy",
            "version": "2.0.0",
        },
    }

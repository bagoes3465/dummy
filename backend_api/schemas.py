"""
AI Photobooth Kota Madiun - Pydantic Schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ─── Request Schemas ───────────────────────────────────────

class SessionCreateRequest(BaseModel):
    device_info: dict = {}


class PhotoUploadMeta(BaseModel):
    session_id: str


class ProcessPhotoRequest(BaseModel):
    photo_id: str
    background_id: str
    mascot_id: str
    filter_id: Optional[str] = None


# ─── Response Schemas ──────────────────────────────────────

class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict | list] = None


class SessionResponse(BaseModel):
    session_id: str
    session_code: str
    status: str
    expires_at: str
    created_at: str


class PhotoResponse(BaseModel):
    photo_id: str
    session_id: str
    original_url: Optional[str] = None
    photo_number: int
    status: str
    face_expression: Optional[str] = None
    face_confidence: Optional[float] = None


class ProcessingResponse(BaseModel):
    processing_id: str
    photo_id: str
    status: str
    processed_url: Optional[str] = None


class ResultResponse(BaseModel):
    processing_id: str
    photo_id: str
    processed_url: str
    download_code: str
    download_url: str
    qr_code_url: str


class BackgroundResponse(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None


class MascotResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    image_url: str
    thumbnail_url: Optional[str] = None


class FilterResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    filter_type: str

from pydantic import BaseModel
from typing import List, Optional

class ChatRequest(BaseModel):
    question: str
    image_base64: Optional[str] = None 

class ChatResponse(BaseModel):
    answer: str
    sources: List[str] = []

class IngestRequest(BaseModel):
    video_urls: List[str]
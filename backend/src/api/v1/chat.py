from fastapi import APIRouter, HTTPException
from src.models.schemas import ChatRequest, ChatResponse
from src.services.rag_service import PlantBrain
from src.services.vision_service import VisionService

router = APIRouter()

brain = PlantBrain()
vision = VisionService()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
  try:
    image_description = ""
    if request.image_base64:
      image_description = vision.analyze_image(request.image_base64)

    result = brain.process_query(request.question, image_description)
    
    answer_text = result["answer"]    
    final_sources = result["sources"]

    return ChatResponse(
      answer=answer_text,
      sources=final_sources 
    )

  except Exception as e:
    print(f"Error in chat endpoint: {e}")
    raise HTTPException(status_code=500, detail=str(e))
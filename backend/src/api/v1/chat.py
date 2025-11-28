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
    source_documents = result["context"]

    unique_sources = set()
    for doc in source_documents:
      if "source" in doc.metadata:
        unique_sources.add(doc.metadata["source"])
    
    final_sources = list(unique_sources)

    return ChatResponse(
      answer=answer_text,
      sources=final_sources 
    )

  except Exception as e:
    print(f"Erro no chat endpoint: {e}")
    raise HTTPException(status_code=500, detail=str(e))
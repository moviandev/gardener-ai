from fastapi import APIRouter, HTTPException
from src.services.ingest_service import IngestService
from src.models.schemas import IngestRequest

router = APIRouter()
ingestor = IngestService()

@router.post("/ingest")
def ingest_videos_endpoint(request: IngestRequest):
  try:
    result = ingestor.ingest_videos(request.video_urls)
    
    if result["status"] == "error" and "errors" in result and not result.get("chunks_count"):
      raise HTTPException(status_code=400, detail=result["message"])
    
    return result

  except HTTPException as he:
    raise he
  except Exception as e:
    print(f"Erro fatal no endpoint de ingestão: {e}")
    raise HTTPException(status_code=500, detail=str(e))
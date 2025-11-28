from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.v1 import chat, ingest

app = FastAPI(
  title="Plant AI Agent API 🌱",
  description="Backend for the Ironhack Final Project - Botanical RAG Agent",
  version="1.0.0"
)

origins = ["*"]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(ingest.router, prefix="/api/v1", tags=["Knowledge Base"])

@app.get("/")
def health_check():
  return {
    "status": "online",
    "message": "Plant AI Agent is growing strong! 🌿",
    "docs": "/docs"
  }

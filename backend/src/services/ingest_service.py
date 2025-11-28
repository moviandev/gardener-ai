import os
from dotenv import load_dotenv
from langchain_community.document_loaders import YoutubeLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

class IngestService:
  def __init__(self):
    self.DB_PATH = "./chromadb_store"
    self.chunk_size = 1000
    self.chunk_overlap = 200
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

  def ingest_videos(self, video_urls: list[str]) -> dict:
    if not video_urls:
      return {"status": "error", "message": "No URL Added."}
    
    all_documents = []
    errors = []

    for url in video_urls:
      try:
        loader = YoutubeLoader.from_youtube_url(
          url, 
          add_video_info=False, 
          language=["pt", "pt-BR", "en"] 
        )
        docs = loader.load()
        all_documents.extend(docs)
      except Exception as e:
        error_msg = f"Processing error on {url}: {str(e)}"
        print(f"⚠️ {error_msg}")
        errors.append(error_msg)

    if not all_documents:
      return {"status": "error", "message": "Cannot load documents", "errors": errors}

    text_splitter = RecursiveCharacterTextSplitter(
      chunk_size=self.chunk_size, 
      chunk_overlap=self.chunk_overlap
    )
    splits = text_splitter.split_documents(all_documents)
    
    Chroma.from_documents(
      documents=splits,
      embedding=self.embeddings,
      persist_directory=self.DB_PATH
    )
    
    return {
      "status": "success", 
      "message": f"PSuccefully ran! {len(splits)} new knowledge fragments added!",
      "chunks_count": len(splits),
      "errors": errors
    }

# --- Bloco para teste manual direto (opcional) ---
if __name__ == "__main__":
  service = IngestService()
  result = service.ingest_videos([
      "https://www.youtube.com/watch?v=g6FErRqDnAI" # Example monstera
  ])
  print(result)
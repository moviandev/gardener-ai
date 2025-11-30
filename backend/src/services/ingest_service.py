import os
from pathlib import Path
from dotenv import load_dotenv
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma

load_dotenv()

class IngestService:
  def __init__(self):
    current_file = Path(__file__).resolve()
    backend_root = current_file.parents[2]
    self.DB_PATH = str(backend_root / "chromadb_store")
    self.chunk_size = 1000
    self.chunk_overlap = 200
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

  def validate_content(self, text_sample: str) -> bool:
    """
    Checks if the video content is related to plants using the LLM.
    This is wrapped in LangChain, so it will be traced by LangSmith automatically!
    """
    prompt = ChatPromptTemplate.from_template(
      """
      Analyze the following text sample from a video transcript.
      Is this content primarily about plants, gardening, botany, or flowers?
      
      Text Sample: {text}
      
      Return ONLY "YES" or "NO".
      """
    )
    chain = prompt | self.llm | StrOutputParser()
    result = chain.invoke(text_sample).strip().upper()
    return "YES" in result

  def ingest_videos(self, video_urls: list[str]) -> dict:
    if not video_urls:
      return {"status": "error", "message": "No URL Added."}
    
    ytt_api = YouTubeTranscriptApi()

    all_documents = []
    errors = []

    for url in video_urls:
      try:
        print(f"📥 Processing: {url}")
        
        video_id = None
        if "v=" in url:
          video_id = url.split("v=")[1].split("&")[0]
        elif "youtu.be" in url:
          video_id = url.split("/")[-1]
        
        if not video_id:
          raise ValueError(f"Could not parse video ID from {url}")

        try:
          transcript_data = ytt_api.fetch(
            video_id, 
            languages=["pt", "pt-BR", "en"]
          ).to_raw_data()
          
          full_text = " ".join([item['text'] for item in transcript_data])
          
          from langchain_core.documents import Document
          doc = Document(
            page_content=full_text,
            metadata={"source": url, "video_id": video_id}
          )
          current_docs = [doc]
            
        except Exception as e:
          raise Exception(f"Transcript API Error: {str(e)}")

        text_sample = current_docs[0].page_content[:2000]
        
        if not self.validate_content(text_sample):
          error_msg = f"Content validation failed: Video {url} is not about plants."
          print(f"🚫 {error_msg}")
          errors.append(error_msg)
          continue 
        
        print(f"✅ Content Validated & Loaded ({len(current_docs[0].page_content)} chars)")
        all_documents.extend(current_docs)
        
      except Exception as e:
        error_msg = f"Processing error on {url}: {str(e)}"
        print(f"⚠️ {error_msg}")
        errors.append(error_msg)
        continue 

    if not all_documents:
      return {"status": "error", "message": "Cannot load documents", "errors": errors}

    print("✂️ Splitting text...")
    text_splitter = RecursiveCharacterTextSplitter(
      chunk_size=self.chunk_size, 
      chunk_overlap=self.chunk_overlap
    )
    splits = text_splitter.split_documents(all_documents)
    
    print("💾 Saving to ChromaDB...")
    Chroma.from_documents(
      documents=splits,
      embedding=self.embeddings,
      persist_directory=self.DB_PATH
    )
    
    return {
      "status": "success", 
      "message": f"Successfully ran! {len(splits)} new knowledge fragments added!",
      "chunks_count": len(splits),
      "errors": errors
    }

if __name__ == "__main__":
  service = IngestService()
  result = service.ingest_videos([
    "https://www.youtube.com/watch?v=g6FErRqDnAI" 
  ])
  print(result)
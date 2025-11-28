import os
from dotenv import load_dotenv
from langchain_community.document_loaders import YoutubeLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma

load_dotenv()

class IngestService:
  def __init__(self):
    self.DB_PATH = "./chromadb_store"
    self.chunk_size = 1000
    self.chunk_overlap = 200
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

  def validate_content(self, text_sample: str) -> bool:
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
        
        if not docs:
          raise Exception("Could not retrieve transcript.")

        text_sample = docs[0].page_content[:2000]
        
        if not self.validate_content(text_sample):
          error_msg = f"Content validation failed: Video {url} is not about plants."
          print(f"🚫 {error_msg}")
          errors.append(error_msg)
          continue 
        
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
      "message": f"Successfully ran! {len(splits)} new knowledge fragments added!",
      "chunks_count": len(splits),
      "errors": errors
    }

# --- Bloco para teste manual direto (opcional) ---
if __name__ == "__main__":
  service = IngestService()
  # You can test with a valid plant video and an invalid one (like a music video) to check
  result = service.ingest_videos([
    "https://www.youtube.com/watch?v=g6FErRqDnAI" 
  ])
  print(result)
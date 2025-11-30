import os
import re # Added for source extraction
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool
from langchain.agents import AgentExecutor, create_tool_calling_agent

# --- TOOL DEFINITION ---
@tool
def search_plant_knowledge(query: str):
    """
    Useful for answering questions about plant care, watering, diseases, 
    and identification based on the video library.
    Always use this tool to find information before answering.
    """
    current_file = Path(__file__).resolve()
    backend_root = current_file.parents[2]
    
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    db = Chroma(persist_directory=str(backend_root / "chromadb_store"), embedding_function=embeddings)
    
    retriever = db.as_retriever(search_kwargs={"k": 3})
    docs = retriever.invoke(query)
    
    results = []
    for doc in docs:
      source = doc.metadata.get("source", "Unknown")
      content = doc.page_content
      results.append(f"Content: {content}\nSOURCE_URL: {source}")
    
    return "\n\n---\n\n".join(results)

class PlantBrain: 
  def __init__(self):
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    self.current_file = Path(__file__).resolve()
    self.backend_root = self.current_file.parents[2]
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

  def validate_topic(self, question: str) -> bool:
    meta_questions = ["what do you know", "what can you answer", "what are your capabilities", "what's your specialization"]
    if any(q in question.lower() for q in meta_questions):
      return True
    
    check_prompt = ChatPromptTemplate.from_template(
      "Is '{question}' related to plants/gardening? Return ONLY 'YES' or 'NO'."
    )
    chain = check_prompt | self.llm | StrOutputParser()
    result = chain.invoke(question).strip().upper()
    return "YES" in result

  def process_query(self, user_question: str, image_description: str = ""):
    if not self.validate_topic(user_question):
      return {
        "answer": "I apologize, but I am a specialist only in plants and gardening. 🌱 Please ask something related to that topic.",
        "sources": []
      }
    
    tools = [search_plant_knowledge]

    prompt = ChatPromptTemplate.from_messages([
      ("system", """
        You are a friendly botanical expert assistant.
        
        1. You MUST use the 'search_plant_knowledge' tool to answer questions based on the video context.
        2. If the user provided an image description, use it to identify the plant first.
        3. Be concise and practical.
        4. Always answer in the same language as the user.
        
        If the user asks what you know or what you can answer, state clearly that you are a specialist in plants and gardening, and that you answer questions related to plant care, watering, diseases, and identification.
        
        Image Description provided by user: {image_description}
        """),
      ("human", "{input}"),
      ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(self.llm, tools, prompt)
    agent_executor = AgentExecutor(
      agent=agent, 
      tools=tools, 
      verbose=True,
      return_intermediate_steps=True 
    )

    result = agent_executor.invoke({
      "input": user_question,
      "image_description": image_description
    })
    
    found_sources = set()
    if "intermediate_steps" in result:
      for action, output in result["intermediate_steps"]:
        if action.tool == "search_plant_knowledge":
          urls = re.findall(r"SOURCE_URL: (http[s]?://\S+)", str(output))
          found_sources.update(urls)

    return {
      "answer": result["output"],
      "sources": list(found_sources)
    }
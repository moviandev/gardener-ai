import os
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.tools import tool
from langchain_core.runnables import RunnablePassthrough
from langchain.agents import AgentExecutor, create_tool_calling_agent

class PlantBrain: 
  def __init__(self):
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    self.vectorstore = Chroma(
      persist_directory="./chromadb_store", 
      embedding_function=self.embeddings
    )
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

  @tool
  def search_plant_knowledge(query: str):
      """
      Useful for answering questions about plant care, watering, diseases, 
      and identification based on the video library.
      Always use this tool to find information before answering.
      """

      embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
      db = Chroma(persist_directory="./chromadb_store", embedding_function=embeddings)
      retriever = db.as_retriever(search_kwargs={"k": 3})
      
      docs = retriever.invoke(query)
      return "\n\n".join([doc.page_content for doc in docs])

  def validate_topic(self, question: str) -> bool:
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
    
    tools = [self.search_plant_knowledge]

    prompt = ChatPromptTemplate.from_messages([
        ("system", """
         You are a friendly botanical expert assistant.
         
         1. You MUST use the 'search_plant_knowledge' tool to answer questions based on the video context.
         2. If the user provided an image description, use it to identify the plant first.
         3. Be concise and practical.
         4. Always answer in the same language as the user.
         
         Image Description provided by user: {image_description}
         """),
        ("human", "{input}"),
        ("placeholder", "{agent_scratchpad}"),
    ])

    agent = create_tool_calling_agent(self.llm, tools, prompt)
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    result = agent_executor.invoke({
        "input": user_question,
        "image_description": image_description
    })
    
    return {
        "answer": result["output"],
        "sources": []
    }
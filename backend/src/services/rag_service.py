import os
from dotenv import load_dotenv
load_dotenv()

from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_chroma import Chroma
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

class PlantBrain: 
  def __init__(self):
    self.embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    self.vectorstore = Chroma(
        persist_directory="./chromadb_store", 
        embedding_function=self.embeddings
    )        
    self.retriever = self.vectorstore.as_retriever(search_kwargs={"k": 3})
    self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)

  def process_query(self, user_question: str, image_description: str = ""):
    """
    Receives the user question and then one visual description (if there's a picture)
    searches the context in the DB and generates a response.
    """
    
    # Prompt Engineering: Instructions for the agent
    template = """
    You are a friendly and knowledgeable botanical expert assistant designed to help users care for their plants.
    
    Your task is to answer the user's question based ONLY on the provided context (which comes from YouTube videos) 
    and the visual description of the plant (if provided).

    Guidelines:
    1. If the answer is not in the context, politely say you don't know based on the training data.
    2. Be concise and practical.
    3. ALWAYS answer in the same language as the User Question.

    Context from knowledge base:
    {context}

    Visual Description of user's plant (from image analysis):
    {image_description}

    User Question: 
    {question}
    """
    
    prompt = ChatPromptTemplate.from_template(template)

    # Definição da Chain (Cadeia de execução) usando LCEL (LangChain Expression Language)
    # É uma sintaxe moderna e "pipe-like" (|)
    chain = (
        {
            "context": self.retriever, 
            "question": RunnablePassthrough(), 
            "image_description": lambda x: image_description
        }
        | prompt
        | self.llm
        | StrOutputParser()
    )

    # Executa a cadeia
    return chain.invoke(user_question)

'''
Testing langchain and the response with Dummy Data
'''
if __name__ == "__main__":
    try:
        brain = PlantBrain()
        print("🤖 Agente de Plantas Iniciado (OpenAI Version)")

        # --- TRUQUE PARA TESTE RÁPIDO ---
        # Vamos adicionar um "conhecimento falso" manualmente no banco só para ver se ele busca.
        # Isso simula o que o ingest.py faria com as legendas do YouTube.
        print("💾 Inserindo conhecimento de teste no banco...")
        brain.vectorstore.add_texts(
            texts=["O segredo para regar orquídeas é usar cubos de gelo uma vez por semana, pois elas gostam de água gelada e lenta."],
            metadatas=[{"source": "teste_manual"}]
        )
        print("✅ Dados de teste inseridos!")
        # --------------------------------

        # Agora perguntamos sobre esse conhecimento específico
        pergunta = "Como devo regar minha orquídea?"
        print(f"\n👤 Pergunta: {pergunta}")
        
        response = brain.process_query(pergunta)
        print(f"🤖 Resposta:\n{response}")

        print("\n---")
        print("Nota: Se ele respondeu sobre 'cubos de gelo', o RAG funcionou!")
        
    except Exception as e:
        print(f"Erro ao iniciar: {e}")
        print("Dica: Verifique se a OPENAI_API_KEY está configurada no ambiente.")
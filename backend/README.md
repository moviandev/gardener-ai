# Plant AI Agent - Backend API 🌿

The intelligent core of the **Plant AI Agent** project. This backend utilizes **Retrieval-Augmented Generation (RAG)** and **Multimodal Vision** capabilities to act as an expert botanical assistant. It learns from YouTube videos and visual inputs to diagnose plant issues and provide care guides.

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![LangChain](https://img.shields.io/badge/LangChain-v0.3-green)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)

## 🏗 Architecture & Features

This API acts as the orchestrator between the user, the vector database, and the LLM.

* **🧠 RAG Engine:** Ingests transcription data from YouTube videos to create a specialized knowledge base.
* **👁️ Computer Vision:** Analyzes user-uploaded images to identify plant species and diagnose diseases before searching the knowledge base.
* **🛡️ AI Guardrails:** Automatically validates user inputs and video content to ensure the system remains focused strictly on botany/gardening.
* **🏗️ Clean Architecture:** Organized into `services`, `controllers` (api), and `models` to ensure scalability.

## 🧠 Technical Decisions & Trade-offs

During the development of this MVP, several architectural choices were made to balance performance, cost, and complexity:

### 1. FastAPI over Flask/Django
**Decision:** We chose FastAPI for its native asynchronous support (`async/await`) and automatic data validation via Pydantic.
**Why:** AI operations (like calling OpenAI) are I/O bound. FastAPI handles concurrent requests much better than Flask's synchronous nature, ensuring the server doesn't freeze while waiting for GPT-4o to reply. plus, the auto-generated Swagger UI speeds up testing.

### 2. ChromaDB (Local) over Pinecone/Weaviate
**Decision:** Used ChromaDB in persistent local mode.
**Why:** For a project of this scale, setting up a dedicated cloud vector database adds unnecessary latency and configuration overhead. Chroma runs embedded within the Python process, making it zero-latency and perfectly sufficient for thousands of text chunks.

### 3. GPT-4o-mini & Text-Embedding-3-small
**Decision:** Switched from older models to the latest optimized OpenAI models.
**Why:** `gpt-4o-mini` offers the best price-to-performance ratio for RAG tasks. It is significantly cheaper than GPT-4 while maintaining high reasoning capabilities and native multimodal support, removing the need for a separate vision model.

### 4. Semantic Guardrails
**Decision:** Implemented an LLM-based classification step before RAG retrieval.
**Why:** A simple keyword match isn't enough to filter off-topic queries. By using a lightweight LLM call to classify intent (e.g., "Is this about plants?"), we prevent the "Garbage In, Garbage Out" problem and save computational resources on the heavy retrieval steps.

## 🚀 Getting Started

### Prerequisites
* Python 3.10 or higher
* OpenAI API Key

### Installation

1.  **Navigate to the backend directory:**
```bash
cd backend
```

2.  **Create and Activate Virtual Environment:**
```bash
python3 -m venv venv
source venv/bin/activate
```

3.  **Install Dependencies:**
```bash
pip install -r requirements.txt
```

4.  **Environment Setup:**
Create a `.env` file in the `backend/` root:
```env
OPENAI_API_KEY=sk-proj-your-key-here
```

### Running the Server

Use the module execution method to ensure imports work correctly within the monorepo structure:

```bash
uvicorn src.main:app --reload --reload-dir src --host 0.0.0.0
```

The server will start at `http://127.0.0.1:8000`.

## 📡 API Endpoints
Explore the interactive documentation at `http://127.0.0.1:8000/docs`.

**Core Routes**
- POST `/api/v1/chat`: The main interaction endpoint. Accepts text and Base64 images. Returns the answer + source citations.
- POST `/api/v1/ingest`: Accepts YouTube URLs. Validates content relevance -> Downloads transcript -> Chunks text -> Generates Embeddings -> Saves to ChromaDB.

## 💭 After Thoughts & Roadmap
**What I learned**

Building this agent highlighted the importance of Data Quality in RAG systems. Even the smartest LLM cannot answer correctly if the ingested video transcript is poor or irrelevant. That is why the implementation of the IngestService with validation logic was a turning point in the project's stability.

**Future Improvements**
If I had more time, these are the next steps I would implement:

Video Timestamps: Currently, we return the video URL as a source. The next level would be storing the exact timestamp of the chunk, allowing the user to click and watch the specific part of the video where the answer was found.

Chat History: Implement a session-based memory (using Redis or Postgres) so the user can have a continuous conversation rather than one-off questions.

---
Plant AI Agent - Ironhack Final Project
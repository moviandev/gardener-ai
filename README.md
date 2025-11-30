# Plant AI Agent - Fullstack Botanical Ecosystem 🌿

A complete AI-powered ecosystem designed to assist with plant care, identification, and diagnosis. This project utilizes RAG (Retrieval-Augmented Generation) to learn from YouTube videos and Computer Vision to analyze plant health from photos.

The system is built as a Monorepo containing three distinct applications that work in harmony: a Python Backend, a React Web Dashboard, and a React Native Mobile App.

## 🏗️ Architecture Overview

The project follows a Clean Architecture pattern across all platforms, ensuring scalability and maintainability.

```Text
graph TD
    User((User))
    Web[Web Frontend<br>React + Vite]
    Mobile[Mobile App<br>Expo + NativeWind]
    API[Backend API<br>FastAPI + Python]
    DB[(ChromaDB<br>Vector Store)]
    LLM[OpenAI GPT-4o]
    YT[YouTube]

    User --> Web
    User --> Mobile
    Web --> API
    Mobile --> API
    API --> DB
    API --> LLM
    API -- Ingests --> YT
```

### 📂 Monorepo Structure

Detailed structure based on the current implementation:
```Text
gardener-ai/
├── backend/                  # 🧠 The Brain (Python API)
│   ├── src/
│   │   ├── api/v1/           # Endpoints (Chat, Ingest)
│   │   ├── models/           # Pydantic Schemas
│   │   ├── services/         # Business Logic
│   │   │   ├── ingest_service.py
│   │   │   ├── rag_service.py
│   │   │   └── vision_service.py
│   │   └── main.py
│   └── chromadb_store/       # Local Vector Database
│
├── frontend/                 # 🖥️ Web Interface (React)
│   ├── src/
│   │   ├── components/       # Glassmorphism UI Components
│   │   │   ├── Chat/
│   │   │   ├── Layout/
│   │   │   └── Upload/
│   │   ├── hooks/            # Custom Hooks (useChat, useIngest)
│   │   ├── services/         # API Client (Axios) <-- Connection Layer
│   │   │   └── api.ts
│   │   └── types/
│   └── tailwind.config.js
│
└── mobile/                   # 📱 Native App (Expo)
    ├── app/                  # File-based Routing (index, _layout)
    ├── components/           # Native UI Components
    │   ├── Chat/
    │   ├── Layout/
    │   └── Upload/
    ├── hooks/                # Business Logic
    ├── services/             # API Client & IP Config <-- Connection Layer
    │   └── api.ts
    └── nativewind-env.d.ts
```

## 🚀 Quick Start Guide

To run the full ecosystem locally, you need to start the services in separate terminal windows.

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API Key

#### 1. Start the Backend (The Core)

The backend must be running for the apps to work. We run it on host `0.0.0.0` to allow mobile access.
```Bash
cd backend

# Activate Virtual Env (Mac/Linux)
source venv/bin/activate

# Run Server
uvicorn src.main:app --reload --reload-dir src --host 0.0.0.0
```
API runs at `http://localhost:8000`

#### 2. Start the Web Frontend
```Bash
cd frontend
npm install
npm run dev
```
Web App runs at `http://localhost:5173`

#### 3. Start the Mobile App
Ensure your phone is on the same Wi-Fi as your computer.
Configure IP: Update `mobile/.env` with your computer's local IP (run `ipconfig getifaddr en0` to find it).

Run:
```Bash
cd mobile
npm install
npx expo start -c
```

## ✨ Key Features
- 🌱 **Neural Knowledge Base**: The agent learns by watching YouTube videos you provide. It downloads transcripts, generates embeddings, and stores them in ChromaDB.

- 👁️ **Plant Vision**: Upload a photo of a sick plant, and the agent uses GPT-4o Vision to diagnose issues before searching the knowledge base for cures.

- 🛡️ **Semantic Guardrails**: An internal AI layer validates if the user's question or the video content is actually related to plants, preventing off-topic usage.

- 💎 **Liquid Glass UI**: A consistent, high-fidelity design system across Web and Mobile inspired by VisionOS, featuring heavy blurs and organic gradients.

---
Developed as a Final Project for Ironhack.

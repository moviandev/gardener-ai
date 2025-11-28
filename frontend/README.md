# Plant AI Agent - Frontend Interface 🌿

The user interface for the **Plant AI Agent**, designed with a futuristic **"Liquid Glass"** aesthetic inspired by modern Apple/VisionOS design languages. Built with **React**, **TypeScript**, and **Tailwind CSS**, it provides a seamless and responsive experience for interacting with the botanical RAG agent.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)

## 🎨 UX/UI Design Philosophy: "Liquid Glass"

The interface moves away from standard Material Design or Flat Design, aiming for an organic, immersive feel suitable for a nature-focused application.

* **Glassmorphism:** Heavy use of `backdrop-filter: blur()`, semi-transparent white backgrounds (`bg-white/10`), and subtle borders to create depth and hierarchy.
* **Organic Backgrounds:** A deep, radial gradient background that mimics the depth of a forest at night, providing contrast to the bright "glass" panels.
* **Motion:** Interactions are smoothed with CSS transitions, giving a "fluid" feel to inputs and buttons.

## 📂 Project Structure

The project follows a modular, scalable architecture separating UI components from business logic (Hooks).

```text
src/
├── components/          # UI "Lego Blocks"
│   ├── Chat/            # Components specific to the chat window
│   │   ├── ChatBubble.tsx
│   │   ├── ChatInput.tsx
│   │   └── SourceBadge.tsx
│   ├── Layout/          # Structural components (GlassCard)
│   └── Upload/          # Logic for image handling
├── hooks/               # Custom React Hooks (Business Logic)
│   ├── useChat.ts       # Manages conversation state & API calls
│   └── useIngest.ts     # Manages the training/ingestion process
├── services/            # Axios instance & API definitions
├── types/               # Shared TypeScript interfaces
└── index.css            # Tailwind & Custom CSS Variables
```
## 🚀 Getting Started
### Prerequisites:
- Node.js 18+
- The Backend running on port `8000`

### Installation
1. Navigate to the frontend directory:
```Bash
cd frontend
```
2. Install Dependencies:
```Bash
npm install
```
3. Run Development Server:
```Bash
npm run dev
```
4. Open `http://localhost:5173` in your browser.

## 🛠️ Technical Stack & Decisions
1. State Management via Custom Hooks
Decision: Instead of Redux or Context API (which would be overkill for this scope), we used Custom Hooks (useChat, useIngest). Why: This strictly separates the View (JSX) from the Logic. If we want to change the API client or add a different state manager later, the UI components remain untouched.

2. Tailwind CSS for Glassmorphism
Decision: Used Tailwind utility classes + Custom CSS layers in index.css. Why: Implementing complex glass effects involves managing opacity, blur, border colors, and shadows simultaneously. Tailwind allowed us to create a .glass-panel utility class that standardizes this look across the app, ensuring visual consistency.

3. TypeScript Interfaces
Decision: Shared types in src/types/index.ts. Why: Ensures that the Data Contract between Backend (Pydantic models) and Frontend is respected. If the API changes, TypeScript will warn us immediately at build time.

4. Lucide React
Decision: Switched from heavy icon libraries to Lucide. Why: Lightweight, consistent stroke width, and modern look that fits perfectly with the minimal glass design.

## 🔌 API Integration
The frontend expects the backend to be running at `http://127.0.0.1:8000/api/v1`. This configuration is centralized in `src/services/api.ts`.

Chat: Sends `POST` requests with JSON payloads (text + base64 images).
Ingestion: Sends `POST` requests with video URLs for RAG training.
---
Plant AI Agent - Ironhack Final Project
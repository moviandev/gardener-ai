# Plant AI Agent - Mobile Experience 📱

The native mobile interface for the **Plant AI Agent**, built with **React Native** and **Expo**. This application brings the botanical assistant to your pocket, featuring a stunning **"Liquid Glass"** UI inspired by modern Apple/VisionOS design principles.

It allows users to chat with the RAG Agent, upload plant photos for diagnosis via the camera, and train the AI using YouTube links directly from their device.

![React Native](https://img.shields.io/badge/React_Native-0.74-61DAFB?logo=react&logoColor=black)
![Expo](https://img.shields.io/badge/Expo-51-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![NativeWind](https://img.shields.io/badge/NativeWind-v2-38B2AC?logo=tailwindcss)

## 🎨 UX/UI Design: "Liquid Glass"

We pushed the boundaries of React Native styling to achieve a high-fidelity, translucent aesthetic.

* **Native Blur:** Utilized `expo-blur` to create real-time background blurring behind UI elements.
* **Gradient Atmospheres:** Implemented `expo-linear-gradient` to build deep, organic backgrounds that simulate a "Forest Night" environment.
* **Glassmorphism:** Custom components (`GlassView`) combine opacity, blur, and subtle borders to mimic frosted glass.

## 📂 Project Structure

The project follows a strict separation of concerns using **Clean Architecture** principles adapted for React Native.

```text
mobile/
├── app/                  # Expo Router (File-based routing)
│   ├── index.tsx         # Main Chat Screen
│   └── _layout.tsx       # Global Navigation & Status Bar Config
├── components/           # Reusable UI "Lego Blocks"
│   ├── Chat/             # Chat bubbles, Input, Badges
│   ├── Layout/           # GlassView, ScreenWrapper (SafeArea + Gradient)
│   └── Upload/           # Logic for Camera/Gallery interaction
├── hooks/                # Business Logic (State & Side Effects)
│   ├── useChat.ts        # Manages messaging state & API communication
│   └── useIngest.ts      # Handles YouTube URL training logic
├── services/             # Axios Client & API Endpoints
└── nativewind-env.d.ts   # Types for Tailwind classes in RN
```

## 🚀 Getting Started
### Prerequisites
1. Node.js (LTS version)
2. Expo Go app installed on your physical iOS or Android device.
3. The Backend running locally on your network.

### Installation
1. Navigate to the mobile directory:
```Bash
cd mobile
```
2. Install Dependencies:
```Bash
npm install
```
### ⚙️ Network Configuration (Critical)
Since the app runs on a physical device (or emulator), it cannot access localhost. It must connect to your computer's Local IP Address.

1. Find your Local IP:
   - Mac: Run `ipconfig getifaddr en0` in the terminal (e.g., `192.168.1.15`).
   - Windows: Run ipconfig.
2. Configure Environment Variables: Create a .env file in the mobile/ root and add your IP:

```Code Snippet
# Replace 192.168.x.x with your actual IP
EXPO_PUBLIC_IOS_API_URL=http://192.168.x.x:8000/api/v1
EXPO_PUBLIC_ANDROID_API_URL=http://10.0.2.2:8000/api/v1
EXPO_PUBLIC_MOBILE_API_URL=http://192.168.x.x:8000/api/v1
```
3. Prepare the Backend: Ensure your Python backend is listening on all interfaces (0.0.0.0):
```Bash
# In the backend folder
uvicorn src.main:app --reload --reload-dir src --host 0.0.0.0
```
### ▶️ Running the App
Start the Metro Bundler:
```Bash
npx expo start -c
```
(The `-c` flag clears the cache, ensuring NativeWind styles load correctly).
- Physical Device: Scan the QR code with your phone's camera.
- Simulator: Press `i` for iOS or `a` for Android.

## 🛠️ Technical Decisions
1. *Expo Router*
Decision: Used file-based routing (app/index.tsx). Why: It aligns the mobile development mental model with the web (Next.js style), simplifying navigation logic and reducing boilerplate code compared to React Navigation.
2. *NativeWind (Tailwind for RN)*
Decision: Used Tailwind utility classes for styling. Why: Allowed us to share design tokens (colors, spacing) with the Web Frontend, ensuring brand consistency while speeding up UI development significantly.
3. *Custom Hooks (useChat)*
Decision: Extracted all state logic into hooks/. Why: Keeps the UI components (index.tsx) purely presentational. This makes the code easier to test and allows us to swap the API layer without breaking the layout.
4. *Smart API Switching*
Decision: Implemented a getBaseUrl helper in services/api.ts. Why: Automatically detects if the app is running on Android Emulator (needs 10.0.2.2) or iOS/Physical Device (needs LAN IP), preventing common connection errors during development.

---
Plant AI Agent - Ironhack Final Project
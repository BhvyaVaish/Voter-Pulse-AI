# Voter Pulse AI

### Your Agentic Election Coach & Civic Companion

Voter Pulse AI is a high-performance, mobile-first Progressive Web App (PWA) designed to transform the Indian civic experience. By combining **Agentic AI** with a sophisticated offline-first architecture, it provides every citizen with a personalized "Civic Coach" that guides them from eligibility to the polling booth.

[![Production Site](https://img.shields.io/badge/Production-Live-emerald?style=for-the-badge)](https://voterpulse-ai-1072141272642.asia-south1.run.app)
[![Tech Stack](https://img.shields.io/badge/Tech-Next.js%2015%2B%20|%20Gemini%20|%20Firebase-blue?style=for-the-badge)](https://voterpulse-ai-1072141272642.asia-south1.run.app)

---

## 🎯 Problem Statement Alignment

Indian elections involve multi-layered procedures (Forms 6, 7, 8, VVPAT verification, Booth Lookup) that can be overwhelming. Voter Pulse AI solves this by:

- **Demystifying Procedures**: Converting legal jargon into simple, actionable steps.
- **Ensuring Information Integrity**: Using a "Trust-First" model with verified local data fallbacks.
- **Increasing Accessibility**: Multi-lingual support (English, Hindi, Tamil, Bengali, Marathi) and offline-first logic.

## ✨ Core Agentic Features

### 1. Context-Aware Civic Coach (Ask AI)
Powered by **Google Gemini 1.5 Flash**, our agentic assistant understands the user's current journey stage.
- **Dynamic Trust Levels**: Every response is tagged with its reliability source (Official, Verified, Explanatory).
- **Proactive Suggestions**: Suggests the next logical step in the user's roadmap.
- **Offline Fallback**: A custom Levenshtein-based NLP engine provides instant responses without internet.

### 2. Personalized Voter Roadmap
A dynamic, 7-9 stage journey tailored to the user's persona (New Voter, Existing Voter, or Civic Volunteer).
- **Automated Eligibility Logic**: Precision age and citizenship verification using constitutional qualifying dates.
- **Interactive Checklists**: Ensures users have the correct documentation before visiting official portals.

### 3. High-Fidelity EVM Simulator
An educational "sandbox" that recreates the Indian voting booth experience.
- **VVPAT Simulation**: Users witness the 7-second paper slip verification.
- **Mock Results**: Transparent look at how votes are recorded and tabulated.

### 4. Real-Time Election Tracker
A robust data engine that tracks upcoming state and central assembly elections based on official term expiries.
- **Direct Portal Integration**: One-click access to state-specific CEO portals.
- **Contextual Reminders**: In-app notifications for registration deadlines and polling dates.

### 5. Gamified Progress
- Earn badges (e.g., "Eligible Citizen", "Democracy Defender") and gain XP for completing civic tasks.

## 🛠️ Technical Architecture

- **Frontend**: Next.js 15+ (App Router), TailwindCSS, Lucide Icons
- **AI/NLP**:
  - **Online**: Google Gemini 1.5 Flash (via secure server-side API route)
  - **Offline**: Custom Fuzzy-matching Intent Engine with multi-lingual dictionary
- **Backend/Auth**: Firebase (Anonymous + Google OAuth)
- **State Management**: Zustand (with Persistence middleware)
- **Testing**: Vitest (unit + integration test suite)
- **Deployment**: Google Cloud Run (3-stage optimized Docker build)
- **PWA**: Fully installable with offline caching via Service Worker

## 📱 PWA Features

- **Offline Access**: Key features like the Roadmap and Simulator work without internet.
- **Add to Home Screen**: Native-like app experience on mobile devices.
- **Fast Performance**: Optimized build for quick loading even on 3G networks.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Google Cloud / Firebase Project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/BhvyaVaish/Voter-Pulse-AI.git
   cd Voter-Pulse-AI
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   GEMINI_API_KEY=your_gemini_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Run the test suite:
   ```bash
   npx vitest run
   ```

## 🔒 Security & Privacy

- **Environment-Based Config**: All API keys are sourced from environment variables — never hardcoded.
- **Build-Time Injection**: `NEXT_PUBLIC` variables are securely handled via Cloud Build arguments.
- **Environment Isolation**: Strictly enforced `.gitignore` for all secrets.
- **No PII Storage**: The platform focuses on procedural guidance and educational simulations.

## 🧪 Testing

The project includes a comprehensive test suite using Vitest:

- **Chat Engine Tests**: Intent detection, fuzzy matching, multi-lingual support
- **Eligibility Tests**: Age calculation, edge cases, timezone handling
- **Roadmap Tests**: Persona-based step generation and validation
- **Data Tests**: Candidate profiles, asset validation, INR formatting
- **Elections Tests**: Dynamic status computation, search, filters
- **Knowledge Base Tests**: Offline response quality and coverage
- **Dictionary Tests**: Multi-lingual keyword structure and typo coverage

Run all tests:
```bash
npx vitest run
```

---
**Developed for the Hack2Skill / GDG Virtual Hackathon.**
*Empowering 1.4 billion citizens, one vote at a time.*

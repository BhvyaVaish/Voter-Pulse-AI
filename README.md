# Voter Pulse AI 🇮🇳
### Your Agentic Election Coach & Civic Companion

Voter Pulse AI is a premium, mobile-first platform designed to bridge the complex gap between Indian electoral procedures and citizen participation. Built for the modern voter, it transforms static government procedures into an interactive, gamified, and AI-powered journey.

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://voterpulse-ai-1072141272642.asia-south1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Firebase%20|%20Gemini-blue)](https://nextjs.org)

---

## 🎯 Problem Statement Alignment
Indian elections involve multi-layered procedures (Forms 6, 7, 8, VVPAT verification, Booth Lookup) that can be overwhelming. Voter Pulse AI solves this by:
- **Demystifying Procedures**: Converting legal jargon into simple, actionable steps.
- **Ensuring Information Integrity**: Using a "Trust-First" model with verified local data fallbacks.
- **Increasing Accessibility**: Multi-lingual support and offline-first logic for reliable civic access anywhere.

## ✨ Key Features
- **🤖 Agentic AI Assistant**: Powered by **Google Gemini**, providing real-time, context-aware answers to complex voting queries.
- **🧠 Offline NLP Engine**: A custom Levenshtein-based intent detection system that provides instant, data-efficient responses without an internet connection.
- **🗺️ Interactive Voter Journey**: A gamified roadmap tracking the user from eligibility and registration to the polling booth.
- **🗳️ Election Simulator**: A safe environment to understand the EVM and VVPAT process, reducing anxiety for first-time voters.
- **📊 Live Election Tracker**: Dynamic computation of upcoming assembly and general elections based on constitutional terms.
- **🛡️ Secure Civic Vault**: Cloud-synced progress tracking using Firebase with robust build-time security.

## 🛠️ Technical Architecture
- **Frontend**: Next.js 15+ (App Router), TailwindCSS, Lucide Icons.
- **Backend/Storage**: Firebase (Auth & Firestore) with secure lazy-initialization.
- **AI/NLP**: 
  - **Online**: Google Gemini 1.5 Flash (via secure API).
  - **Offline**: Custom Fuzzy-matching Intent Engine for multi-lingual detection.
- **Deployment**: Google Cloud Run (3-stage optimized Docker build).
- **PWA**: Fully installable Progressive Web App with offline caching.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- A Google Cloud / Firebase Project

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/BhvyaVaish/Voter-Pulse-AI.git
   cd voter-pulse-ai
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Set up environment variables (`.env.local`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   GEMINI_API_KEY=your_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔒 Security & Privacy
- **Build-Time Injection**: NEXT_PUBLIC variables are securely handled via Cloud Build arguments.
- **Environment Isolation**: Strictly enforced .gitignore for all secrets.
- **No Data PII**: The platform focuses on procedural guidance and educational simulations.

---
**Developed for the Hack2Skill / GDG Virtual Hackathon.**  
*Empowering 1.4 billion citizens, one vote at a time.*

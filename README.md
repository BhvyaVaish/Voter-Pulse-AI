# Voter Pulse AI 🗳️

> **Your Agentic Election Coach — From Confusion to Confident Participation**

Voter Pulse AI is a full-stack, AI-powered civic education platform built to bridge the gap between complex Election Commission of India (ECI) procedures and citizen participation. It acts as a personalized, gamified election coach — guiding first-time and returning voters step-by-step from registration to casting their vote, all powered by **Google Gemini AI**.

---

## 📌 Problem Statement

**Hackathon: PromptWars Virtual (India by Hack2Skill & GDG)**

India has 960+ million eligible voters, yet millions fail to participate in elections due to:
- **Complex registration processes** — Forms 6, 7, 8 are confusing for first-time voters.
- **Lack of awareness** — Many citizens don't know their eligibility, polling booth, or what documents to carry.
- **Language barriers** — Official ECI resources are primarily in English/Hindi, excluding 100+ million non-Hindi speakers.
- **Misinformation** — Election-related rumors spread faster than facts, especially on social media.
- **No practice mechanism** — Voters (especially young, first-time voters) enter the booth anxious, never having seen or used an EVM/VVPAT machine.

> *"23% of eligible voters in the 18-25 age group are not even registered."* — ECI Data

---

## 💡 Solution Overview

Voter Pulse AI solves these problems through an **agentic AI approach**:

1. **Personalized Civic Journeys** — AI-driven onboarding identifies if you're a new voter, existing voter, or civic advocate, then generates a tailored step-by-step roadmap.
2. **Gemini-Powered AI Assistant** — A context-aware chatbot (powered by Google Gemini 1.5 Flash) that answers election queries in 5 Indian languages with trust-level verification.
3. **Interactive EVM/VVPAT Simulator** — A realistic mock voting machine where users can practice the entire voting process risk-free.
4. **Candidate Transparency Dashboard** — Compare candidates by wealth, criminal records, and education (educational/demo data).
5. **cVIGIL-Style Violation Reporting** — Report election violations like vote-buying or MCC breaches directly from the app.
6. **Gamified Progress** — Earn badges, XP points, and level up as you complete civic quests.

---

## 🌍 UN Sustainable Development Goal

**SDG 16: Peace, Justice and Strong Institutions**

- **Target 16.6** — Develop effective, accountable and transparent institutions at all levels.
- **Target 16.7** — Ensure responsive, inclusive, participatory and representative decision-making at all levels.

Voter Pulse AI directly promotes democratic participation by making election processes accessible, transparent, and understandable to every citizen — regardless of language, literacy, or prior experience.

---

## 🤖 Google Technology: Gemini AI Integration

Voter Pulse AI uses **Google Gemini 1.5 Flash** as the core AI engine powering the civic assistant chatbot.

### Where Gemini Is Used

| Feature | File | How Gemini Is Used |
|---|---|---|
| **AI Civic Assistant** | `src/app/api/chat/route.ts` | Server-side API route calls Gemini 1.5 Flash via the `generativelanguage.googleapis.com` REST API. Every user query about voting, registration, eligibility, EVM, or complaints is processed by Gemini with a custom system prompt that enforces civic-only responses, trust-level labeling, and structured JSON output. |
| **Context-Aware Responses** | `src/app/assistant/page.tsx` | The assistant page sends the user's persona, language preference, journey stage, completed steps, and detected intent to the API — making Gemini's responses personalized to each user's exact position in their civic journey. |
| **Multilingual Support** | `src/app/api/chat/route.ts` | When the user's language is set to Hindi, Tamil, Bengali, or Marathi, the system prompt dynamically instructs Gemini to respond in that language. |
| **Offline Fallback** | `src/app/api/chat/route.ts` | When no API key is configured, the app gracefully falls back to a curated offline response dictionary — ensuring the app works even without internet access. |

### Why Gemini Was Chosen

- **Speed** — Gemini 1.5 Flash provides sub-second responses for interactive chat.
- **Structured Output** — `responseMimeType: "application/json"` ensures reliable, parseable responses with trust levels.
- **Multilingual** — Native support for Hindi, Tamil, Bengali, and Marathi without external translation APIs.
- **Safety** — The system prompt restricts Gemini to election-related topics only, refusing non-civic queries.

---

## 🌟 Key Features

| Feature | Description |
|---|---|
| **Personalized Civic Journeys** | Tailored roadmaps for New Voters, Existing Voters, and Civic Action advocates with step-by-step checklists. |
| **AI Civic Assistant** | Gemini-powered chatbot with trust-level labels (Official, Verified, Explanatory, Uncertain) and quick-action buttons. |
| **Mock EVM/VVPAT Simulator** | Realistic interactive simulator to practice using the Electronic Voting Machine and VVPAT verification slip. |
| **Candidate Fact-Check Dashboard** | Compare candidate wealth declarations, criminal records, and educational qualifications transparently. |
| **cVIGIL-Style Grievance Reporting** | Report election violations (vote-buying, intimidation, MCC breaches) with categorized complaint forms. |
| **Election Tracker** | Track upcoming state and central assembly elections with constitutional term data and CEO portal links. |
| **Bilingual & Localized** | Full support for 5 languages: English, Hindi (हिन्दी), Tamil (தமிழ்), Bengali (বাংলা), Marathi (मराठी). |
| **Gamified Experience** | 8 unique badges, XP points, 4 civic levels, and progress tracking to motivate civic engagement. |
| **Polling Day Guide** | Comprehensive checklist for voting day — what to bring, what to expect, and booth finding. |
| **Eligibility Checker** | Instant eligibility verification based on age, citizenship, and residency status. |

---

## 💻 Technology Stack

| Layer | Technology |
|---|---|
| **AI Engine** | Google Gemini 1.5 Flash (via REST API) |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 with custom design tokens |
| **State Management** | Zustand (with localStorage persistence) |
| **Data Visualization** | Recharts |
| **Form Handling** | React Hook Form + Zod validation |
| **Icons** | Lucide React |
| **Animations** | Framer Motion + native CSS keyframes |
| **Fonts** | Inter (body) + Outfit (headings) via Google Fonts |
| **NLP** | Custom fuzzy intent detection engine with Levenshtein distance |

---

## 📂 Project Structure

```
voter-pulse-ai/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/chat/route.ts         # Gemini AI API endpoint
│   │   ├── assistant/                # AI chatbot interface
│   │   ├── candidates/               # Candidate comparison dashboard
│   │   ├── complaint/                # Complaint filing form
│   │   ├── dashboard/                # Main dashboard with stats
│   │   ├── elections/                # Election tracker
│   │   ├── fact-check/               # Fact-check module
│   │   ├── journey/                  # Civic journey roadmap
│   │   │   └── eligibility/          # Eligibility checker
│   │   ├── mock-vote/                # Quick vote simulation
│   │   ├── onboarding/               # Persona selection & setup
│   │   ├── polling-guide/            # Polling day preparation
│   │   ├── profile/                  # User profile & badges
│   │   ├── reminders/                # Election reminders
│   │   ├── report/                   # Violation reporting
│   │   ├── simulator/                # Full EVM/VVPAT simulator
│   │   ├── timeline/                 # Democratic process timeline
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Design system & animations
│   ├── components/                   # Shared UI components
│   │   ├── badge-popup.tsx           # Achievement popup
│   │   ├── error-boundary.tsx        # Error handling
│   │   ├── nav-bar.tsx               # Navigation bar
│   │   └── trust-label.tsx           # Trust level indicator
│   └── lib/                          # Core logic & data
│       ├── chatDictionary.ts         # Multilingual intent keywords (5 languages)
│       ├── chatEngine.ts             # Fuzzy NLP engine with Levenshtein distance
│       ├── data.ts                   # Candidate & civic data
│       ├── elections-data.ts         # State/central election data
│       ├── eligibility.ts            # Eligibility logic
│       ├── i18n/                     # Internationalization
│       │   ├── provider.tsx          # Language context provider
│       │   └── translations.ts       # Translation strings (5 languages)
│       ├── roadmaps.ts              # Journey roadmap definitions
│       ├── sounds.ts                # Audio feedback utilities
│       └── store.ts                 # Zustand global state
├── public/                           # Static assets
├── .env.example                      # Environment variable template
├── LICENSE                           # MIT License
├── next.config.ts                    # Next.js configuration
├── package.json                      # Dependencies & scripts
├── postcss.config.mjs                # PostCSS config for Tailwind
└── tsconfig.json                     # TypeScript configuration
```

---

## 📸 Screenshots

> *Screenshots will be added after deployment.*

<!-- Add screenshots here after deploying:
![Dashboard](screenshots/dashboard.png)
![AI Assistant](screenshots/assistant.png)
![EVM Simulator](screenshots/simulator.png)
-->

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- A Google Gemini API key ([get one free](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/BhvyaVaish/Voter-Pulse-AI.git
    cd Voter-Pulse-AI
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Set up environment variables**
    ```bash
    cp .env.example .env.local
    ```
    Then edit `.env.local` and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4. **Run the development server**
    ```bash
    npm run dev
    ```

5. **Open in browser**
    Navigate to [http://localhost:3000](http://localhost:3000)

> **Note:** The app works without a Gemini API key in offline mode — the AI assistant will use curated local responses instead of Gemini.

---

## 🌐 Deployment

This application is designed to be deployed on **Google Cloud Run**, as per the PromptWars Virtual guidelines.

### Deploying to Google Cloud Run

1. **Install Google Cloud CLI (`gcloud`)** and authenticate:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

2. **Deploy using Cloud Run source deployment** (Next.js is supported out of the box):
   ```bash
   gcloud run deploy voter-pulse-ai \
     --source . \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Get your Live URL**
   Once the deployment finishes, the CLI will output a live `.run.app` URL. This is the link you will submit on the PromptWars dashboard.

### Submission Checklist
- [x] Code built exclusively using **Google Antigravity**.
- [x] Source code pushed to a public GitHub repository.
- [ ] Application deployed live on **Google Cloud Run**.
- [ ] Technical Blog Post written ("Build-in-Public" journey).
- [ ] LinkedIn Post shared.

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

*Built with ❤️ for Indian democracy and PromptWars Virtual using Google Antigravity.*

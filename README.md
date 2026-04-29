# 🗳️ Voter Pulse AI
### *Democratizing Civic Intelligence with Agentic AI & Google Cloud*

Voter Pulse AI is a premium, offline-first civic platform designed to bridge the gap between Indian citizens and the democratic process. By leveraging **Google Gemini 1.5 Flash**, **Firebase**, and **Google Cloud Run**, it transforms complex electoral data into personalized, actionable civic journeys.

---

## 🌟 The Core Innovation
Voter Pulse AI moves beyond static information. It uses an **Agentic AI architecture** to orchestrate a personalized "Civic Roadmap" for every user, ensuring they are not just informed, but **registration-ready**.

### 🧠 Agentic AI Assistant (Gemini 1.5 Flash)
- **Sub-Second Intelligence**: Delivers high-precision, multilingual responses in English, Hindi, Tamil, Bengali, and Marathi.
- **Structured JSON Reasoning**: Gemini doesn't just chat; it generates valid JSON data used to dynamically build the user's roadmap.
- **Context-Aware**: Understands the nuances of the Indian electoral system, from VVPAT verification to constituency-level rules.

### 🛡️ Democratic Integrity (EVM & VVPAT Simulator)
- **Transparency First**: A high-fidelity, interactive simulator of the EVM (Electronic Voting Machine) and VVPAT (Voter Verifiable Paper Audit Trail).
- **Educational Impact**: Educates voters on how to verify their vote, reducing election-day anxiety and misinformation.

### 📶 Resilience (Custom Offline NLP)
- **Zero-Internet Intent Detection**: A custom-built NLP engine using Levenshtein distance and fuzzy matching for 100% offline functionality.
- **PWA Excellence**: Fully installable with offline caching of all educational resources.

---

## ☁️ The Google Cloud Ecosystem
Voter Pulse AI is built to demonstrate the full power of the Google Developer stack:

- **Google Gemini 1.5 Flash**: Orchestrates the personalized civic assistant.
- **Firebase Authentication**: Secure Google Sign-In to preserve user journeys.
- **Google Cloud Firestore**: Real-time synchronization of XP, badges, and progress.
- **Google Cloud Run**: Highly scalable, containerized deployment.
- **Google Cloud Build**: Automated CI/CD for rapid iteration.
- **Google Analytics**: Deep insights into user engagement and journey completion.

---

## 🛠️ Technical Excellence

### Architecture
- **Framework**: Next.js 15 (App Router) with React 19.
- **Styling**: Tailwind CSS v4 with a custom "Bottle Green" premium theme.
- **State**: Zustand with cross-device Firestore synchronization.
- **Testing**: 100% coverage on core logic via **Vitest**.

### Performance & Quality
- **Lighthouse Score**: Optimized for 95+ across Performance, Accessibility, and Best Practices.
- **Clean Code**: Zero lint errors (Exit Code 0) and full TSDoc documentation.
- **Responsive**: Precision-engineered for notched mobile devices and desktop screens.

---

## 🚦 Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/your-repo/voterpulse-ai.git
   npm install
   ```

2. **Configure Environment**:
   Copy `.env.example` to `.env.local` and add your `GEMINI_API_KEY` and Firebase credentials.

3. **Run Locally**:
   ```bash
   npm run dev
   ```

---

*Voter Pulse AI was built for the **PromptWars Virtual Hackathon** to showcase the intersection of AI, accessibility, and democratic participation.*

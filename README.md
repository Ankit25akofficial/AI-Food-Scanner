#  Smart Nutrition & Fitness Core

> **A highly modern, futuristic, and fully animated AI-powered Smart Nutrition & Fitness Tracking Web Application.** 
> Built on a premium glassmorphic dark-theme design system with custom HSL chromatic themes, live SVG dashboards, interactive biometric logs, and neural AI vision food scanning.

---
<img width="1919" height="915" alt="image" src="https://github.com/user-attachments/assets/6334cf2c-71aa-4a60-8586-395edddad190" />

## AI Food & Barcode Scanner

<img width="1648" height="879" alt="image" src="https://github.com/user-attachments/assets/c18430dd-1b19-4259-bf3c-d8f25b97d145" />

## Meal Ingestion History

<img width="1655" height="846" alt="image" src="https://github.com/user-attachments/assets/bb3cee06-7b2b-433d-8452-d5baf7e7f32f" />

## Nutrition & Biometric Analytics

<img width="1680" height="910" alt="image" src="https://github.com/user-attachments/assets/5b780268-7e8a-4c53-9513-638ff8edb113" />

## Fitness Progress Tracker

<img width="1660" height="787" alt="image" src="https://github.com/user-attachments/assets/d990f603-8d7d-425f-bb8e-57c6ecf784e6" />

 ## AI Coach & Biometric Reports

<img width="1668" height="651" alt="image" src="https://github.com/user-attachments/assets/5bcd8b64-a1ad-4f07-8acb-b11aae00f588" />

## Goal & Profile Settings

<img width="1646" height="911" alt="image" src="https://github.com/user-attachments/assets/61d6881f-1cbf-4ef7-bb16-8aaaf750cf46" />

 ## Neural Engine Admin Panel

<img width="1674" height="678" alt="image" src="https://github.com/user-attachments/assets/56380a5d-0b3c-4592-ab05-f24bf1c7c7b5" />


## 🚀 Key Visual & Feature Pillars

AURA.AI is designed to feel like a high-tech biometric dashboard, featuring custom-engineered visual components and advanced simulated or real Gemini AI vision integrations.

### 🧠 1. Neural Food Scanning & NLP
* **Live Webcam Scanner**: Connects to the user's camera feed with a glowing green-neon laser line scan overlay.
* **Holographic Photo Uploader**: Drags, drops, or uploads food images to trigger an animated neural scanner that extracts macro-nutrients and micro-vitamins.
* **Natural Language Processor (NLP)**: Type raw text inputs (e.g. `"2 eggs and a banana"`) to automatically calculate total calories, carbs, fats, and protein using structured heuristics.
* **API Telemetry Warn HUD**: Real-time error handling with an interactive warning banner displaying API status, connection warnings, or quota issues directly within the scanner interface.

### 📊 2. Biometric Metrics & Custom Charts
* **Metabolic Net State Card**: Computes live daily net calories (`Consumed Intake - Burnt Workout`) with visual indicators, custom count-up metrics, and alert triggers.
* **Interactive SVG Visualizer**: Multi-mode custom SVG charts mapping weight trends, daily macro completion margins, and weekly calorie budgets without external heavyweight library dependencies.
* **Step Dial & Hydration Flow**: Interactive pedometer circles and a glowing animated liquid hydration bottle showing live progress toward daily hydration caps.

### 🏆 3. Gamification Core
* **Streak & Level System**: Gain XP by logging meals or workouts, leveling up your profile with dynamic progress indicators.
* **Biometric Achievements**: Custom-unlocked achievements cards with gold badge rewards, XP multipliers, and interactive hover-lift neon glows.
* **Hyperfit Challenges Deck**: Toggle active challenges (e.g., Sub-Zero Sugar, Step-tember) with urgent timer icons, reward tracking chips, and gradient fill scales.

### 🎨 4. Visual Deck & Chromatic Themes
* Customize the interface using one of three high-contrast futuristic color tokens:
  - **Midnight Void** (Default Cosmic Violet)
  - **Emerald Synth** (High-tech Matrix Green)
  - **Cyber Amber** (Industrial Cyberpunk Yellow)
* Canvas-based reactive starfield and particle drifting animations inside the background layer.

---

## 🛠 Tech Stack

* **Core Structure**: React 19 (SPA) + Vite
* **Styling**: Vanilla HSL Custom CSS Tokens + Glassmorphism Layout Variables
* **Icons**: Lucide React
* **AI Model Engine**: Google Gemini API (`gemini-2.5-flash` endpoint)
* **Build System**: ESM Modules & Production Compiler Bundler

---

## 🔒 Security & Environment Configuration

To protect your private credentials and prevent your **Google Gemini API Key** from being flagged and revoked by GitHub's public secret scanners, all API keys are loaded securely through Vite's local environment loader.

1. Create a secure local file named `.env` in the project root:
   ```env
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
2. The project's `.gitignore` is configured to block `.env` from ever being pushed into your public repository history.
3. Refer to [.env.example](.env.example) for a template configuration:
   ```bash
   cp .env.example .env
   ```

---

## ⚡ Quick Start & Installation

### Prerequisites
- Node.js (version 18 or above recommended)
- npm (Node Package Manager)

### Setup & Run
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankit25akofficial/AI-Food-Scanner.git
   cd AI-Food-Scanner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file and insert your API key:
   ```bash
   cp .env.example .env
   ```

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   Ensure everything compiles error-free before deployment:
   ```bash
   npm run build
   ```

---

## 📂 Project Architecture

```
src/
├── assets/                  # Core static icons and assets
├── context/
│   └── AppContext.jsx       # Global application state, weight logs, and simulated barcode registries
├── components/
│   ├── ParticleBackground.jsx # Canvas starfield particle accelerator
│   ├── HologramScanner.jsx  # Webcam analyzer overlay, photo uploads, NLP parsing
│   ├── InteractiveChart.jsx # Responsive custom SVG lines and grids
│   ├── ProgressRing.jsx     # Glowing neon SVG circular progress dials
│   └── Sidebar.jsx          # Futuristic hud-style index routing navigation
├── pages/
│   ├── DashboardPage.jsx    # Streak tracking, biometric metrics, gamification decks
│   ├── ScannerPage.jsx      # Neural vision control deck
│   ├── HistoryPage.jsx      # Historical tabular meal directories
│   ├── AnalyticsPage.jsx    # KPI progress trackers and macro split progress meters
│   ├── FitnessPage.jsx      # Workout selectors, step pedometers, weight metric registers
│   ├── SettingsPage.jsx     # Goal presets, visual theme switch deck, live macro balance donut
│   ├── AdminPanel.jsx       # API request monitors, uptime stats, connection telemetry
│   ├── ReportsPage.jsx      # Printable PDF summaries and weekly overview logs
│   ├── LandingPage.jsx      # Scrolling cinematic intro index
│   └── LoginPage.jsx        # Credentials authentication terminal
└── utils/
    └── gemini.js            # Unified active Google Gemini API neural adapter
```

Enjoy tracking your nutrition under a beautiful dark sci-fi biometric deck! 🌌

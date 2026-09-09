# VOYAGE — Editorial Luxury Travel & AI Concierge

> **Front-End Developer Assignment for designesthetics**  
> An editorial-grade, responsive travel intelligence platform balancing design restraint, typography, real-time meteorological telemetry, and AI trip planning.

---

## 🌐 Live Deployed Application

- **Live URL**: *(Deployable via GitHub Pages / Vercel / Netlify)*
- **GitHub Repository**: Public repository ready for evaluation

---

## 📖 Project Overview

**VOYAGE** was designed from the ground up to embody the philosophy of **designesthetics**: where visual design carries the most weight. Eschewing the cluttered, generic layouts of standard travel directories, VOYAGE pairs high-fashion editorial typography (`Playfair Display`, `Cinzel`, and `Plus Jakarta Sans`) with an obsidian-and-champagne visual architecture, micro-interactions, and real-time data pipelines.

---

## ✨ 8 Core Requirements Built

### 1. 01 A Landing Experience
- Full-viewport hero featuring a **smooth looping background video** of coastal waters and mountain mist.
- Ambient sound generator synthesizing gentle ocean wave acoustics via the **Web Audio API** (guaranteed to work universally without blocked third-party audio files).
- Editorial typography, instant search pill, live statistics ticker, and quick continent pill filters that invite the visitor to explore.

### 2. 02 Destination Explorer
- Multi-faceted exploration across **12 world-class destinations** spanning 5 continents.
- Real-time search with fuzzy matching across names, countries, tags, landmarks, and vibes.
- Dynamic filtering by **Region** (Europe, Asia, Americas, Africa, Oceania) and **Atmosphere** (Cultural & Historic, Beach & Coastal, Alpine & Nature, Urban & Modern, Romantic & Luxury).
- Sorting by **Featured**, **Nearest to You**, **Furthest Away**, **Daily Budget**, and **Name**.
- Clicking any destination opens a dedicated **Destination Page View** with 5 in-depth interactive tabs (*Overview & Culture*, *Famous Places*, *Live Weather & Climate*, *Interactive Map*, and *AI Itinerary Planner*).

### 3. 03 Famous Places (Not a Bare List)
- Every destination features 4–5 famous landmarks presented as **rich visual cards**.
- Includes high-definition photography, category badges (*Sacred Site*, *Architectural*, *Natural Wonder*, *Cultural Heritage*, *Scenic Viewpoint*), star ratings, review counts, suggested duration, admission fees, and prime lighting hours.
- Interactive **Landmark Spotlight Modal** with key highlights, exact GPS coordinates, and direct links to satellite maps.

### 4. 04 Location Awareness
- Integrates browser **Geolocation API** to determine the visitor's departure city.
- Graceful permission states: if permission is prompt, granted, or denied, the app never crashes or shows an ugly alert.
- Displays *"Departing from: [City, Country]"* and calculates exact **Haversine great-circle distances (km/miles)** and **estimated direct flight hours**.
- Interactive **Departure Origin Modal** with 24+ pre-indexed global departure hubs (London, New York, Tokyo, Dubai, Singapore, Mumbai, etc.) and custom city lookup, ensuring full utility even when GPS is disabled.

### 5. 05 Real-Time Meteorological Telemetry
- **Dual-Engine Weather Architecture**:
  - Primary: **OpenWeather API** (real-time temperature, feels like, min/max, humidity, wind, and 5-day forecast).
  - Resilient Fallback: **Open-Meteo Satellite API** (zero API key required, 100% free uptime worldwide with real satellite models).
- Hourly forecast for the next 6 hours and 5-day daily forecast.
- **Departure vs. Arrival Climate Contrast**: Directly compares current departure weather to destination climate.
- Dynamic wardrobe and packing recommendation based on current temperatures.

### 6. 06 Dynamic Image Fetching
- High-resolution photographic assets fetched dynamically from **Unsplash**.
- Supports custom **Unsplash API Access Keys** via an in-app modal or environment variables.
- Resilient image CDN resolver with blur shimmer loading states and photographer attribution so cards never show broken images.

### 7. 07 Conversational AI Chatbot (Google Gemini)
- **VOYAGE Concierge**: An intelligent conversational assistant powered by the **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.5-flash`).
- Destination-aware context: seamlessly adapts advice based on the destination the visitor is currently exploring.
- Quick prompt chips: *"How long to spend here?"*, *"What to see?"*, *"When is the best time to visit?"*, *"What should I pack?"*, and *"Local food to try?"*.
- Built-in intelligent travel knowledge base fallback when offline or if no Gemini key is provided.

### 8. 08 Visual Day-by-Day Itinerary Planning
- Trip configuration wizard: Duration (2, 3, 5, 7 days), Travel Style (*Balanced*, *Luxury & Gastronomy*, *Romantic*, *Adventure*), and Pace (*Relaxed*, *Moderate*, *Intensive*).
- Formulates a **real, readable day-by-day plan** (NOT a block of chat text):
  - Day tabs with themes and focus summaries.
  - Interactive **Morning**, **Afternoon**, and **Evening** timeline cards with specific timings, activity titles, transit advice, estimated costs, and insider tips.
  - Interactive activity completion checkboxes with live progress tracking bar.
  - **Packing Checklist** tab tailored to destination climate.
  - **Budget Breakdown** tab estimating total USD investment across lodging, dining, and transit.
  - **One-Click Export**: Save to "My Trips", Copy full text to clipboard, and Print-ready travel pass (with celebratory confetti animation!).

---

## 🛠️ Tech Stack & Architecture

- **Framework**: React 19 + TypeScript (Strict typing, zero lint warnings)
- **Build Tool**: Vite 8 with `@tailwindcss/vite`
- **Styling**: Tailwind CSS v4 + bespoke glassmorphism and editorial typography
- **Motion & Interactions**: Framer Motion transitions & micro-interactions
- **Icons**: Lucide React
- **Interactive Maps**: Leaflet + React-Leaflet with dark-mode CartoDB tile layer
- **Celebration & Feedback**: Canvas Confetti
- **Deployment**: GitHub Pages (`gh-pages` + GitHub Actions CI/CD workflow), Vercel, or Netlify

---

## 🔑 API Configuration & Zero-Config Mode

VOYAGE features a **Zero-Config Live Mode**: it is 100% functional immediately upon opening in a private browser window without requiring any API keys.

| Service | Primary Provider | Zero-Config Live Fallback |
|---|---|---|
| **AI Concierge & Itinerary** | Google Gemini API (`gemini-1.5-flash`) | Built-in Curated Intelligence Engine |
| **Live Weather Telemetry** | OpenWeather API | Open-Meteo Global Satellite Forecast |
| **Imagery** | Unsplash Developer API | Curated Unsplash High-Res CDN |
| **Location & Distances** | Browser GPS + Nominatim Geocoding | Haversine Formula + 24 Pre-Indexed Hubs |

### Adding Custom Keys
Click the **Gear / Settings icon** in the top navigation bar to open the in-app **API Configuration Modal**. Keys entered there are persisted to `localStorage` and never committed to version control.

Alternatively, create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
And populate:
```env
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_key_here
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key_here
```

---

## 🚀 Running Locally

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd voyage-travel-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🚢 Deploying to GitHub & Live Hosting

### Option A: Deploy to GitHub Pages (One Command)
1. In `package.json`, add your repository URL as the homepage (optional):
   ```json
   "homepage": "https://<your-username>.github.io/<your-repo-name>"
   ```
2. Run:
   ```bash
   npm run deploy
   ```
   This will automatically build the project and push the `dist/` directory to the `gh-pages` branch.
3. In your GitHub repository settings, navigate to **Pages** and set the source to `gh-pages` branch.

### Option B: GitHub Actions (Automated CI/CD)
The repository includes `.github/workflows/deploy.yml`. Once pushed to GitHub:
1. Go to repository **Settings** -> **Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Every push to `main` will build and publish the site automatically!

### Option C: Vercel / Netlify
- Import your repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- Build command: `npm run build`
- Output directory: `dist`
- The included `vercel.json` ensures SPA routes function seamlessly.

---

## 📐 Design Decisions & Restraint

- **Editorial Typography**: Pairing classical serif headlines (`Playfair Display`, `Cinzel`) with geometric sans-serif body text (`Plus Jakarta Sans`) gives the feel of a luxury publication like *Kinfolk* or *Aman*.
- **Subdued Color System**: Warm obsidian darks (`#08090d`, `#11131a`) with champagne gold accents (`#d4af37`) prioritize readability and focus on photography.
- **Designing for Failure**: When location is denied, weather APIs are unreachable, or search queries yield empty results, thoughtfully designed empty states, retry actions, and fallback selectors ensure a frictionless experience.

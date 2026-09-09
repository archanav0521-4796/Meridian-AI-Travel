# MERIDIAN — Editorial Luxury Travel & AI Concierge

> **An editorial-grade, responsive travel intelligence platform balancing classical typography, real-time meteorological telemetry, and AI itinerary planning.**

---

## 🌐 Live Deployed Application

- **GitHub Repository**: [https://github.com/archanav0521-4796/Meridian-AI-Travel](https://github.com/archanav0521-4796/Meridian-AI-Travel)

---

## 📖 Project Overview

**MERIDIAN** was designed from the ground up to embody modern luxury travel: where visual poise, typography, and micro-interactions carry the most weight. Eschewing the cluttered, generic layouts of standard travel directories, MERIDIAN pairs high-fashion editorial typography (`Playfair Display`, `Cinzel`, and `Plus Jakarta Sans`) with an obsidian-and-champagne visual architecture, interactive maps, and real-time data pipelines.

---

## 🌏 Curated Portfolios (30 Global Destinations)

### 🇮🇳 India & South Asia (Priority Region)
- **Jaipur & Rajasthan (India)**: The Pink City, Amber Fort & Sheesh Mahal, and Hawa Mahal.
- **Kerala Backwaters & Munnar (India)**: Alleppey luxury houseboats, Vembanad Lake, and misty Kolukkumalai tea peaks.
- **Varanasi (India)**: Sacred Ganga ghats, hypnotic evening Maha Aarti, and ancient Sarnath deer park.
- **Ladakh & Pangong Tso (India)**: High-altitude salt lake, Thiksey Monastery, and Khardung La mountain pass.
- **Goa & Konkan Coast (India)**: Arabian Sea sunset shacks, Palolem crescent bay, and UNESCO Baroque basilicas.
- **Andaman Islands (India)**: Radhanagar Beach (Beach No. 7), Cellular Jail Memorial, and Elephant Beach coral reefs.
- **Sri Lanka**: 5th-century Sigiriya Lion Rock sky palace, Ella Nine Arch viaduct, and Galle Dutch Fort.
- **Bhutan**: Paro Taktsang (Tiger’s Nest cliffside monastery), Punakha Dzong, and Gross National Happiness.
- **Nepal**: Sacred Boudhanath mandala stupa, Phewa Lake boating, and Annapurna sunrise at Sarangkot.
- **Maldives**: Baa Atoll UNESCO Biosphere, Hanifaru Bay manta ray cyclones, and bioluminescent lagoons.

### 🌴 Southeast & East Asia
- **Thailand**: The Grand Palace & Wat Phra Kaew, Phi Phi Islands & Maya Bay lagoon, and Wat Arun.
- **Bali (Indonesia)**: Tegallalang stepped rice terraces, Uluwatu cliffside Kecak fire dance, and Tanah Lot sea temple.
- **South Korea (Seoul & Jeju)**: Gyeongbokgung Royal Palace, Bukchon Hanok village, and Seongsan Ilchulbong sunrise peak.
- **Kyoto (Japan)**: Fushimi Inari torii gates, Kinkaku-ji Golden Pavilion, and Arashiyama bamboo grove.
- **Tokyo (Japan)**: Sensō-ji Temple in Asakusa, Shibuya Sky, and meiji shrine.
- **Singapore**: Gardens by the Bay Supertree Grove, Marina Bay Sands SkyPark, and Jewel Changi Rain Vortex.

### 🌍 Global Icons & World Capitals
- **Dubai (UAE)**: Burj Khalifa & Dubai Fountain, Palm Jumeirah, and Museum of the Future.
- **Paris (France)**: The Eiffel Tower summit, Musée du Louvre, and Montmartre Sacré-Cœur.
- **Santorini (Greece)**: Oia caldera rim, Skaros Rock, and whitewashed Aegean cubism.
- **Rome (Italy)**: The Colosseum & Roman Forum, Vatican City & St. Peter's Basilica, and the Trevi Fountain.
- **London (United Kingdom)**: Big Ben & Palace of Westminster, Tower Bridge, and the British Museum.
- **New York City (United States)**: Central Park, Statue of Liberty, and the Empire State Building.
- **Amalfi Coast (Italy)**: Positano pastel cliffs and Ravello Villa Cimbrone Terrace of Infinity.
- **Swiss Alps & Zermatt (Switzerland)**: Gornergrat cogwheel railway and Matterhorn alpine panorama.
- **Reykjavik (Iceland)**: Hallgrímskirkja basalt tower, Gullfoss waterfall, and Strokkur geysers.
- **Banff & Lake Louise (Canada)**: Turquoise glacial waters framed by the Canadian Rocky Mountains.
- **Rio de Janeiro (Brazil)**: Christ the Redeemer atop Corcovado and golden sands of Copacabana.
- **Cape Town (South Africa)**: Table Mountain rotating cableway, Boulders Beach penguin colony, and Bo-Kaap.
- **Cairo & Giza (Egypt)**: The Great Pyramids and the Sphinx defying time on the desert plateau.
- **Queenstown (New Zealand)**: Glacial Lake Wakatipu and Skyline Gondola over the Remarkables.

---

## ✨ 8 Core Requirements Built

### 1. 01 A Landing Experience
- Full-viewport hero featuring a **silent 10-second alternating background video** cross-fading seamlessly between coastal waters and golden sunset reflections.
- Editorial typography, instant search pill, dynamic destination ticker, and quick region pill filters with **India placed first**.
- Completely uncluttered design with zero intrusive overlay buttons or technical badges.

### 2. 02 Destination Explorer
- Multi-faceted exploration across **30 world-class destinations** spanning all major continents.
- Real-time search with fuzzy matching across names, countries, tags, landmarks, and vibes.
- Dynamic filtering by **Region** (`India`, `Asia`, `Europe`, `Americas`, `Africa`, `Oceania`) with **India featured first**.
- Atmosphere filters (`Cultural & Historic`, `Beach & Coastal`, `Alpine & Nature`, `Urban & Modern`, `Romantic & Luxury`).
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
- Interactive **Departure Origin Modal** with 30+ pre-indexed global departure hubs (Mumbai, New Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Colombo, Kathmandu, Male, London, New York, Tokyo, Dubai, Singapore, etc.) and custom city lookup, ensuring full utility even when GPS is disabled.

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
- **MERIDIAN Concierge**: An intelligent conversational assistant powered by the **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.5-flash`).
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

MERIDIAN features a **Zero-Config Live Mode**: it is 100% functional immediately upon opening in a private browser window without requiring any API keys.

| Service | Primary Provider | Zero-Config Live Fallback |
|---|---|---|
| **AI Concierge & Itinerary** | Google Gemini API (`gemini-1.5-flash`) | Built-in Curated Intelligence Engine |
| **Live Weather Telemetry** | OpenWeather API | Open-Meteo Global Satellite Forecast |
| **Imagery** | Unsplash Developer API | Curated Unsplash High-Res CDN |
| **Location & Distances** | Browser GPS + Nominatim Geocoding | Haversine Formula + 30 Pre-Indexed Hubs |

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

### Option A: Automatic GitHub Actions (Recommended)
The repository includes `.github/workflows/deploy.yml`. Once pushed to GitHub:
1. Go to repository **Settings** -> **Pages**.
2. Under **Build and deployment**, select **GitHub Actions**.
3. Every push to `main` will build and publish the site automatically!

### Option B: Deploy via `gh-pages` command
```bash
npm run deploy
```
Then in **Settings** -> **Pages**, set the branch to `gh-pages`.

### Option C: Vercel / Netlify
- Import your repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
- Build command: `npm run build`
- Output directory: `dist`
- The included `vercel.json` ensures SPA routes function seamlessly.

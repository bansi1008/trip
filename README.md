<p align="center">
  <img src="public/logo2.jpg" alt="AI Travel Logo" width="120" height="120" style="border-radius: 50%;" />
</p>

<h1 align="center">✈️ AI Travel — Intelligent Trip Planner</h1>

<p align="center">
  <strong>A full-stack AI travel planning platform that combines LLM-based itinerary generation with real-time flight and hotel data, authentication, caching, and persistent trip management.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Amadeus_API-Flights-1B69B4" alt="Amadeus" />
  <img src="https://img.shields.io/badge/Edge_Runtime-Enabled-F7DF1E" alt="Edge Runtime" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## 🎯 What This Project Demonstrates

| Skill Area | Implementation |
|---|---|
| **AI/LLM Integration** | Google Gemini 2.5 Flash with streaming, structured JSON output, and prompt engineering |
| **External API Orchestration** | Amadeus (flights), RapidAPI (hotels), Google Maps & Places (autocomplete + photos) |
| **Full-Stack Architecture** | Next.js 15 App Router with API routes, Edge Runtime, and SSR |
| **Authentication** | JWT-based auth with `jose`, bcrypt password hashing, OTP email verification via Nodemailer |
| **Database Design** | MongoDB with Mongoose ODM, connection pooling, and schema validation |
| **Caching & Performance** | Upstash Redis for application caching, plus in-memory TTL caching for Amadeus OAuth tokens |
| **UX Engineering** | Mood-based trip suggestions, travel persona quiz, multi-step forms, loading animations |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 19)                            │
│                                                                     │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Navbar   │  │   TripForm   │  │  Results    │  │ Saved Trips  │  │
│  └──────────┘  │  (multi-step │  │  ┌────────┐ │  └──────────────┘  │
│                │   wizard)     │  │  │Itinerary│ │                   │
│  ┌──────────┐  └──────┬───────┘  │  │Flight   │ │  ┌──────────────┐ │
│  │   Hero   │         │          │  │Hotel    │ │  │  Auth Pages  │ │
│  │ Feature  │         │          │  └────────┘ │  │  SignIn/Up    │ │
│  │ Persona  │         │          └─────────────┘  │  OTP Verify   │ │
│  │ Mood     │         │                           └──────────────┘  │
│  └──────────┘         │                                             │
└───────────────────────┼─────────────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────┼─────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                               │
│                        │                                            │
│  ┌─────────────────────▼──────────────────────────────────────────┐ │
│  │            Edge Middleware (JWT verification)                   │ │
│  │         Protected routes: /home, /results                      │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Edge API Routes                    Node.js API Routes              │
│  ┌──────────┐                       ┌────────┐  ┌───────────┐      │
│  │/api/trip  │  ┌──────────┐        │/api/    │  │/api/login │      │
│  │ Gemini   │  │/api/flight│        │hotel   │  │/api/signup│      │
│  │ Stream   │  │ Amadeus  │  ┌──────┤RapidAPI│  │/api/verify│      │
│  └────┬─────┘  └────┬─────┘  │/api/ └───┬────┘  │/api/logout│      │
│       │              │        │places    │       └─────┬─────┘      │
│       │              │        │Google    │             │            │
│       │              │        │Maps │    │             │            │
│       │              │        └──┬──┘    │             │            │
└───────┼──────────────┼───────────┼───────┼─────────────┼────────────┘
        │              │           │       │             │
        ▼              ▼           ▼       ▼             ▼
  ┌──────────┐  ┌───────────┐ ┌─────────┐ ┌─────────┐ ┌──────────┐
  │ Google   │  │  Amadeus  │ │ Google  │ │RapidAPI │ │ MongoDB  │
  │ Gemini   │  │  Flight   │ │ Maps /  │ │ Travel  │ │  Atlas   │
  │ 2.5 Flash│  │  Search   │ │ Places  │ │ Advisor │ │          │
  └──────────┘  └───────────┘ └─────────┘ └─────────┘ └──────────┘
                                                        ┌──────────┐
                                                        │ Upstash  │
                                                        │  Redis   │
                                                        └──────────┘
```

---

## 🧠 Engineering Decisions

### Why Edge Runtime for the AI route?

The `/api/trip` endpoint is the most latency-sensitive route in the application — it's where users wait for AI generation. Edge Runtime reduces cold start time and supports streaming responses, keeping the generation experience responsive. Other API routes (auth, hotel search) don't benefit from Edge and run on standard Node.js where they have access to the full Node API surface.

### Why cache Amadeus access tokens in-memory?

Amadeus OAuth2 tokens have a limited lifetime (~30 minutes). Rather than authenticating on every flight search request, tokens are cached in-memory with a TTL buffer (expiry minus 60 seconds). This avoids unnecessary auth round-trips and reduces latency for subsequent flight searches.

### Why Redis alongside MongoDB?

Redis (via Upstash) serves as a fast external cache for ephemeral data that doesn't need durable storage — session state and application-level caching. MongoDB handles persistent data: user accounts, saved trips, and generated itineraries. Using both keeps read-heavy operations fast without overloading the primary database.

### Why MongoDB?

Trip and user data is document-oriented — a generated itinerary is a nested JSON object with variable structure per day. MongoDB stores this naturally without requiring a rigid relational schema, and Mongoose provides schema validation where it's needed (user model) without forcing it everywhere.

### Why separate API routes per external service?

Flights (Amadeus), hotels (RapidAPI), maps (Google Places), and AI generation (Gemini) each have different data models, rate limits, authentication mechanisms, and failure characteristics. Isolating them behind separate API routes means a hotel API outage doesn't break flight search, and the client stays independent of third-party API details.

### Why concurrent AI requests?

The trip endpoint initiates both the itinerary and hotel generation requests concurrently via `Promise.all`, then processes the results sequentially. This reduces total wait time compared to generating them one after another, since both LLM calls can run in parallel on Google's infrastructure.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # Backend API Routes
│   │   ├── trip/route.js       #   → AI itinerary generation (Edge Runtime, Gemini streaming)
│   │   ├── flight/route.js     #   → Real flight search (Amadeus API)
│   │   ├── hotel/route.js      #   → Hotel search (RapidAPI Travel Advisor)
│   │   ├── places/route.js     #   → City autocomplete (Google Places)
│   │   ├── photo/route.js      #   → Destination photos (Google Places Photos)
│   │   ├── iata/route.js       #   → Airport IATA code lookup (Amadeus)
│   │   ├── login/              #   → JWT-based authentication
│   │   ├── signup/             #   → User registration with bcrypt hashing
│   │   ├── verifyotp/          #   → Email OTP verification (Nodemailer)
│   │   ├── logout/             #   → Session termination
│   │   └── mydet/              #   → User profile details
│   │
│   ├── components/             # UI Components
│   │   ├── TripForm.js         #   → Multi-step trip planning wizard
│   │   ├── Flightcard.js       #   → Flight results display with comparison
│   │   ├── ItineraryDisplay.js #   → Day-by-day AI itinerary renderer
│   │   ├── HotelCard.js        #   → Hotel listings with ratings
│   │   ├── CitySearch.js       #   → Google Places autocomplete search
│   │   ├── Hero.js             #   → Animated landing hero section
│   │   ├── TravelPersona.js    #   → Travel personality quiz
│   │   ├── MoodBasedTrips.js   #   → Mood-to-destination suggestions
│   │   ├── SmartItinerary.js   #   → AI itinerary feature showcase
│   │   ├── Navbar.js           #   → Landing page navigation
│   │   ├── TripNavbar.js       #   → Authenticated app navigation
│   │   ├── Feature.js          #   → Feature cards section
│   │   ├── Footer.js           #   → Site footer
│   │   └── LoadingSpinner.js   #   → Animated loading states
│   │
│   ├── home/                   # Trip planning dashboard (protected)
│   ├── results/                # Trip results page (protected)
│   ├── saved-trips/            # Saved trips history
│   ├── signin/ & signup/       # Authentication pages
│   ├── about/ & howitworks/    # Informational pages
│   └── page.js                 # Landing page
│
├── lib/                        # Shared Utilities
│   ├── amadeusToken.js         #   → Amadeus OAuth2 token with in-memory caching
│   ├── authMiddleware.js       #   → JWT verification for API routes (jose)
│   ├── budgetCategorizer.js    #   → Country-aware budget classification engine
│   ├── mongodb.js              #   → Mongoose connection with global caching
│   └── token.js                #   → Token utility helpers
│
├── models/
│   └── User.js                 # Mongoose User schema with pre-save hooks
│
├── styles/
│   └── main.css                # Global design system
│
└── middleware.ts                # Next.js Edge Middleware — route protection
```

---

## ✨ Key Features

### 🤖 AI-Powered Itinerary Generation
- Generates structured, day-by-day travel plans using **Google Gemini 2.5 Flash**
- Activities are organized by time of day (morning, afternoon, evening, night)
- Activities within each day are clustered within **3–5 km** to minimize travel
- Concurrent AI generation — itinerary and hotel requests initiated in parallel via `Promise.all`, reducing total wait time
- Budget-aware suggestions using a **country cost-of-living index** (30+ countries)

### ✈️ Real Flight Search
- Live flight data from the **Amadeus Flight Offers API**
- Support for one-way and round-trip searches
- Results sorted by price with airline name, cabin class, and duration
- Budget-filtered results with configurable max price
- Token caching with automatic refresh (TTL-based)

### 🏨 Hotel Recommendations
- Dual-source hotel suggestions:
  - **AI-generated** hotel picks matching the trip's budget and group size (via Gemini)
  - **Real hotel listings** from RapidAPI Travel Advisor with live pricing and ratings

### 🔐 Authentication System
- **JWT-based** auth with `jose` library (Edge-compatible)
- Passwords hashed with **bcrypt** before storage
- **Email OTP verification** on signup via Nodemailer
- Route protection via Next.js Edge Middleware on `/home` and `/results`
- Cookie-based token management with server-side verification

### 🎨 UX Highlights
- **Travel Persona Quiz** — personality-driven destination suggestions
- **Mood-Based Trips** — choose your vibe, get matching destinations
- **Google Places Autocomplete** — real-time city search with photo previews
- **Multi-step Trip Form** — origin, destination, dates, interests, group size, budget
- **Animated Loading States** — custom CSS spinners during AI generation

---

## 🧠 Technical Deep Dives

### Budget Categorization Engine

The budget system normalizes costs against a **cost-of-living index** for 30+ countries. A "$50/day" budget means very different things in Switzerland vs. Thailand:

```javascript
// Example: $50/day in India (COL index: 25) → "luxury"
// Example: $50/day in Switzerland (COL index: 122) → "very low"
const multiplier = countryIndex / 100;
const adjustedThresholds = baseThresholds.map(t => t / multiplier);
```

### Amadeus Token Caching

Avoids redundant OAuth2 calls with in-memory TTL caching:

```javascript
// Token is reused until 60 seconds before expiry
if (tokenCache.access_token && tokenCache.expires_at > now) {
  return tokenCache.access_token; // Cache hit
}
// Otherwise, fetch new token and cache it
```

### Concurrent AI Generation

The `/api/trip` route runs on the **Edge Runtime** and initiates both AI requests concurrently. The streams are started in parallel, then consumed sequentially:

```javascript
export const runtime = "edge";
// Start both generation requests concurrently
const [itineraryStream, hotelsStream] = await Promise.all([
  ai.models.generateContentStream({ model: "gemini-2.5-flash", ... }),
  ai.models.generateContentStream({ model: "gemini-2.5-flash", ... }),
]);
// Consume results sequentially
for await (const chunk of itineraryStream) { ... }
for await (const chunk of hotelsStream) { ... }
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15.3 (App Router + Turbopack) | SSR, API routes, Edge middleware |
| **Frontend** | React 19 | UI components with hooks |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/genai`) | Itinerary + hotel generation |
| **Flight Data** | Amadeus Self-Service API | Real-time flight search |
| **Hotel Data** | RapidAPI Travel Advisor | Hotel listings and pricing |
| **Maps** | Google Maps Platform (Places + Photos) | City autocomplete and imagery |
| **Database** | MongoDB Atlas + Mongoose 8 | User accounts and trip storage |
| **Cache** | Upstash Redis + in-memory TTL | Application caching (Redis), Amadeus token caching (in-memory) |
| **Auth** | jose + bcryptjs + Nodemailer | JWT, password hashing, email OTP |
| **Analytics** | Vercel Analytics | Usage tracking |
| **Styling** | CSS Modules + Global CSS | Component-scoped and app-wide styles |
| **Notifications** | react-hot-toast | User feedback toasts |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and **npm**
- MongoDB Atlas cluster (or local MongoDB instance)
- API keys for: Google Gemini, Amadeus, Google Maps, RapidAPI

### 1. Clone & Install

```bash
git clone https://github.com/bansi1008/trip.git
cd trip
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the project root:

```env
# AI
GOOGLE_API_KEY=your_gemini_api_key

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/trip

# Auth
JWT_SECRET=your_jwt_secret_key

# Flight Search
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# Maps & Places
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Redis (optional — for caching)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the app runs with **Turbopack** for fast refresh.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/trip` | 🔒 JWT | Generate AI itinerary + hotel suggestions |
| `GET` | `/api/flight?origin=SFO&destination=LHR&departureDate=2026-09-01` | — | Search real flights via Amadeus |
| `GET` | `/api/hotel?city=Paris&adults=2&nights=3` | — | Search hotels via RapidAPI |
| `GET` | `/api/places?input=lon` | — | City autocomplete (Google Places) |
| `GET` | `/api/photo?place_id=ChIJ...` | — | Fetch destination photo URL |
| `GET` | `/api/iata?keyword=London` | — | Lookup airport IATA code |
| `POST` | `/api/signup` | — | Register new user |
| `POST` | `/api/login` | — | Authenticate and receive JWT |
| `POST` | `/api/verifyotp` | — | Verify email OTP |
| `POST` | `/api/logout` | — | Clear auth cookie |
| `GET` | `/api/mydet` | 🔒 JWT | Get authenticated user details |

---

## 🧪 Request Example

### Generate a Trip

```bash
curl -X POST http://localhost:3000/api/trip \
  -H "Content-Type: application/json" \
  -H "Cookie: token=<your_jwt>" \
  -d '{
    "location": "Tokyo, Japan",
    "days": 5,
    "interests": ["culture", "food", "nightlife"],
    "travelgroup": "2",
    "budget": "$2000"
  }'
```

### Response Shape

```json
{
  "itinerary": {
    "day1": {
      "morning": { "activityName": "...", "activitydescription": "...", "price": "...", "notes": "..." },
      "afternoon": { "..." },
      "evening": { "..." },
      "night": { "..." }
    },
    "day2": { "..." }
  },
  "hotel": [
    { "hotelName": "...", "pricePerNight": "$120", "rating": 4.5, "address": "..." }
  ]
}
```

---

## 📄 License

This project is open source and available for educational and portfolio purposes.

---

<p align="center">
  Built with  using Next.js, React, Google Gemini AI, and the Amadeus API
</p>

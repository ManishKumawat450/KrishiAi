# 🌾 KrishiAI — Intelligent Farming Guidance Platform

> **AI-powered farming intelligence for Indian farmers** — Real data, real AI, real results.
> Built for the JavaScript AI Build-a-thon 2026.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey)](https://expressjs.com/)

## 🚀 What KrishiAI Does

KrishiAI helps Indian farmers make smarter, data-driven decisions through 6 AI-powered features:

| Feature | What it does |
|---------|-------------|
| 🌱 **Crop Recommendations** | Recommends best crops based on temperature, rainfall, soil pH, humidity |
| 🦠 **Disease Detection** | Identifies crop diseases from symptoms with treatment & prevention plans |
| 💹 **Market Price Prediction** | Forecasts mandi prices with 7-day history, trend analysis & MSP comparison |
| 🧪 **Fertilizer Guide** | Evidence-based NPK fertilizer recommendations with cost estimation |
| 🌤️ **Weather Intelligence** | Real-time weather data for any Indian city via OpenWeatherMap API |
| 💬 **AI Chat Assistant** | NLP-based farmer support chatbot (English, Hindi, Punjabi) |


## System Architecture
<img width="2572" height="916" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/8d04baf6-8349-4368-a48b-6cd238513424" />


## 🏃 Quick Start (5 minutes)

### Option 1: Docker (Easiest)

```bash
# Clone and start
git clone https://github.com/ManishKumawat450/KrishiAi.git
cd KrishiAi
cp .env.example .env
# (Optional) Add OpenWeatherMap API key to .env for live weather
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

### Option 2: Local Development

**Prerequisites**: Node.js 18+

```bash
# 1. Clone repository
git clone https://github.com/ManishKumawat450/KrishiAi.git
cd KrishiAi

# 2. Setup environment
cp .env.example .env
# (Optional) Edit .env and add your OpenWeatherMap API key

# 3. Install & start backend
npm install
npm run dev
# Backend runs on http://localhost:5001

# 4. Install & start frontend (new terminal)
cd krishiai-frontend
npm install
npm start
# Frontend runs on http://localhost:3000
```

## 🌐 API Endpoints

### GET `/api/weather?city=Delhi`
Returns real weather data with farming suitability analysis.

```json
{
  "temperature": 32,
  "humidity": 55,
  "windSpeed": 14,
  "cropAdvice": "Good season for wheat, mustard, and barley.",
  "farmingSuitability": { "suitable": true, "score": 100 }
}
```

### POST `/api/crops/recommend`
Get AI-ranked crop recommendations for your field conditions.

```bash
curl -X POST http://localhost:5001/api/crops/recommend \
  -H "Content-Type: application/json" \
  -d '{"temperature": 28, "rainfall": 1200, "phLevel": 6.5, "humidity": 75}'
```

Returns top 5 crops ranked by suitability score (0-100%) with reasons.

### POST `/api/disease/detect`
Identify crop diseases from symptoms.

```bash
curl -X POST http://localhost:5001/api/disease/detect \
  -H "Content-Type: application/json" \
  -d '{"symptoms": ["Yellow leaves", "Brown spots", "Wilting"], "cropType": "Wheat"}'
```

Returns: disease name (Hindi + English), confidence %, treatment, prevention, organic alternatives.

### GET `/api/prices/predict?crop=wheat&days=7`
Predict mandi prices with trend analysis.

Returns: current price, predicted price, trend direction, MSP comparison, best selling markets.

### POST `/api/fertilizer/recommend`
Get evidence-based fertilizer recommendations.

```bash
curl -X POST http://localhost:5001/api/fertilizer/recommend \
  -H "Content-Type: application/json" \
  -d '{"cropType": "Wheat", "nitrogen": 20, "phosphorus": 10, "potassium": 40, "areaInAcres": 2}'
```

Returns: specific fertilizers (Urea, DAP, MOP, Zinc Sulphate) with kg/acre, timing, cost, and organic alternatives.

### POST `/api/chat`
NLP-based farmer support chatbot.

```bash
curl -X POST http://localhost:5001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "मेरी गेहूं की फसल में पीले धब्बे हो रहे हैं"}'
```

Supports English, Hindi (हिंदी), Punjabi (ਪੰਜਾਬੀ), and other Indian languages.

## 🔑 API Keys (Optional)

KrishiAI works **without any API key** using realistic fallback data. For live data:

1. Get a **free** OpenWeatherMap API key: https://openweathermap.org/api
   - Free tier: 1,000 calls/day (sufficient for production)
2. Add to `.env`: `OPENWEATHER_API_KEY=your_key_here`

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS |
| **Backend** | Node.js 20, Express 4, TypeScript |
| **AI/ML** | Rule-based ML (crop), Symptom matching (disease), Time-series (prices) |
| **Weather** | OpenWeatherMap API + city-profile fallback |
| **Deployment** | Docker + Docker Compose |

## 📁 Project Structure

```
KrishiAi/
├── src/                          # Backend source
│   ├── server.ts                 # Express server entry point
│   ├── routes/api.ts             # All API routes
│   ├── services/
│   │   ├── weatherService.ts     # OpenWeatherMap + fallback
│   │   ├── cropRecommendationService.ts  # ML scoring engine (12 crops)
│   │   ├── diseaseDetectionService.ts    # Symptom matching (8 diseases)
│   │   ├── priceService.ts       # Mandi price data + prediction
│   │   ├── fertilizerService.ts  # NPK-based recommendations
│   │   └── chatService.ts        # NLP query processor
│   ├── agents/                   # AI agent wrappers
│   ├── types/dataModels.ts       # TypeScript interfaces
│   └── utils/                    # Crop & disease databases
├── krishiai-frontend/            # React frontend
│   ├── src/pages/
│   │   ├── Home.tsx              # Landing page + weather widget
│   │   ├── CropRecommendation.tsx
│   │   ├── DiseaseDetection.tsx
│   │   ├── PricePrediction.tsx
│   │   ├── FertilizerGuide.tsx
│   │   └── Chat.tsx              # AI chat interface
│   └── src/components/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── Dockerfile                    # Backend Docker image
├── docker-compose.yml            # Full stack orchestration
└── .env.example                  # Environment variables template
```

## 🤖 AI Features Explained

### Crop Recommendation Engine
- **Algorithm**: Multi-factor weighted scoring (temperature 35%, rainfall 30%, pH 20%, humidity 15%)
- **Database**: 12 Indian crops with scientific pH, temperature, rainfall, and humidity ranges
- **Output**: Ranked crops with suitability %, season, market price, and Hindi names

### Disease Detection System
- **Algorithm**: Symptom-matching with partial text matching + crop-specific boost
- **Database**: 8 major Indian crop diseases with symptoms, treatments, prevention, and organic alternatives
- **Confidence scoring**: Based on symptom match ratio and crop relevance

### Mandi Price Prediction
- **Algorithm**: 7-day historical trend analysis + seasonal adjustment factors
- **Data**: Realistic price data for 11 major Indian crops with MSP reference
- **Output**: Current price, predicted price, trend direction, best selling markets

### Fertilizer Recommendation Engine
- **Algorithm**: Soil NPK sufficiency analysis against crop-specific requirements
- **Database**: Crop NPK requirements for 11 major crops
- **Output**: Specific fertilizers with kg/acre, cost, timing, application method, and organic alternatives

## 🌍 Real-World Impact

KrishiAI helps farmers with:
- ✅ **Crop planning**: Know what to grow before spending on seeds
- ✅ **Disease management**: Identify problems early, save crops
- ✅ **Market timing**: Sell at the right time with price forecasts
- ✅ **Input optimization**: Don't over/under-fertilize, save money
- ✅ **Language accessibility**: Works in Hindi and other Indian languages

## 📊 Example Queries

```
"What crop should I grow in Punjab with temperature 15°C, rainfall 600mm, pH 7.0?"
→ Wheat (92%), Chickpea (78%), Mustard (71%)

"My rice leaves show yellow spots and water-soaked lesions"
→ Bacterial Blight (81%) — spray Copper Oxychloride 3g/L

"What will be wheat price in 7 days?"
→ ₹2221/quintal (trend: ↑, confidence: 80%)

"Suggest fertilizer for 2 acres of wheat with nitrogen=20, phosphorus=10, potassium=40"
→ Urea 108kg + DAP 59kg + MOP + Zinc Sulphate — Total cost: ₹8,744

"अच्छी फसल के लिए क्या करें?" (Hindi: What to do for good crop?)
→ Full crop recommendation and season-wise guidance
```

## 📜 License

MIT License — Free to use, modify, and distribute.

---

*Built with ❤️ for Indian farmers | JavaScript AI Build-a-thon 2026*

// chatService.ts
// NLP-based farmer support chat service with multilingual support

export interface ChatInput {
    query: string;
    language?: string; // 'en' | 'hi' | 'pa' | 'te' | 'ta' | 'mr'
}

export interface ChatResponse {
    query: string;
    response: string;
    intent: string;
    language: string;
    suggestedActions: string[];
    relatedTopics: string[];
}

// Keyword-to-intent mapping
interface IntentPattern {
    intent: string;
    keywords: string[];
    response: (query: string) => string;
    suggestions: string[];
    relatedTopics: string[];
}

const intents: IntentPattern[] = [
    {
        intent: 'crop_recommendation',
        keywords: ['crop', 'grow', 'plant', 'sow', 'kharif', 'rabi', 'zaid', 'season', 'cultivate', 'ugao', 'fasal', 'kheti'],
        response: () => `🌱 **Crop Recommendation Guide**

For the **Rabi season (Oct–Mar)**: Wheat, Chickpea, Mustard, Barley are ideal.
For the **Kharif season (Jun–Oct)**: Rice, Maize, Cotton, Soybean, Groundnut work best.

**Best practices**:
- Test your soil pH before sowing (ideal: 6.0–7.5)
- Use certified seeds from government centers
- Check local weather forecast before sowing

👉 Use the **Crop Recommendation tool** on this platform to get personalized suggestions based on your location and soil conditions.`,
        suggestions: ['What crops grow in Punjab?', 'Best crops for black soil?', 'Which crop needs least water?'],
        relatedTopics: ['Soil Testing', 'Seed Selection', 'Irrigation Management'],
    },
    {
        intent: 'disease_detection',
        keywords: ['disease', 'pest', 'insect', 'spot', 'yellow', 'wilt', 'blight', 'rust', 'mildew', 'fungus', 'bimari', 'rog', 'keeda', 'patta'],
        response: () => `🦠 **Crop Disease Management**

Common signs of disease:
- **Yellow/Brown spots** → Leaf blight or rust
- **White powdery coating** → Powdery mildew (fungal)
- **Wilting/Drooping** → Fusarium wilt (soil-borne)
- **Water-soaked lesions** → Bacterial blight

**General prevention**:
1. Use disease-resistant varieties
2. Avoid excess nitrogen fertilizer
3. Ensure proper field drainage
4. Remove infected plants immediately

💊 **Emergency treatment**: Spray Mancozeb 2.5g/L water every 10–14 days for fungal diseases.

👉 Use the **Disease Detection tool** to get specific diagnosis and treatment for your crop.`,
        suggestions: ['How to treat wheat rust?', 'Rice blast prevention?', 'Organic fungicide for vegetables?'],
        relatedTopics: ['Pesticide Safety', 'Organic Farming', 'Integrated Pest Management'],
    },
    {
        intent: 'fertilizer_guidance',
        keywords: ['fertilizer', 'manure', 'nutrient', 'urea', 'dap', 'nitrogen', 'phosphorus', 'potassium', 'npk', 'khad', 'urvarak', 'soil', 'mitti'],
        response: () => `🧪 **Fertilizer Guidance**

**Key macronutrients**:
- **Nitrogen (N/यूरिया)**: Promotes green growth and leaf development
- **Phosphorus (P/DAP)**: Strengthens roots and early growth  
- **Potassium (K/Potash)**: Improves fruit quality and disease resistance

**Soil test-based recommendations**:
- Get soil tested at nearest Krishi Vigyan Kendra (KVK)
- Apply nutrients based on soil test results — avoid over-fertilization
- Use Soil Health Card scheme (Government of India) for free soil testing

**Cost-saving tips**:
- Compost + FYM can reduce chemical fertilizer need by 25–30%
- Biofertilizers (Rhizobium, PSB) are free from many government centers
- Apply micronutrients like Zinc Sulphate (5kg/acre) for iron/zinc deficiency

👉 Use the **Fertilizer Guide tool** for crop-specific recommendations.`,
        suggestions: ['How much urea for 1 acre wheat?', 'Organic fertilizer for rice?', 'How to compost at home?'],
        relatedTopics: ['Soil Health Card', 'Organic Farming', 'Biofertilizers'],
    },
    {
        intent: 'price_prediction',
        keywords: ['price', 'mandi', 'market', 'sell', 'rate', 'bhaav', 'bikri', 'daam', 'cost', 'value', 'profit', 'income'],
        response: () => `💹 **Market Price Information**

**Current MSP (Minimum Support Price) 2025–26**:
- Wheat: ₹2,275/quintal
- Rice (Paddy): ₹2,183/quintal  
- Cotton: ₹6,620/quintal
- Soybean: ₹4,600/quintal
- Mustard: ₹5,650/quintal
- Chickpea: ₹5,440/quintal

**Where to sell**:
- APMC mandis (government regulated markets)
- eNAM (National Agricultural Market) platform
- FPOs (Farmer Producer Organizations) for better rates
- Direct-to-consumer through farmer markets

**Important**: If market price is below MSP, sell to government procurement agencies (FCI/NAFED).

👉 Use the **Price Prediction tool** to get current mandi rates and 7-day price forecast.`,
        suggestions: ['Wheat price in Punjab today?', 'When to sell rice for best price?', 'What is MSP for cotton?'],
        relatedTopics: ['eNAM Platform', 'Government Schemes', 'Storage Management'],
    },
    {
        intent: 'weather_farming',
        keywords: ['weather', 'rain', 'drought', 'flood', 'temperature', 'season', 'monsoon', 'irrigation', 'mausam', 'barish', 'paani', 'sinchai'],
        response: () => `🌤️ **Weather & Irrigation Guidance**

**Irrigation Tips by Crop**:
- Wheat: 5–6 irrigations (first at crown root stage, 21 days)
- Rice: Keep 2–5 cm water during vegetative stage; drain before harvest
- Cotton: Critical irrigation at flowering and boll development stage
- Maize: Avoid waterlogging; drain after heavy rain

**Drought management**:
- Use mulching to conserve soil moisture
- Micro-irrigation (drip/sprinkler) saves 30–50% water
- PM Krishi Sinchayee Yojana: 90% subsidy on micro-irrigation

**Flood/Waterlogging**:
- Create proper drainage channels before Kharif season
- Grow short-duration varieties if monsoon is delayed
- Use raised bed farming in flood-prone areas

👉 Use the **Weather Widget** on the home page for real-time weather data for your location.`,
        suggestions: ['When to irrigate wheat in March?', 'How to protect crops from hailstorm?', 'Subsidy on drip irrigation?'],
        relatedTopics: ['Water Conservation', 'Government Schemes', 'Climate-Smart Farming'],
    },
    {
        intent: 'government_schemes',
        keywords: ['scheme', 'subsidy', 'loan', 'kisan', 'pm', 'government', 'credit', 'insurance', 'yojana', 'sarkar', 'sahayata', 'paisa', 'rupay'],
        response: () => `🏛️ **Government Schemes for Farmers**

**Financial Support**:
- **PM Kisan Samman Nidhi**: ₹6,000/year direct to bank account
- **Kisan Credit Card (KCC)**: Short-term crop loans at 4% interest
- **PM Fasal Bima Yojana**: Crop insurance at low premium (2% for Kharif, 1.5% for Rabi)

**Input Subsidies**:
- Seeds: 50% subsidy on certified seeds
- Fertilizers: Subsidized rates at cooperative societies
- Micro-irrigation: Up to 90% subsidy on drip/sprinkler systems

**Market Support**:
- MSP (Minimum Support Price) for 23 crops
- eNAM: Online market for better price discovery
- FPOs: Form Farmer Producer Organizations for collective bargaining

**How to apply**:
Contact your nearest **Krishi Vigyan Kendra (KVK)** or **District Agriculture Office**
Register at: pmkisan.gov.in | enam.gov.in | pmfby.gov.in`,
        suggestions: ['How to register for PM Kisan?', 'Crop insurance claim process?', 'Kisan Credit Card benefits?'],
        relatedTopics: ['PM Kisan', 'Crop Insurance', 'KCC Loan'],
    },
    {
        intent: 'organic_farming',
        keywords: ['organic', 'natural', 'jaivik', 'bio', 'compost', 'vermi', 'chemical free', 'neem', 'jeevamrut', 'panchgavya'],
        response: () => `🌿 **Organic Farming Guide**

**Getting Started**:
1. Transition period: 2–3 years to convert conventional to organic farm
2. Certification: Apply to APEDA (Agricultural and Processed Food Products Export Development Authority)
3. Premium pricing: Organic produce commands 20–50% higher prices

**Key Organic Inputs**:
- **Jeevamrut**: 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour + 200L water; ferment 48hrs
- **Panchgavya**: 5 cow products (milk, curd, ghee, dung, urine) — improves crop immunity
- **Vermicompost**: 100–200 kg/acre for balanced nutrition

**Bio-pesticides**:
- Neem oil 5ml/L — broad spectrum pest control
- Beauveria bassiana — controls aphids, whiteflies
- Trichoderma viride — soil-borne disease control

**Certification**: Participatory Guarantee System (PGS-India) — free government certification for small farmers`,
        suggestions: ['How to make jeevamrut at home?', 'Organic pest control for vegetables?', 'How to get organic certification?'],
        relatedTopics: ['Biofertilizers', 'Composting', 'Natural Farming'],
    },
];

const greetings = ['hello', 'hi', 'namaste', 'namaskar', 'sat sri akal', 'jai kisan', 'help', 'start'];

function detectLanguage(query: string): string {
    // Simple script detection
    if (/[\u0900-\u097F]/.test(query)) return 'hi'; // Hindi/Devanagari
    if (/[\u0A00-\u0A7F]/.test(query)) return 'pa'; // Punjabi/Gurmukhi
    if (/[\u0C00-\u0C7F]/.test(query)) return 'te'; // Telugu
    if (/[\u0B80-\u0BFF]/.test(query)) return 'ta'; // Tamil
    if (/[\u0900-\u097F]/.test(query)) return 'mr'; // Marathi (same script as Hindi)
    return 'en';
}

function findIntent(query: string): IntentPattern | null {
    const normalizedQuery = query.toLowerCase();
    
    let bestMatch: { intent: IntentPattern; matchCount: number } | null = null;
    
    for (const intent of intents) {
        const matchCount = intent.keywords.filter(kw => normalizedQuery.includes(kw)).length;
        if (matchCount > 0 && (!bestMatch || matchCount > bestMatch.matchCount)) {
            bestMatch = { intent, matchCount };
        }
    }
    
    return bestMatch?.intent ?? null;
}

export function processChat(input: ChatInput): ChatResponse {
    const query = input.query.trim();
    const language = input.language ?? detectLanguage(query);
    
    // Handle greetings
    const normalizedQuery = query.toLowerCase();
    if (greetings.some(g => normalizedQuery.includes(g))) {
        return {
            query,
            response: `🙏 **Jai Kisan! Welcome to KrishiAI**

I'm your intelligent farming assistant. I can help you with:

🌱 **Crop Recommendations** — best crops for your soil and weather
🦠 **Disease Detection** — identify and treat crop diseases  
💹 **Market Prices** — current mandi rates and price forecasts
🧪 **Fertilizer Guidance** — nutrient management for better yields
🌤️ **Weather Advice** — irrigation and climate-based farming tips
🏛️ **Government Schemes** — subsidies, loans, and support programs

**Ask me anything!** For example:
- "Which crop should I grow in Punjab in October?"
- "My wheat leaves are turning yellow — what's wrong?"
- "What is the price of cotton in Gujarat today?"`,
            intent: 'greeting',
            language,
            suggestedActions: ['Get crop recommendations', 'Check mandi prices', 'Detect plant disease', 'Find government schemes'],
            relatedTopics: ['Crop Calendar', 'Soil Testing', 'Market Information'],
        };
    }
    
    const matchedIntent = findIntent(query);
    
    if (matchedIntent) {
        return {
            query,
            response: matchedIntent.response(query),
            intent: matchedIntent.intent,
            language,
            suggestedActions: matchedIntent.suggestions,
            relatedTopics: matchedIntent.relatedTopics,
        };
    }
    
    // Default response
    return {
        query,
        response: `🤔 I didn't fully understand your question. Let me help with common farming topics:

**Try asking about**:
- 🌱 "What crop should I grow?" (Crop Recommendations)
- 🦠 "My crop has spots/yellowing" (Disease Detection)
- 💹 "What is wheat price today?" (Market Prices)
- 🧪 "How much urea for 1 acre?" (Fertilizer Guidance)
- 🌤️ "When to irrigate rice?" (Weather & Irrigation)
- 🏛️ "PM Kisan scheme details?" (Government Schemes)

Or use the specific tools in the navigation menu for detailed analysis.`,
        intent: 'unknown',
        language,
        suggestedActions: ['Crop Recommendations', 'Disease Detection', 'Market Prices', 'Fertilizer Guide'],
        relatedTopics: ['Farming Basics', 'Soil Health', 'Weather Forecasting'],
    };
}

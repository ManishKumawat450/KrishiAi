// nlpService.ts — Real NLP processing using the `natural` library
//
// Features:
//  • Word tokenisation (Natural.WordTokenizer)
//  • Porter stemming for English tokens
//  • TF-IDF intent classification with cosine similarity
//  • Entity extraction: crop name, symptom, price query, location
//  • Language detection (English / Hindi / Punjabi / Tamil / Telugu)
//  • Multi-language support for Devanagari farming terms

import natural from 'natural';

const WordTokenizer = natural.WordTokenizer;
const PorterStemmer = natural.PorterStemmer;
const TfIdf = natural.TfIdf;

// ── Supported intents ─────────────────────────────────────────────────────────
export type Intent =
    | 'crop_recommendation'
    | 'disease_detection'
    | 'price_prediction'
    | 'fertilizer_guidance'
    | 'weather_farming'
    | 'government_schemes'
    | 'organic_farming'
    | 'irrigation'
    | 'greeting'
    | 'unknown';

// ── Training corpus per intent ─────────────────────────────────────────────────
const INTENT_CORPUS: Record<Intent, string[]> = {
    crop_recommendation: [
        'which crop should i grow', 'best crop for my soil', 'what to plant', 'crop suggestion',
        'suitable crop for my land', 'which vegetable', 'which grain', 'seasonal crop advice',
        'fasal konsi booni chahiye', 'faslen', 'konsi fasal', 'fasal ki salah',
    ],
    disease_detection: [
        'my plant has disease', 'yellow leaves', 'brown spots', 'leaf rust', 'wilting',
        'white powder on leaves', 'fungal infection', 'pest attack', 'crop disease',
        'blight', 'mildew', 'spots on leaves', 'leaves turning yellow',
        'bimari', 'rog', 'keeda', 'patta peela', 'dhaba', 'sukhana',
    ],
    price_prediction: [
        'what is the price', 'mandi rate', 'market price', 'crop price today', 'wheat price',
        'rice price', 'price forecast', 'selling price', 'msp', 'minimum support price',
        'bhav', 'mandi bhav', 'keemat', 'dam', 'bazar bhav',
    ],
    fertilizer_guidance: [
        'how much fertilizer', 'urea dose', 'dap recommendation', 'npk ratio', 'manure',
        'soil nutrient', 'nitrogen deficiency', 'phosphorus', 'potassium', 'khad',
        'urvarak', 'urea kitna', 'khad kitni daalen', 'mitti ki jaanch',
    ],
    weather_farming: [
        'weather forecast', 'rain prediction', 'temperature today', 'humidity',
        'when to irrigate', 'monsoon', 'irrigation schedule', 'drought',
        'mausam', 'barish', 'temp', 'kal ka mausam', 'sinchai kab karein',
    ],
    government_schemes: [
        'government scheme', 'pm kisan', 'subsidy', 'kisan credit card', 'crop insurance',
        'pradhan mantri', 'kcc', 'fasal bima', 'government yojana', 'loan',
        'sarkar yojana', 'bima', 'anudan', 'mudra loan',
    ],
    organic_farming: [
        'organic farming', 'organic fertilizer', 'pesticide free', 'natural farming',
        'vermicompost', 'neem spray', 'cow dung', 'bio pesticide', 'jeevamrit',
        'jaivik kheti', 'prakritik kheti', 'neem', 'gobar khad',
    ],
    irrigation: [
        'drip irrigation', 'sprinkler', 'water management', 'irrigation timing',
        'when to water', 'flood irrigation', 'water requirement', 'sinchai',
        'tapak sinchai', 'pani', 'fasal ko pani', 'sechni',
    ],
    greeting: [
        'hello', 'hi', 'namaste', 'good morning', 'help me', 'what can you do',
        'namaskar', 'sat sri akal', 'vanakkam',
    ],
    unknown: [],
};

// ── Crop entity list ──────────────────────────────────────────────────────────
const CROP_ENTITIES: Record<string, string> = {
    wheat: 'Wheat', gehu: 'Wheat', gehun: 'Wheat',
    rice: 'Rice', paddy: 'Rice', dhan: 'Rice', chawal: 'Rice',
    maize: 'Maize', corn: 'Maize', makka: 'Maize', makki: 'Maize',
    cotton: 'Cotton', kapas: 'Cotton',
    sugarcane: 'Sugarcane', ganna: 'Sugarcane',
    chickpea: 'Chickpea', chana: 'Chickpea', gram: 'Chickpea',
    mustard: 'Mustard', sarson: 'Mustard', sarsoon: 'Mustard',
    soybean: 'Soybean', soya: 'Soybean', soyabin: 'Soybean',
    tomato: 'Tomato', tamatar: 'Tomato',
    groundnut: 'Groundnut', peanut: 'Groundnut', mungfali: 'Groundnut',
    onion: 'Onion', pyaz: 'Onion', pyaaj: 'Onion',
    potato: 'Potato', aloo: 'Potato', aalu: 'Potato',
    turmeric: 'Turmeric', haldi: 'Turmeric',
};

// ── Symptom entity list ───────────────────────────────────────────────────────
const SYMPTOM_ENTITIES: string[] = [
    'yellow leaves', 'yellowing', 'brown spots', 'wilting', 'stunted growth',
    'white powder', 'rust', 'blight', 'leaf curl', 'spots', 'lesions',
    'drooping', 'rotting', 'mold', 'mildew', 'mosaic', 'necrosis',
    'peela', 'jhulsa', 'sukhna', 'dhabbe', 'safed powder',
];

// ── Public interfaces ─────────────────────────────────────────────────────────
export interface NLPResult {
    intent: Intent;
    confidence: number;    // 0–1
    entities: {
        crop?: string;
        symptom?: string;
        location?: string;
        priceCrop?: string;
    };
    language: 'en' | 'hi' | 'pa' | 'ta' | 'te' | 'unknown';
    tokens: string[];
    stems: string[];
}

// ── Internal TF-IDF index ─────────────────────────────────────────────────────
function buildTfIdf(): typeof TfIdf.prototype {
    const tfidf = new TfIdf();
    for (const [, phrases] of Object.entries(INTENT_CORPUS)) {
        // Each intent gets one combined document
        tfidf.addDocument(phrases.join(' '));
    }
    return tfidf;
}

const tfidf = buildTfIdf();
const intentKeys = Object.keys(INTENT_CORPUS) as Intent[];

// ── Language detection (heuristic) ───────────────────────────────────────────
function detectLanguage(text: string): NLPResult['language'] {
    // Devanagari Unicode block: U+0900–U+097F
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    // Gurmukhi (Punjabi): U+0A00–U+0A7F
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa';
    // Tamil: U+0B80–U+0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
    // Telugu: U+0C00–U+0C7F
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    return 'en';
}

// ── Cosine similarity helper ──────────────────────────────────────────────────
function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
    let dot = 0, normA = 0, normB = 0;
    for (const [term, w] of a) { dot += w * (b.get(term) ?? 0); normA += w * w; }
    for (const w of b.values()) normB += w * w;
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── Build TF-IDF vector for a string ────────────────────────────────────────
function vectorise(text: string): Map<string, number> {
    const vec = new Map<string, number>();
    tfidf.tfidfs(text, (i: number, measure: number) => {
        vec.set(intentKeys[i], measure);
    });
    return vec;
}

// ── NlpService class ──────────────────────────────────────────────────────────
export class NlpService {
    private readonly tokenizer = new WordTokenizer();

    /** Tokenise, stem and classify a farming query. */
    processQuery(query: string, languageHint?: string): string[] {
        const lang = (languageHint as NLPResult['language']) ?? detectLanguage(query);
        if (lang === 'hi' || lang === 'pa' || lang === 'ta' || lang === 'te') {
            return query.split(/\s+/).filter(t => t.length > 0);
        }
        return this.tokenizer.tokenize(query.toLowerCase()) ?? [];
    }

    /** Full NLP analysis: intent + entities + language. */
    analyse(query: string, languageHint?: string): NLPResult {
        const language = (languageHint as NLPResult['language']) ?? detectLanguage(query);
        const tokens = this.processQuery(query, language);
        const stems = tokens.map(t => PorterStemmer.stem(t));

        const intent = this.classifyIntent(query, tokens);
        const entities = this.extractEntities(query.toLowerCase(), tokens);

        return { intent: intent.label, confidence: intent.confidence, entities, language, tokens, stems };
    }

    /** Classify intent via keyword matching + TF-IDF cosine similarity. */
    private classifyIntent(query: string, tokens: string[]): { label: Intent; confidence: number } {
        const lower = query.toLowerCase();

        // 1. Fast keyword lookup
        for (const [intent, phrases] of Object.entries(INTENT_CORPUS) as [Intent, string[]][]) {
            if (intent === 'unknown') continue;
            for (const phrase of phrases) {
                if (lower.includes(phrase)) {
                    return { label: intent, confidence: 0.92 };
                }
            }
        }

        // 2. TF-IDF cosine similarity
        const queryVec = vectorise(lower);
        let bestLabel: Intent = 'unknown';
        let bestScore = 0;

        for (const [intentKey, phrases] of Object.entries(INTENT_CORPUS) as [Intent, string[]][]) {
            if (intentKey === 'unknown' || phrases.length === 0) continue;
            const corpusVec = vectorise(phrases.join(' '));
            const score = cosineSimilarity(queryVec, corpusVec);
            if (score > bestScore) { bestScore = score; bestLabel = intentKey; }
        }

        // 3. Stemmed token matching fallback
        if (bestScore < 0.15) {
            const stemQuery = new Set(tokens.map(t => PorterStemmer.stem(t)));
            for (const [intentKey, phrases] of Object.entries(INTENT_CORPUS) as [Intent, string[]][]) {
                if (intentKey === 'unknown') continue;
                const corpusStems = new Set(
                    phrases.flatMap(p => p.split(' ')).map(w => PorterStemmer.stem(w))
                );
                let overlap = 0;
                for (const s of stemQuery) { if (corpusStems.has(s)) overlap++; }
                const stemScore = overlap / (stemQuery.size + 1);
                if (stemScore > bestScore) { bestScore = stemScore; bestLabel = intentKey; }
            }
        }

        if (bestScore < 0.05) return { label: 'unknown', confidence: 0 };
        return { label: bestLabel, confidence: Math.min(0.95, bestScore) };
    }

    /** Extract named entities from the query. */
    private extractEntities(lower: string, tokens: string[]): NLPResult['entities'] {
        const entities: NLPResult['entities'] = {};

        // Crop entity
        for (const [keyword, cropName] of Object.entries(CROP_ENTITIES)) {
            if (lower.includes(keyword) || tokens.includes(keyword)) {
                entities.crop = cropName;
                entities.priceCrop = cropName.toLowerCase();
                break;
            }
        }

        // Symptom entity
        for (const symptom of SYMPTOM_ENTITIES) {
            if (lower.includes(symptom)) {
                entities.symptom = symptom;
                break;
            }
        }

        // Location: look for "in <location>" or "at <location>"
        const locationMatch = lower.match(/\b(?:in|at|near|from)\s+([a-z]{3,})/);
        if (locationMatch) {
            const loc = locationMatch[1];
            // Exclude common words
            const skip = new Set(['the', 'my', 'our', 'its', 'your', 'this', 'that', 'farm']);
            if (!skip.has(loc)) entities.location = loc;
        }

        return entities;
    }
}

export default NlpService;

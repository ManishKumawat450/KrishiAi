// mlModelService.ts — TensorFlow.js CNN plant disease detection
//
// Uses the PlantVillage dataset class labels (38 plant diseases across 15 crop types).
// On first call the service tries to load a TF.js model from `MODEL_PATH`.
// If the model file is absent (the common case during development / CI) it
// falls back to the image-feature-based heuristic classifier so the rest of
// the application never breaks.

import * as tf from '@tensorflow/tfjs';
import path from 'path';
import fs from 'fs';
import { preprocessImage, extractImageFeatures } from '../utils/imageProcessor';

// ── PlantVillage 38-class label map ──────────────────────────────────────────
const PLANT_VILLAGE_LABELS: Record<number, { disease: string; hindiName: string; crop: string }> = {
    0:  { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Apple'       },
    1:  { disease: 'Apple Scab',                 hindiName: 'सेब का स्कैब',       crop: 'Apple'       },
    2:  { disease: 'Black Rot',                  hindiName: 'काला सड़ांध',         crop: 'Apple'       },
    3:  { disease: 'Cedar Apple Rust',           hindiName: 'देवदार सेब रतुआ',    crop: 'Apple'       },
    4:  { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Blueberry'   },
    5:  { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Cherry'      },
    6:  { disease: 'Powdery Mildew',             hindiName: 'चूर्णिल फफूंदी',    crop: 'Cherry'      },
    7:  { disease: 'Gray Leaf Spot',             hindiName: 'धूसर पत्ती धब्बा',  crop: 'Corn'        },
    8:  { disease: 'Common Rust',                hindiName: 'सामान्य रतुआ',       crop: 'Corn'        },
    9:  { disease: 'Northern Leaf Blight',       hindiName: 'उत्तरी पत्ती झुलसा', crop: 'Corn'       },
    10: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Corn'        },
    11: { disease: 'Black Rot',                  hindiName: 'काला सड़ांध',         crop: 'Grape'       },
    12: { disease: 'Black Measles',              hindiName: 'काला खसरा',          crop: 'Grape'       },
    13: { disease: 'Leaf Blight',                hindiName: 'पत्ती झुलसा',        crop: 'Grape'       },
    14: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Grape'       },
    15: { disease: 'Citrus Greening',            hindiName: 'साइट्रस ग्रीनिंग',  crop: 'Orange'      },
    16: { disease: 'Bacterial Spot',             hindiName: 'जीवाणु धब्बा',       crop: 'Peach'       },
    17: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Peach'       },
    18: { disease: 'Bacterial Spot',             hindiName: 'जीवाणु धब्बा',       crop: 'Pepper'      },
    19: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Pepper'      },
    20: { disease: 'Early Blight',               hindiName: 'आगेती झुलसा',        crop: 'Potato'      },
    21: { disease: 'Late Blight',                hindiName: 'पिछेती झुलसा',       crop: 'Potato'      },
    22: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Potato'      },
    23: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Raspberry'   },
    24: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Soybean'     },
    25: { disease: 'Powdery Mildew',             hindiName: 'चूर्णिल फफूंदी',    crop: 'Squash'      },
    26: { disease: 'Leaf Scorch',                hindiName: 'पत्ती झुलसन',        crop: 'Strawberry'  },
    27: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Strawberry'  },
    28: { disease: 'Bacterial Spot',             hindiName: 'जीवाणु धब्बा',       crop: 'Tomato'      },
    29: { disease: 'Early Blight',               hindiName: 'आगेती झुलसा',        crop: 'Tomato'      },
    30: { disease: 'Late Blight',                hindiName: 'पिछेती झुलसा',       crop: 'Tomato'      },
    31: { disease: 'Leaf Mold',                  hindiName: 'पत्ती फफूंद',        crop: 'Tomato'      },
    32: { disease: 'Septoria Leaf Spot',         hindiName: 'सेप्टोरिया पत्ती धब्बा', crop: 'Tomato' },
    33: { disease: 'Spider Mites',               hindiName: 'मकड़ी के घुन',        crop: 'Tomato'      },
    34: { disease: 'Target Spot',                hindiName: 'लक्ष्य धब्बा',        crop: 'Tomato'      },
    35: { disease: 'Yellow Leaf Curl Virus',     hindiName: 'पीला पत्ती कर्ल वायरस', crop: 'Tomato'  },
    36: { disease: 'Mosaic Virus',               hindiName: 'मोज़ेक वायरस',        crop: 'Tomato'      },
    37: { disease: 'Healthy',                    hindiName: 'स्वस्थ',             crop: 'Tomato'      },
};

// ── Treatment & severity database ─────────────────────────────────────────────
const DISEASE_TREATMENTS: Record<string, { severity: string; treatment: string[]; prevention: string[]; organicAlternative: string; estimatedYieldLoss: string }> = {
    'Apple Scab':           { severity: 'Medium', treatment: ['Apply captan @ 0.2% or mancozeb 0.25%', 'Remove fallen leaves', 'Prune for air circulation'], prevention: ['Use resistant varieties', 'Avoid wetting foliage'], organicAlternative: 'Sulfur spray 0.3%', estimatedYieldLoss: '10–30%' },
    'Black Rot':            { severity: 'High',   treatment: ['Bordeaux mixture 1%', 'Remove mummified fruits', 'Copper-based fungicide'], prevention: ['Prune infected wood', 'Sanitation'], organicAlternative: 'Neem oil 3% spray', estimatedYieldLoss: '20–50%' },
    'Cedar Apple Rust':     { severity: 'Medium', treatment: ['Myclobutanil 1.5ml/L at bud break', 'Remove galls from cedar trees'], prevention: ['Plant resistant varieties'], organicAlternative: 'Sulfur dust 2.5g/L', estimatedYieldLoss: '5–15%' },
    'Powdery Mildew':       { severity: 'Medium', treatment: ['Wettable sulfur @ 3g/L', 'Hexaconazole 5% EC @ 2ml/L', 'Propiconazole 25% EC @ 1ml/L'], prevention: ['Good air circulation', 'Avoid overhead irrigation', 'Plant resistant varieties'], organicAlternative: 'Baking soda 1 tsp/L water weekly', estimatedYieldLoss: '10–30%' },
    'Gray Leaf Spot':       { severity: 'High',   treatment: ['Azoxystrobin 23% SC @ 1ml/L', 'Propiconazole @ 1ml/L', 'Trifloxystrobin 25% + Propiconazole 12.5%'], prevention: ['Crop rotation', 'Resistant hybrids', 'Reduce humidity'], organicAlternative: 'Copper oxychloride 3g/L', estimatedYieldLoss: '15–40%' },
    'Common Rust':          { severity: 'Medium', treatment: ['Mancozeb 75% WP @ 2.5g/L', 'Propiconazole 25% EC @ 1ml/L'], prevention: ['Resistant varieties', 'Early sowing'], organicAlternative: 'Neem oil 5ml/L', estimatedYieldLoss: '10–20%' },
    'Northern Leaf Blight': { severity: 'High',   treatment: ['Mancozeb @ 2.5g/L', 'Propiconazole 1ml/L', 'Azoxystrobin 1ml/L'], prevention: ['Crop rotation', 'Remove infected debris'], organicAlternative: 'Compost tea spray', estimatedYieldLoss: '20–40%' },
    'Bacterial Spot':       { severity: 'High',   treatment: ['Copper hydroxide 0.3%', 'Bactericide spray at 7-day intervals', 'Streptomycin 0.5g/L'], prevention: ['Certified disease-free seed', 'Avoid overhead irrigation'], organicAlternative: 'Garlic extract 5% + copper soap', estimatedYieldLoss: '20–50%' },
    'Early Blight':         { severity: 'Medium', treatment: ['Mancozeb @ 2.5g/L', 'Chlorothalonil 75% WP @ 2g/L', 'Azoxystrobin 1ml/L'], prevention: ['Proper spacing', 'Mulching', 'Drip irrigation'], organicAlternative: 'Copper-based spray 3g/L', estimatedYieldLoss: '15–25%' },
    'Late Blight':          { severity: 'Critical', treatment: ['Metalaxyl 8% + Mancozeb 64% @ 2.5g/L', 'Dimethomorph 50% WP @ 1g/L', 'Cymoxanil + Mancozeb @ 2g/L'], prevention: ['Plant certified seed', 'Avoid wet foliage', 'Spray preventively in cool humid weather'], organicAlternative: 'Bordeaux mixture 1% weekly', estimatedYieldLoss: '40–80%' },
    'Leaf Mold':            { severity: 'Medium', treatment: ['Chlorothalonil 1.5g/L', 'Copper fungicide 3g/L', 'Improve air circulation'], prevention: ['Reduce humidity below 85%', 'Prune lower leaves'], organicAlternative: 'Neem oil 3ml/L + copper soap', estimatedYieldLoss: '10–20%' },
    'Septoria Leaf Spot':   { severity: 'Medium', treatment: ['Mancozeb 2.5g/L', 'Chlorothalonil 2g/L', 'Azoxystrobin 1ml/L'], prevention: ['Remove infected lower leaves', 'Crop rotation', 'Mulching'], organicAlternative: 'Copper hydroxide 0.2%', estimatedYieldLoss: '10–25%' },
    'Spider Mites':         { severity: 'Medium', treatment: ['Abamectin 1.8% EC @ 0.5ml/L', 'Spiromesifen 22.9% SC @ 1ml/L', 'Miticide rotation to prevent resistance'], prevention: ['Increase humidity', 'Introduce predatory mites', 'Avoid excessive nitrogen'], organicAlternative: 'Neem oil 5ml/L + soap 2ml/L', estimatedYieldLoss: '5–20%' },
    'Target Spot':          { severity: 'Medium', treatment: ['Azoxystrobin 1ml/L', 'Difenoconazole 1ml/L'], prevention: ['Crop rotation', 'Proper spacing'], organicAlternative: 'Copper oxychloride 3g/L', estimatedYieldLoss: '10–20%' },
    'Yellow Leaf Curl Virus': { severity: 'Critical', treatment: ['Control whitefly vector with imidacloprid 0.5ml/L', 'Remove infected plants immediately', 'Thiamethoxam 0.3g/L'], prevention: ['Resistant varieties', 'Reflective mulch to repel whiteflies', 'Use insect nets'], organicAlternative: 'Neem oil + yellow sticky traps', estimatedYieldLoss: '50–100%' },
    'Mosaic Virus':         { severity: 'High',   treatment: ['No direct cure — remove infected plants', 'Control aphid vectors with imidacloprid', 'Roguing of infected plants'], prevention: ['Certified virus-free seed', 'Aphid control', 'Weed management'], organicAlternative: 'Neem seed kernel extract 5%', estimatedYieldLoss: '30–70%' },
    'Leaf Blight':          { severity: 'High',   treatment: ['Mancozeb 2.5g/L', 'Copper oxychloride 3g/L', 'Propiconazole 1ml/L'], prevention: ['Field sanitation', 'Remove infected leaves', 'Avoid excess irrigation'], organicAlternative: 'Bordeaux mixture 1%', estimatedYieldLoss: '20–40%' },
    'Leaf Scorch':          { severity: 'Medium', treatment: ['Myclobutanil 1ml/L', 'Copper hydroxide 0.3%'], prevention: ['Proper spacing', 'Mulching', 'Avoid water stress'], organicAlternative: 'Neem oil 3ml/L', estimatedYieldLoss: '10–25%' },
    'Black Measles':        { severity: 'High',   treatment: ['Dormant lime-sulfur spray', 'Copper-based fungicide pre-season'], prevention: ['Prune infected canes', 'Remove desiccated berries'], organicAlternative: 'Bordeaux mixture 1%', estimatedYieldLoss: '20–40%' },
    'Citrus Greening':      { severity: 'Critical', treatment: ['No cure — remove infected trees', 'Control psyllid vector with insecticides', 'Oxytetracycline injection for temporary suppression'], prevention: ['Use certified disease-free nursery stock', 'Psyllid monitoring'], organicAlternative: 'Botanical insecticide for psyllid control', estimatedYieldLoss: '100%' },
    'Healthy':              { severity: 'None',   treatment: ['No treatment needed — plant appears healthy'], prevention: ['Maintain regular monitoring', 'Keep field clean'], organicAlternative: 'Continue organic practices', estimatedYieldLoss: '0%' },
};

const DEFAULT_TREATMENT = {
    severity: 'Unknown',
    treatment: ['Consult a local agricultural extension officer'],
    prevention: ['Regular monitoring of crops'],
    organicAlternative: 'Neem oil as general plant protector',
    estimatedYieldLoss: 'Unknown',
};

// ── Model cache ───────────────────────────────────────────────────────────────
let cachedModel: tf.LayersModel | null = null;
let modelLoadAttempted = false;

// ── Main service class ─────────────────────────────────────────────────────────
export interface MLPredictionResult {
    disease: string;
    hindiName: string;
    confidence: number;    // 0–1
    severity: string;
    crop: string;
    treatment: string[];
    prevention: string[];
    organicAlternative: string;
    estimatedYieldLoss: string;
    modelUsed: 'cnn' | 'heuristic';
    allPredictions?: Array<{ label: string; confidence: number }>;
}

export class MLModelService {
    private readonly modelPath: string;

    constructor(modelPath?: string) {
        // By default look in public/models relative to project root
        this.modelPath =
            modelPath ??
            path.join(process.cwd(), 'public', 'models', 'plant-disease-model', 'model.json');
    }

    /** Attempt to load the TF.js model; returns null if unavailable. */
    private async loadModel(): Promise<tf.LayersModel | null> {
        if (cachedModel) return cachedModel;
        if (modelLoadAttempted) return null;

        modelLoadAttempted = true;

        if (!fs.existsSync(this.modelPath)) {
            console.info(
                `[MLModelService] Model file not found at ${this.modelPath}. ` +
                'Using heuristic fallback. Download a TF.js PlantVillage model to enable CNN inference.'
            );
            return null;
        }

        try {
            console.info('[MLModelService] Loading TF.js model from', this.modelPath);
            const fileUrl = `file://${this.modelPath}`;
            cachedModel = await tf.loadLayersModel(fileUrl);
            console.info('[MLModelService] Model loaded successfully');
            return cachedModel;
        } catch (err) {
            console.error('[MLModelService] Failed to load model:', err);
            return null;
        }
    }

    /** Run CNN inference on an image buffer. */
    private async runCNNInference(imageBuffer: Buffer): Promise<MLPredictionResult> {
        const model = await this.loadModel();
        if (!model) throw new Error('Model not available');

        const processed = await preprocessImage(imageBuffer, 224);

        // Build a [1, 224, 224, 3] tensor
        const inputTensor = tf.tensor4d(processed.pixels, [1, 224, 224, 3]);

        let predictions: Float32Array;
        try {
            const output = model.predict(inputTensor) as tf.Tensor;
            predictions = await output.data() as Float32Array;
            output.dispose();
        } finally {
            inputTensor.dispose();
        }

        // Get top-1 class index
        let topIdx = 0;
        let topConf = predictions[0];
        for (let i = 1; i < predictions.length; i++) {
            if (predictions[i] > topConf) { topConf = predictions[i]; topIdx = i; }
        }

        // Build sorted top-5
        const indexed = Array.from(predictions).map((c, i) => ({ idx: i, conf: c }));
        indexed.sort((a, b) => b.conf - a.conf);
        const top5 = indexed.slice(0, 5).map(item => ({
            label: PLANT_VILLAGE_LABELS[item.idx]?.disease ?? `Class ${item.idx}`,
            confidence: Math.round(item.conf * 1000) / 1000,
        }));

        const label = PLANT_VILLAGE_LABELS[topIdx] ?? { disease: 'Unknown', hindiName: 'अज्ञात', crop: 'Unknown' };
        const treatment = DISEASE_TREATMENTS[label.disease] ?? DEFAULT_TREATMENT;

        return {
            disease: label.disease,
            hindiName: label.hindiName,
            confidence: Math.round(topConf * 1000) / 1000,
            severity: treatment.severity,
            crop: label.crop,
            treatment: treatment.treatment,
            prevention: treatment.prevention,
            organicAlternative: treatment.organicAlternative,
            estimatedYieldLoss: treatment.estimatedYieldLoss,
            modelUsed: 'cnn',
            allPredictions: top5,
        };
    }

    /**
     * Heuristic image-feature-based disease classification.
     * Used when no trained model file is present.
     * This provides meaningful results based on colour analysis rather than
     * just returning a constant placeholder value.
     */
    private async runHeuristicInference(imageBuffer: Buffer, hintCropType?: string): Promise<MLPredictionResult> {
        const features = await extractImageFeatures(imageBuffer);

        // Score each disease candidate based on visual features
        type Candidate = { classIdx: number; score: number };
        const candidates: Candidate[] = [];

        // Powdery Mildew → white coating
        if (features.whiteCoatingScore > 0.15) {
            candidates.push({ classIdx: 6, score: features.whiteCoatingScore * 0.9 + 0.5 });
        }

        // Late/Early Blight (Tomato, Potato) → brown spots
        if (features.brownScore > 0.25) {
            candidates.push({ classIdx: 30, score: features.brownScore * 0.85 + 0.4 }); // Late Blight
            candidates.push({ classIdx: 29, score: features.brownScore * 0.70 + 0.35 }); // Early Blight
        }

        // Yellow leaf curl / yellowing → high yellow score
        if (features.yellowScore > 0.3) {
            candidates.push({ classIdx: 35, score: features.yellowScore * 0.8 + 0.4 }); // Yellow Leaf Curl
            candidates.push({ classIdx: 8,  score: features.yellowScore * 0.6 + 0.3 }); // Common Rust
        }

        // Dark spots on relatively green leaf → Septoria or Gray Leaf Spot
        if (features.greenRatio > 0.35 && features.darkSpotScore > 0.05) {
            candidates.push({ classIdx: 32, score: features.darkSpotScore * 2 + 0.4 }); // Septoria
            candidates.push({ classIdx: 7,  score: features.darkSpotScore * 1.5 + 0.35 }); // Gray Leaf Spot
        }

        // Very healthy-looking green leaf
        if (features.greenRatio > 0.40 && features.brightness > 0.35 && candidates.length === 0) {
            candidates.push({ classIdx: 37, score: 0.70 }); // Healthy (Tomato)
        }

        // Default fallback — Bacterial Spot (class 28, common & generic)
        const FALLBACK_CLASS_IDX = 28;   // PlantVillage label: Tomato Bacterial Spot
        const FALLBACK_BASE_SCORE = 0.55; // Moderate default confidence for the fallback
        if (candidates.length === 0) {
            candidates.push({ classIdx: FALLBACK_CLASS_IDX, score: FALLBACK_BASE_SCORE });
        }

        // Normalise scores to [0, 1]
        const maxScore = Math.max(...candidates.map(c => c.score));
        const normalisedCandidates = candidates.map(c => ({ ...c, conf: Math.min(0.95, c.score / maxScore) }));
        normalisedCandidates.sort((a, b) => b.conf - a.conf);

        const best = normalisedCandidates[0];
        const label = PLANT_VILLAGE_LABELS[best.classIdx] ?? { disease: 'Bacterial Spot', hindiName: 'जीवाणु धब्बा', crop: hintCropType ?? 'Crop' };
        const treatment = DISEASE_TREATMENTS[label.disease] ?? DEFAULT_TREATMENT;

        // Apply a confidence penalty when heuristic is used (max 0.85)
        const confidence = Math.round(Math.min(0.85, best.conf) * 1000) / 1000;

        const top5 = normalisedCandidates.slice(0, 5).map(c => ({
            label: PLANT_VILLAGE_LABELS[c.classIdx]?.disease ?? `Class ${c.classIdx}`,
            confidence: Math.round(Math.min(0.85, c.conf) * 1000) / 1000,
        }));

        return {
            disease: label.disease,
            hindiName: label.hindiName,
            confidence,
            severity: treatment.severity,
            crop: hintCropType ?? label.crop,
            treatment: treatment.treatment,
            prevention: treatment.prevention,
            organicAlternative: treatment.organicAlternative,
            estimatedYieldLoss: treatment.estimatedYieldLoss,
            modelUsed: 'heuristic',
            allPredictions: top5,
        };
    }

    /**
     * Predict disease from an image buffer.
     * Tries CNN inference first; falls back to heuristic analysis on error.
     */
    async predictDisease(imageBuffer: Buffer, hintCropType?: string): Promise<MLPredictionResult> {
        // First try TF.js CNN
        try {
            return await this.runCNNInference(imageBuffer);
        } catch {
            // Fallback to heuristic
        }
        return this.runHeuristicInference(imageBuffer, hintCropType);
    }
}

export default MLModelService;

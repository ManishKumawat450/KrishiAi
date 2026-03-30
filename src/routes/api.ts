import express, { Request, Response, Router } from 'express';
import multer from 'multer';
import { fetchWeatherData, fetchWeatherByLatLon } from '../services/weatherService';
import { recommendCrops } from '../services/cropRecommendationService';
import { detectDisease } from '../services/diseaseDetectionService';
import { predictPrice, getAvailableCrops } from '../services/priceService';
import { recommendFertilizer } from '../services/fertilizerService';
import { processChat } from '../services/chatService';
import { MLModelService } from '../services/mlModelService';
import { NlpService } from '../services/nlpService';

// Multer: store uploaded images in memory (no disk writes needed for symptom-based detection)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed (PNG, JPG, JPEG, WEBP)'));
        }
    },
});

const router: Router = express.Router();

// Shared service instances (module-level singletons)
const mlModelService = new MLModelService();
const nlpService = new NlpService();

/**
 * Health Check Endpoint
 * GET /api/health
 */
router.get('/health', (_req: Request, res: Response) => {
    return res.status(200).json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        service: 'KrishiAI Backend',
        version: '2.0.0',
        features: ['weather', 'crop-recommendation', 'disease-detection', 'price-prediction', 'fertilizer', 'chat'],
    });
});

/**
 * Crop Recommendations Endpoint
 * POST /api/crops/recommend
 */
router.post('/crops/recommend', (req: Request, res: Response) => {
    try {
        const { temperature, rainfall, phLevel, humidity, soilType, nitrogen } = req.body;

        if (temperature === undefined || rainfall === undefined || phLevel === undefined) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['temperature', 'rainfall', 'phLevel'],
                optional: ['humidity', 'soilType', 'nitrogen'],
            });
        }

        const tempNum = parseFloat(temperature);
        const rainfallNum = parseFloat(rainfall);
        const phNum = parseFloat(phLevel);

        if (isNaN(tempNum) || isNaN(rainfallNum) || isNaN(phNum)) {
            return res.status(400).json({ error: 'temperature, rainfall, and phLevel must be valid numbers' });
        }

        const results = recommendCrops({
            temperature: tempNum,
            rainfall: rainfallNum,
            phLevel: phNum,
            humidity: humidity !== undefined ? parseFloat(humidity) : undefined,
            soilType,
            nitrogen: nitrogen !== undefined ? parseFloat(nitrogen) : undefined,
        });

        // Build response in format the frontend expects
        const recommendations: Record<string, { name: string; suitability: number; season: string; reason: string; avgPrice: number; hindiName: string }> = {};
        results.forEach((crop, index) => {
            recommendations[`crop${index + 1}`] = {
                name: crop.name,
                hindiName: crop.hindiName,
                suitability: crop.suitability,
                season: crop.season,
                reason: crop.reason,
                avgPrice: crop.avgPrice,
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                recommendations,
                count: results.length,
                reason: `Based on temperature (${tempNum}°C), rainfall (${rainfallNum}mm), and soil pH (${phNum})`,
                inputSummary: { temperature: tempNum, rainfall: rainfallNum, phLevel: phNum, humidity, soilType },
            },
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing crop recommendations',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Disease Detection Endpoint
 * POST /api/disease/detect
 */
router.post('/disease/detect', (req: Request, res: Response) => {
    try {
        const { symptoms, cropType } = req.body;

        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({
                error: 'Invalid symptoms',
                message: 'Symptoms must be a non-empty array of strings',
            });
        }

        if (!cropType || typeof cropType !== 'string') {
            return res.status(400).json({ error: 'cropType must be a string' });
        }

        const result = detectDisease({ symptoms, cropType });

        if (!result) {
            return res.status(200).json({
                success: true,
                data: {
                    disease: 'Unknown',
                    confidence: 0,
                    message: 'No matching disease found for the given symptoms and crop. Try selecting more symptoms.',
                },
            });
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({
            error: 'Error detecting disease',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Disease Detection via Image Upload
 * POST /api/disease/detect-symptoms  (multipart/form-data)
 * Fields: image (file, optional), cropType (string), symptoms (JSON array string, optional)
 *
 * NOTE: Full computer-vision image analysis requires an external ML model (e.g. a plant-disease
 * classifier).  Until such a model is integrated, the endpoint accepts the image file (which is
 * stored in memory for future use), records its metadata, and runs the same symptom-based
 * detection engine as /disease/detect.  Callers can supply known symptoms alongside the image to
 * improve accuracy; if none are provided the engine uses generic broad-spectrum symptoms.
 */
router.post('/disease/detect-symptoms', upload.single('image'), (req: Request, res: Response) => {
    try {
        const { cropType, symptoms: symptomsRaw } = req.body;

        if (!cropType || typeof cropType !== 'string') {
            return res.status(400).json({ error: 'cropType must be provided as a form field' });
        }

        // Parse optional symptoms array provided alongside the image
        let symptoms: string[] = [];
        if (symptomsRaw) {
            try {
                const parsed = JSON.parse(symptomsRaw);
                if (Array.isArray(parsed)) symptoms = parsed.map(String);
            } catch {
                // If not JSON, treat as a comma-separated string
                symptoms = String(symptomsRaw).split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        // If no symptoms given, fall back to generic symptoms that yield a result
        if (symptoms.length === 0) {
            symptoms = ['Yellow leaves', 'Brown spots', 'Wilting'];
        }

        const result = detectDisease({ symptoms, cropType });

        const imageInfo = req.file
            ? { filename: req.file.originalname, size: req.file.size, mimetype: req.file.mimetype }
            : null;

        if (!result) {
            return res.status(200).json({
                success: true,
                imageReceived: Boolean(req.file),
                imageInfo,
                data: {
                    disease: 'Unknown',
                    confidence: 0,
                    message: 'No matching disease found. Try providing more symptoms or selecting a different crop.',
                },
            });
        }

        return res.status(200).json({
            success: true,
            imageReceived: Boolean(req.file),
            imageInfo,
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing image upload for disease detection',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * CNN Image-Based Disease Detection Endpoint
 * POST /api/disease/detect-image  (multipart/form-data)
 * Fields:
 *   - image (required): leaf/crop image file (JPEG, PNG, WEBP)
 *   - cropType (optional): hint for the heuristic fallback
 */
router.post('/disease/detect-image', upload.single('image'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided. Upload a leaf/crop image as form field "image".' });
        }

        const { cropType } = req.body;
        const result = await mlModelService.predictDisease(req.file.buffer, cropType ?? undefined);

        return res.status(200).json({
            success: true,
            imageReceived: true,
            imageInfo: {
                filename: req.file.originalname,
                size: req.file.size,
                mimetype: req.file.mimetype,
            },
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error running disease detection on uploaded image',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Price Prediction Endpoint
 * GET /api/prices/predict?crop=wheat&days=7
 */
router.get('/prices/predict', (req: Request, res: Response) => {
    try {
        const { crop, days } = req.query;

        if (!crop || typeof crop !== 'string') {
            return res.status(400).json({ error: 'Missing required parameter: crop' });
        }

        const daysAhead = days ? parseInt(String(days)) : 7;

        if (isNaN(daysAhead) || daysAhead < 1 || daysAhead > 30) {
            return res.status(400).json({ error: 'Days must be between 1 and 30' });
        }

        const result = predictPrice(crop, daysAhead);

        if (!result) {
            return res.status(404).json({
                error: 'Crop not found',
                message: `No price data for "${crop}". Available: ${getAvailableCrops().join(', ')}`,
            });
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({
            error: 'Error predicting price',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Fertilizer Recommendations Endpoint
 * POST /api/fertilizer/recommend
 */
router.post('/fertilizer/recommend', (req: Request, res: Response) => {
    try {
        const { cropType, nitrogen, phosphorus, potassium, areaInAcres, soilType } = req.body;

        if (!cropType || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['cropType', 'nitrogen', 'phosphorus', 'potassium'],
                optional: ['areaInAcres', 'soilType'],
            });
        }

        const nNum = parseFloat(nitrogen);
        const pNum = parseFloat(phosphorus);
        const kNum = parseFloat(potassium);

        if (isNaN(nNum) || isNaN(pNum) || isNaN(kNum)) {
            return res.status(400).json({ error: 'Nutrient levels must be valid numbers' });
        }

        const result = recommendFertilizer({
            cropType,
            nitrogen: nNum,
            phosphorus: pNum,
            potassium: kNum,
            areaInAcres: areaInAcres ? parseFloat(areaInAcres) : 1,
            soilType,
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({
            error: 'Error generating fertilizer recommendations',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Weather Data by Geolocation Endpoint (Open-Meteo, no API key required)
 * GET /api/weather/get-by-location?lat=28.6&lon=77.2
 */
router.get('/weather/get-by-location', async (req: Request, res: Response) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Missing required parameters: lat and lon' });
        }

        const latNum = parseFloat(String(lat));
        const lonNum = parseFloat(String(lon));

        if (isNaN(latNum) || isNaN(lonNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
            return res.status(400).json({ error: 'lat must be between -90 and 90, lon between -180 and 180' });
        }

        const weatherData = await fetchWeatherByLatLon(latNum, lonNum);
        return res.status(200).json({ success: true, data: weatherData });
    } catch (error) {
        return res.status(500).json({
            error: 'Error fetching weather data by location',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Weather Data Endpoint
 * GET /api/weather?city=delhi
 */
router.get('/weather', async (req: Request, res: Response) => {
    try {
        const { city } = req.query;

        if (!city || typeof city !== 'string' || city.trim().length === 0) {
            return res.status(400).json({ error: 'Missing required parameter: city' });
        }

        const weatherData = await fetchWeatherData(city.trim());
        return res.status(200).json({ success: true, data: weatherData });
    } catch (error) {
        return res.status(500).json({
            error: 'Error fetching weather data',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Chat / NLP Query Endpoint
 * POST /api/chat
 * Now enriched with real NLP: intent classification, entity extraction, language detection.
 */
router.post('/chat', (req: Request, res: Response) => {
    try {
        const { query, language } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: 'Query must be a non-empty string' });
        }

        const trimmedQuery = query.trim();

        // Run real NLP analysis on the query
        const nlpResult = nlpService.analyse(trimmedQuery, language);

        // Pass through to the chat service (which provides formatted responses)
        const chatResult = processChat({ query: trimmedQuery, language: nlpResult.language });

        // Augment the response with NLP metadata
        return res.status(200).json({
            success: true,
            data: {
                ...chatResult,
                nlp: {
                    intent: nlpResult.intent,
                    confidence: nlpResult.confidence,
                    entities: nlpResult.entities,
                    language: nlpResult.language,
                    tokens: nlpResult.tokens.slice(0, 20), // Limit for response size
                },
            },
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing chat query',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * NLP Query Endpoint (legacy alias)
 * POST /api/nlp/query
 */
router.post('/nlp/query', (req: Request, res: Response) => {
    try {
        const { query } = req.body;

        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({ error: 'Query must be a non-empty string' });
        }

        const result = processChat({ query: query.trim() });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing query',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

/**
 * Available Crops Endpoint
 * GET /api/crops/list
 */
router.get('/crops/list', (_req: Request, res: Response) => {
    const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Chickpea', 'Mustard', 'Soybean', 'Tomato', 'Groundnut', 'Turmeric', 'Onion'];
    return res.status(200).json({ success: true, data: { crops, count: crops.length } });
});

/**
 * Available Diseases Endpoint
 * GET /api/disease/list
 */
router.get('/disease/list', (_req: Request, res: Response) => {
    const diseases = ['Powdery Mildew', 'Bacterial Blight', 'Rust Disease', 'Leaf Blight', 'Fusarium Wilt', 'Downy Mildew', 'Blast Disease', 'Aphid Infestation'];
    return res.status(200).json({ success: true, data: { diseases, count: diseases.length } });
});

/**
 * API Documentation Endpoint
 * GET /api/docs
 */
router.get('/docs', (_req: Request, res: Response) => {
    const documentation = {
        title: 'KrishiAI API Documentation v2.0',
        version: '2.0.0',
        description: 'Intelligent Farming Guidance Platform — Real data & AI-powered recommendations',
        baseUrl: 'http://localhost:5001/api',
        endpoints: {
            weather: { method: 'GET', path: '/weather?city=delhi', description: 'Real weather data for any Indian city' },
            weatherByLocation: { method: 'GET', path: '/weather/get-by-location?lat=28.6&lon=77.2', description: 'Weather by GPS coordinates using free Open-Meteo API' },
            cropRecommendations: { method: 'POST', path: '/crops/recommend', description: 'AI crop recommendations based on soil & weather' },
            diseaseDetection: { method: 'POST', path: '/disease/detect', description: 'Symptom-based plant disease diagnosis' },
            diseaseDetectSymptoms: { method: 'POST', path: '/disease/detect-symptoms', description: 'Image upload + symptom disease detection (multipart/form-data)' },
            diseaseDetectImage: { method: 'POST', path: '/disease/detect-image', description: 'CNN + heuristic AI image-based disease detection (multipart/form-data, field: image)' },
            pricePrediction: { method: 'GET', path: '/prices/predict?crop=wheat&days=7', description: 'Mandi price forecast with trend analysis' },
            fertilizerRecommendations: { method: 'POST', path: '/fertilizer/recommend', description: 'Evidence-based NPK fertilizer guidance' },
            chat: { method: 'POST', path: '/chat', description: 'NLP-powered farmer support chatbot' },
            cropsList: { method: 'GET', path: '/crops/list', description: 'List of supported crops' },
            diseaseList: { method: 'GET', path: '/disease/list', description: 'List of detectable diseases' },
        },
    };
    return res.status(200).json(documentation);
});

// 404 Handler for undefined routes
router.use((req: Request, res: Response) => {
    return res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        hint: 'Visit /api/docs for API documentation',
    });
});

export default router;

import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

/**
 * Health Check Endpoint
 * GET /api/health
 */
router.get('/health', (_req: Request, res: Response) => {
    return res.status(200).json({
        status: 'operational',
        timestamp: new Date().toISOString(),
        service: 'KrishiAI Backend',
        version: '1.0.0'
    });
});

/**
 * Crop Recommendations Endpoint
 * POST /api/crops/recommend
 */
router.post('/crops/recommend', (req: Request, res: Response) => {
    try {
        const { temperature, rainfall, phLevel } = req.body;

        // Validation
        if (!temperature || !rainfall || !phLevel) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['temperature', 'rainfall', 'phLevel']
            });
        }

        // Mock recommendation logic
        const recommendations = {
            crop1: { name: 'Rice', suitability: 92 },
            crop2: { name: 'Wheat', suitability: 78 },
            crop3: { name: 'Maize', suitability: 65 }
        };

        return res.status(200).json({
            success: true,
            data: {
                recommendations,
                reason: `Based on temperature (${temperature}°C), rainfall (${rainfall}mm), and soil pH (${phLevel})`
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing crop recommendations',
            details: error instanceof Error ? error.message : 'Unknown error'
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

        // Validation
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return res.status(400).json({
                error: 'Invalid symptoms',
                message: 'Symptoms must be a non-empty array of strings'
            });
        }

        if (!cropType || typeof cropType !== 'string') {
            return res.status(400).json({
                error: 'Invalid crop type',
                message: 'Crop type must be a string'
            });
        }

        // Mock disease detection
        const detection = {
            disease: 'Powdery Mildew',
            confidence: 87,
            severity: 'medium',
            controlMethods: [
                'Apply sulfur fungicide',
                'Improve air circulation',
                'Remove infected leaves'
            ]
        };

        return res.status(200).json({
            success: true,
            data: detection
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error detecting disease',
            details: error instanceof Error ? error.message : 'Unknown error'
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

        // Validation
        if (!crop || typeof crop !== 'string') {
            return res.status(400).json({
                error: 'Missing required parameter: crop'
            });
        }

        const daysAhead = days ? parseInt(String(days)) : 1;

        if (isNaN(daysAhead) || daysAhead < 1 || daysAhead > 30) {
            return res.status(400).json({
                error: 'Invalid days parameter',
                message: 'Days must be between 1 and 30'
            });
        }

        // Mock price prediction
        const prediction = {
            crop: crop,
            predictedPrice: 2450,
            currency: 'INR/quintal',
            daysAhead: daysAhead,
            trend: 'up',
            confidence: 85
        };

        return res.status(200).json({
            success: true,
            data: prediction
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error predicting price',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Fertilizer Recommendations Endpoint
 * POST /api/fertilizer/recommend
 */
router.post('/fertilizer/recommend', (req: Request, res: Response) => {
    try {
        const { cropType, nitrogen, phosphorus, potassium } = req.body;

        // Validation
        if (!cropType || nitrogen === undefined || phosphorus === undefined || potassium === undefined) {
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['cropType', 'nitrogen', 'phosphorus', 'potassium']
            });
        }

        if (typeof nitrogen !== 'number' || typeof phosphorus !== 'number' || typeof potassium !== 'number') {
            return res.status(400).json({
                error: 'Nutrient levels must be numbers'
            });
        }

        // Mock fertilizer recommendations
        const recommendations = {
            fertilizers: [
                { name: 'Urea', quantity: 50, unit: 'kg/acre', cost: 1500 },
                { name: 'Superphosphate', quantity: 40, unit: 'kg/acre', cost: 1200 }
            ],
            totalCost: 2700
        };

        return res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error generating fertilizer recommendations',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Weather Data Endpoint
 * GET /api/weather?city=delhi
 */
router.get('/weather', (req: Request, res: Response) => {
    try {
        const { city } = req.query;

        // Validation
        if (!city || typeof city !== 'string') {
            return res.status(400).json({
                error: 'Missing required parameter: city'
            });
        }

        // Mock weather data
        const weatherData = {
            location: city,
            temperature: 28,
            humidity: 65,
            windSpeed: 12,
            precipitation: 5,
            description: 'Partly cloudy',
            farmingSuitability: {
                suitable: true,
                reason: 'Weather conditions are favorable for farming'
            }
        };

        return res.status(200).json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error fetching weather data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * NLP Query Endpoint
 * POST /api/nlp/query
 */
router.post('/nlp/query', (req: Request, res: Response) => {
    try {
        const { query } = req.body;

        // Validation
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return res.status(400).json({
                error: 'Invalid query',
                message: 'Query must be a non-empty string'
            });
        }

        // Mock NLP response
        const nlpResponse = {
            query: query,
            intent: 'crop_recommendation',
            entities: ['crop', 'weather'],
            language: 'en',
            response: 'Based on your query, I recommend growing rice and wheat.'
        };

        return res.status(200).json({
            success: true,
            data: nlpResponse
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error processing query',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Available Crops Endpoint
 * GET /api/crops/list
 */
router.get('/crops/list', (_req: Request, res: Response) => {
    try {
        const crops = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'];

        return res.status(200).json({
            success: true,
            data: {
                crops: crops,
                count: crops.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error fetching crops list',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * Available Diseases Endpoint
 * GET /api/disease/list
 */
router.get('/disease/list', (_req: Request, res: Response) => {
    try {
        const diseases = [
            'Powdery Mildew',
            'Bacterial Blight',
            'Rust Disease',
            'Fusarium Wilt',
            'Downy Mildew'
        ];

        return res.status(200).json({
            success: true,
            data: {
                diseases: diseases,
                count: diseases.length
            }
        });
    } catch (error) {
        return res.status(500).json({
            error: 'Error fetching diseases list',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

/**
 * API Documentation Endpoint
 * GET /api/docs
 */
router.get('/docs', (_req: Request, res: Response) => {
    const documentation = {
        title: 'KrishiAI API Documentation',
        version: '1.0.0',
        baseUrl: 'http://localhost:5001/api',
        endpoints: {
            health: {
                method: 'GET',
                path: '/health',
                description: 'Health check endpoint'
            },
            cropRecommendations: {
                method: 'POST',
                path: '/crops/recommend',
                description: 'Get crop recommendations based on environmental factors',
                body: {
                    temperature: 'number (required)',
                    rainfall: 'number (required)',
                    phLevel: 'number (required)',
                    moisture: 'number (optional)',
                    nitrogen: 'number (optional)'
                }
            },
            diseaseDetection: {
                method: 'POST',
                path: '/disease/detect',
                description: 'Detect crop diseases based on symptoms',
                body: {
                    symptoms: 'string[] (required)',
                    cropType: 'string (required)'
                }
            },
            pricePrediction: {
                method: 'GET',
                path: '/prices/predict',
                description: 'Predict market prices for crops',
                query: {
                    crop: 'string (required)',
                    days: 'number (optional, default: 1)'
                }
            },
            fertilizerRecommendations: {
                method: 'POST',
                path: '/fertilizer/recommend',
                description: 'Get fertilizer recommendations',
                body: {
                    cropType: 'string (required)',
                    nitrogen: 'number (required)',
                    phosphorus: 'number (required)',
                    potassium: 'number (required)',
                    areaInAcres: 'number (optional)'
                }
            },
            weather: {
                method: 'GET',
                path: '/weather',
                description: 'Get weather data for a city',
                query: {
                    city: 'string (required)'
                }
            },
            nlpQuery: {
                method: 'POST',
                path: '/nlp/query',
                description: 'Process natural language farmer queries',
                body: {
                    query: 'string (required)'
                }
            }
        }
    };

    return res.status(200).json(documentation);
});

// 404 Handler for undefined routes
router.use((req: Request, res: Response) => {
    return res.status(404).json({
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        hint: 'Visit /api/docs for API documentation'
    });
});

export default router;
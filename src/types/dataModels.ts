// src/types/dataModels.ts

// Interface for weather data
export interface WeatherData {
    temperature: number;  // temperature in Celsius
    humidity: number;     // humidity percentage
    windSpeed: number;    // wind speed in km/h
    precipitation: number; // precipitation in mm
}

// Interface for soil data
export interface SoilData {
    phLevel: number;         // pH level of the soil
    moistureContent: number; // moisture percentage
    nutrientLevels: {        // levels of key nutrients
        nitrogen: number;    // nitrogen level
        phosphorus: number;  // phosphorus level
        potassium: number;   // potassium level
    };
}

// Interface for farmer profile
export interface FarmerProfile {
    id: string;                 // unique identifier for the farmer
    name: string;               // name of the farmer
    age: number;                // age of the farmer
    farmSize: number;           // size of the farm in acres
    cropsGrown: string[];       // list of crops grown by the farmer
}

// Interface for crop recommendation
export interface CropRecommendation {
    recommendedCrops: string[]; // array of recommended crops
    reason: string;              // reason for the recommendation
}

// Interface for disease detection result
export interface DiseaseDetectionResult {
    detectedDiseases: string[]; // list of detected diseases
    accuracy: number;            // confidence level of detection
}

// Interface for price prediction
export interface PricePrediction {
    crop: string;               // name of the crop
    predictedPrice: number;     // predicted price per unit
    predictionAccuracy: number;  // accuracy of the prediction
}

// Interface for fertilizer recommendation
export interface FertilizerRecommendation {
    recommendedFertilizers: string[]; // list of fertilizers recommended
    applicationRates: number[];        // recommended application rates
}
// priceAgent.ts

// Mandi Price Prediction Agent
// This agent uses historical data patterns to predict future mandi prices for agricultural products.

// Import necessary libraries
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

// Interface for historical price data
interface HistoricalData {
    date: string;
    price: number;
}

// Function to fetch historical price data
async function fetchHistoricalData(productId: string): Promise<HistoricalData[]> {
    const response = await axios.get(`https://api.mandi.example.com/historical/${productId}`);
    return response.data;
}

// Function to preprocess data
function preprocessData(data: HistoricalData[]): number[][] {
    return data.map(item => [new Date(item.date).getTime(), item.price]);
}

// Function to create and train the model
async function trainModel(data: number[][]): Promise<tf.LayersModel> {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [2] }));
    model.add(tf.layers.dense({ units: 1 }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    const xs = tf.tensor2d(data.map(d => [d[0]]));
    const ys = tf.tensor2d(data.map(d => [d[1]]));
    await model.fit(xs, ys, { epochs: 100 });
    return model;
}

// Main function to predict price
async function predictPrice(productId: string): Promise<number> {
    const historicalData = await fetchHistoricalData(productId);
    const processedData = preprocessData(historicalData);
    const model = await trainModel(processedData);

    // Predicting future price based on last data point
    const lastDataPoint = processedData[processedData.length - 1];
    const prediction = model.predict(tf.tensor2d([[lastDataPoint[0] + 86400000]])); // +1 day

    return prediction.dataSync()[0]; // Returning the predicted price
}

// Example usage
predictPrice('product-id-123').then(price => {
    console.log(`Predicted price for tomorrow: ${price}`);
});

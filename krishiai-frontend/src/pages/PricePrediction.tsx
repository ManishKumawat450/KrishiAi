import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const CROPS = ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'];

export default function PricePrediction() {
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [days, setDays] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_BASE}/prices/predict`, {
        params: {
          crop: selectedCrop,
          days: days
        }
      });
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error predicting price');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">💹 Price Prediction</h1>
        <p className="text-gray-600">Predict market prices before selling</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Get Price Forecast</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 text-lg"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Days Ahead: {days}
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? '⏳ Predicting...' : '📊 Get Forecast'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Forecast</h2>
          
          {result ? (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-blue-600">
                <p className="text-gray-600 mb-4">
                  <strong>{result.crop}</strong> - {result.daysAhead} days ahead
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-blue-600">
                    ₹{result.predictedPrice}
                  </span>
                  <span className="text-xl text-gray-600">/quintal</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Trend</p>
                  <p className="text-2xl font-bold">
                    {result.trend === 'up' ? '📈 UP' : '📉 DOWN'}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg">
                  <p className="text-gray-600 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-green-600">{result.confidence}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a crop to see price forecast</p>
          )}
        </div>
      </div>
    </div>
  );
}
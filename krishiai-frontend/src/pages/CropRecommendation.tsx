import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export default function CropRecommendation() {
  const [temp, setTemp] = useState(28);
  const [rainfall, setRainfall] = useState(100);
  const [ph, setPh] = useState(6.5);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/crops/recommend`, {
        temperature: temp,
        rainfall,
        phLevel: ph
      });
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error getting recommendations');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Crop Recommendation</h1>
        <p className="text-gray-600">Find the best crops for your farm</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Farm Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Temperature: {temp}°C
              </label>
              <input
                type="range"
                min="-10"
                max="50"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Rainfall: {rainfall}mm
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={rainfall}
                onChange={(e) => setRainfall(parseFloat(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Soil pH: {ph.toFixed(1)}
              </label>
              <input
                type="range"
                min="4"
                max="9"
                step="0.1"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? '⏳ Getting recommendations...' : '🚀 Get Recommendations'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h2>
          
          {result ? (
            <div className="space-y-4">
              {result.recommendations?.crop1 && (
                <div className="bg-white p-4 rounded-lg border-l-4 border-green-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-lg">{result.recommendations.crop1.name}</p>
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {result.recommendations.crop1.suitability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{width: `${result.recommendations.crop1.suitability}%`}}
                    ></div>
                  </div>
                </div>
              )}
              
              {result.recommendations?.crop2 && (
                <div className="bg-white p-4 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-lg">{result.recommendations.crop2.name}</p>
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {result.recommendations.crop2.suitability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{width: `${result.recommendations.crop2.suitability}%`}}
                    ></div>
                  </div>
                </div>
              )}

              {result.recommendations?.crop3 && (
                <div className="bg-white p-4 rounded-lg border-l-4 border-orange-600">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-lg">{result.recommendations.crop3.name}</p>
                    <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {result.recommendations.crop3.suitability}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full"
                      style={{width: `${result.recommendations.crop3.suitability}%`}}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Enter your farm details to get recommendations</p>
          )}
        </div>
      </div>
    </div>
  );
}
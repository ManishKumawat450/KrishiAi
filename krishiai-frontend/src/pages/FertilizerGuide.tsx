import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const CROPS = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'];

export default function FertilizerGuide() {
  const [cropType, setCropType] = useState('Rice');
  const [nitrogen, setNitrogen] = useState(30);
  const [phosphorus, setPhosphorus] = useState(15);
  const [potassium, setPotassium] = useState(20);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/fertilizer/recommend`, {
        cropType,
        nitrogen,
        phosphorus,
        potassium,
        areaInAcres: 1
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
        <h1 className="text-4xl font-bold text-yellow-800 mb-2">🧪 Fertilizer Guide</h1>
        <p className="text-gray-600">Optimize fertilizer with cost breakdown</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Soil Analysis</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-gray-700 mb-2">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Nitrogen: {nitrogen} ppm
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={nitrogen}
                onChange={(e) => setNitrogen(parseInt(e.target.value))}
                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Phosphorus: {phosphorus} ppm
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={phosphorus}
                onChange={(e) => setPhosphorus(parseInt(e.target.value))}
                className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Potassium: {potassium} ppm
              </label>
              <input
                type="range"
                min="0"
                max="150"
                value={potassium}
                onChange={(e) => setPotassium(parseInt(e.target.value))}
                className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white font-bold py-3 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? '⏳ Analyzing...' : '🧪 Get Recommendations'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="bg-yellow-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommendations</h2>
          
          {result ? (
            <div className="space-y-4">
              {result.fertilizers && result.fertilizers.map((fert: any, idx: number) => (
                <div key={idx} className="bg-white p-6 rounded-lg border-l-4 border-yellow-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold">{fert.name}</h3>
                    <span className="bg-yellow-600 text-white px-3 py-1 rounded-full font-bold">
                      ₹{fert.cost}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Quantity:</strong> {fert.quantity} {fert.unit}</p>
                    <p><strong>Timing:</strong> {fert.timing}</p>
                  </div>
                </div>
              ))}

              {result.totalCost && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-lg mt-4">
                  <p className="text-lg mb-2">Total Cost (1 acre)</p>
                  <p className="text-4xl font-bold">₹{result.totalCost}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Adjust nutrient levels to get recommendations</p>
          )}
        </div>
      </div>
    </div>
  );
}
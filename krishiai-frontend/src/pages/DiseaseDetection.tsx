import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

const SYMPTOMS = [
  'White spots on leaves',
  'Yellow leaves',
  'Brown spots',
  'Leaf curling',
  'Wilting',
  'Rust-colored pustules',
  'Water-soaked lesions',
  'Stunted growth'
];

const CROPS = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane'];

export default function DiseaseDetection() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [cropType, setCropType] = useState('Rice');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_BASE}/disease/detect`, {
        symptoms: selectedSymptoms,
        cropType: cropType
      });
      setResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error detecting disease');
    }
    
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-red-800 mb-2">🦠 Disease Detection</h1>
        <p className="text-gray-600">Identify crop diseases and get control methods</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Identify Disease</h2>
          
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
              <label className="block font-semibold text-gray-700 mb-3">
                Symptoms ({selectedSymptoms.length} selected)
              </label>
              <div className="space-y-2">
                {SYMPTOMS.map(symptom => (
                  <label key={symptom} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span className="ml-3 text-gray-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-lg"
            >
              {loading ? '⏳ Detecting...' : '🔍 Detect Disease'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="bg-red-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis</h2>
          
          {result ? (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg border-l-4 border-red-600">
                <h3 className="text-2xl font-bold text-red-800 mb-2">{result.disease}</h3>
                <span className="bg-red-600 text-white px-3 py-1 rounded-full font-bold">
                  {result.confidence}% Confident
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-3">Control Methods</h4>
                <ul className="space-y-2">
                  {result.controlMethods && result.controlMethods.map((method: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-green-600 font-bold">✓</span>
                      <span className="text-gray-700">{method}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select symptoms to get disease diagnosis</p>
          )}
        </div>
      </div>
    </div>
  );
}
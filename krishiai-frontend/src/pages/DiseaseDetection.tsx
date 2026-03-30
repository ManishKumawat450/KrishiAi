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

interface DiseaseResult {
  disease: string;
  confidence: number;
  controlMethods?: string[];
}

export default function DiseaseDetection() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [cropType, setCropType] = useState('Rice');
  const [result, setResult] = useState<DiseaseResult | null>(null);
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
      setResult(null);
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
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error detecting disease'
        : 'Error detecting disease';
      setError(message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">🦠 Disease Detection</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Select crop symptoms and get a confidence-scored diagnosis with suggested control actions.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Detection Input</h2>
          <p className="mt-1 text-sm text-slate-600">Choose crop type and observed symptoms.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="crop-type" className="mb-2 block text-sm font-semibold text-slate-800">Crop Type</label>
              <select
                id="crop-type"
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition-colors duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-3 block text-sm font-semibold text-slate-800">
                Symptoms ({selectedSymptoms.length} selected)
              </p>
              <div className="space-y-2" role="group" aria-label="Select observed symptoms">
                {SYMPTOMS.map(symptom => (
                  <label
                    key={symptom}
                    className="flex cursor-pointer items-center rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors duration-200 hover:border-rose-300 hover:bg-rose-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                      className="h-4 w-4 rounded border-slate-300 bg-white text-rose-500"
                    />
                    <span className="ml-3 text-sm text-slate-700">{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || selectedSymptoms.length === 0}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(225,29,72,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? '⏳ Detecting...' : '🔍 Detect Disease'}
            </button>
          </form>

          <div className="mt-4 text-xs text-slate-500">
            Tip: select multiple symptoms to improve detection quality.
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Analysis</h2>
          <p className="mt-1 text-sm text-slate-600">Diagnosis and practical control guidance.</p>

          <div className="mt-6" aria-live="polite">
            {loading && (
              <div className="space-y-3" role="status">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-6 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-4/6 animate-pulse rounded bg-slate-200" />
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
                ❌ {error}
              </div>
            )}

            {!loading && !error && !result && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                Select crop symptoms and run detection to get a diagnosis.
              </div>
            )}

            {!loading && !error && result && (
              <div className="space-y-4">
                <article className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="text-2xl font-black text-rose-700">{result.disease}</h3>
                  <div className="mt-3 inline-flex items-center rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    {result.confidence}% confidence
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-lg font-bold text-slate-900">Control Methods</h4>
                  {result.controlMethods && result.controlMethods.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {result.controlMethods.map((method, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-emerald-600">✓</span>
                          <span className="text-sm text-slate-700">{method}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">No control methods returned for this detection.</p>
                  )}
                </article>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
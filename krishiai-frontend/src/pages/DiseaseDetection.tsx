import React, { useState, useRef } from 'react';
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

const CROPS = ['Rice', 'Wheat', 'Maize', 'Cotton', 'Sugarcane', 'Tomato', 'Potato', 'Soybean'];

interface DiseaseResult {
  disease: string;
  hindiName?: string;
  confidence: number;
  severity?: string;
  cause?: string;
  description?: string;
  controlMethods?: string[];
  preventiveMeasures?: string[];
  organicTreatment?: string;
  estimatedYieldLoss?: string;
  matchedSymptoms?: string[];
}

// AI/CNN image detection result shape (from /api/disease/detect-image)
interface ImageDiseaseResult {
  disease: string;
  hindiName: string;
  confidence: number;        // 0–1 from model
  severity: string;
  crop: string;
  treatment: string[];
  prevention: string[];
  organicAlternative: string;
  estimatedYieldLoss: string;
  modelUsed: 'cnn' | 'heuristic';
  allPredictions?: Array<{ label: string; confidence: number }>;
}

const INFERENCE_STEP_DELAY_MS = 600; // milliseconds between inference step animations

const INFERENCE_STEPS = [
  '📥 Receiving image…',
  '🔧 Preprocessing (resize 224×224, normalize)…',
  '🧠 Running AI inference…',
  '📊 Computing confidence scores…',
  '✅ Generating diagnosis report…',
];

export default function DiseaseDetection() {
  const [activeTab, setActiveTab] = useState<'symptoms' | 'image'>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [cropType, setCropType] = useState('Rice');
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Image upload tab state
  const [imageCropType, setImageCropType] = useState('Rice');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageResult, setImageResult] = useState<ImageDiseaseResult | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');
  const [inferenceStep, setInferenceStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    setImageResult(null);
    setImageError('');
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) {
      setImageError('Please select an image to upload.');
      return;
    }
    setImageLoading(true);
    setImageError('');
    setInferenceStep(0);

    // Animate inference steps for UX feedback
    const stepInterval = setInterval(() => {
      setInferenceStep(prev => {
        if (prev < INFERENCE_STEPS.length - 2) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, INFERENCE_STEP_DELAY_MS);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('cropType', imageCropType);
      const response = await axios.post(`${API_BASE}/disease/detect-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setInferenceStep(INFERENCE_STEPS.length - 1);
      clearInterval(stepInterval);
      setImageResult(response.data.data);
    } catch (err: unknown) {
      clearInterval(stepInterval);
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error || 'Error analyzing image'
        : 'Error analyzing image';
      setImageError(message);
      setImageResult(null);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">🦠 Disease Detection</h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Select crop symptoms or upload a photo to get a confidence-scored diagnosis with control actions.
        </p>
      </header>

      {/* Tab navigation */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('symptoms')}
          className={`rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
            activeTab === 'symptoms'
              ? 'border-b-2 border-rose-500 text-rose-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📋 Symptom Checker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('image')}
          className={`rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
            activeTab === 'image'
              ? 'border-b-2 border-rose-500 text-rose-700'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          📷 Image Upload
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Symptom Checker Tab ── */}
        {activeTab === 'symptoms' && (
        <>
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
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-2xl font-black text-rose-700">{result.disease}</h3>
                      {result.hindiName && <p className="mt-0.5 text-sm text-rose-500">{result.hindiName}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                        {result.confidence}% confidence
                      </span>
                      {result.severity && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          result.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          result.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          Severity: {result.severity}
                        </span>
                      )}
                    </div>
                  </div>
                  {result.cause && <p className="mt-2 text-xs text-rose-600">Cause: {result.cause}</p>}
                  {result.description && <p className="mt-2 text-sm text-rose-700">{result.description}</p>}
                  {result.estimatedYieldLoss && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">⚠️ Estimated yield loss: {result.estimatedYieldLoss}</p>
                  )}
                </article>

                <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <h4 className="text-base font-bold text-slate-900">💊 Control Methods</h4>
                  {result.controlMethods && result.controlMethods.length > 0 ? (
                    <ul className="mt-3 space-y-2">
                      {result.controlMethods.map((method, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-emerald-600 font-bold">✓</span>
                          <span className="text-sm text-slate-700">{method}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-slate-600">No control methods returned for this detection.</p>
                  )}
                </article>

                {result.preventiveMeasures && result.preventiveMeasures.length > 0 && (
                  <article className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <h4 className="text-base font-bold text-blue-900">🛡️ Prevention</h4>
                    <ul className="mt-3 space-y-2">
                      {result.preventiveMeasures.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-blue-600">•</span>
                          <span className="text-sm text-blue-800">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}

                {result.organicTreatment && (
                  <article className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <h4 className="text-base font-bold text-green-900">🌿 Organic Treatment</h4>
                    <p className="mt-2 text-sm text-green-800">{result.organicTreatment}</p>
                  </article>
                )}
              </div>
            )}
          </div>
        </section>
        </>
        )}

        {/* ── Image Upload Tab ── */}
        {activeTab === 'image' && (
        <>
        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Upload Crop Photo</h2>
          <p className="mt-1 text-sm text-slate-600">Upload a photo of the affected plant for analysis.</p>

          <form onSubmit={handleImageSubmit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="image-crop-type" className="mb-2 block text-sm font-semibold text-slate-800">Crop Type</label>
              <select
                id="image-crop-type"
                value={imageCropType}
                onChange={(e) => setImageCropType(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition-colors duration-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 block text-sm font-semibold text-slate-800">Plant Photo</p>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 transition-colors duration-200 hover:border-rose-400 hover:bg-rose-50"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-contain"
                  />
                ) : (
                  <>
                    <span className="text-4xl">📷</span>
                    <p className="mt-2 text-sm font-semibold text-slate-700">Click to upload image</p>
                    <p className="mt-1 text-xs text-slate-500">PNG, JPG, JPEG up to 5 MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {imageFile && (
                <p className="mt-2 text-xs text-slate-500 truncate">📎 {imageFile.name}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={imageLoading || !imageFile}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-base font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(225,29,72,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {imageLoading ? '⏳ Analyzing...' : '🔬 Analyze Image'}
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur-sm sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">AI Analysis</h2>
          <p className="mt-1 text-sm text-slate-600">Diagnosis from uploaded image using computer vision.</p>

          <div className="mt-6" aria-live="polite">
            {imageLoading && (
              <div className="space-y-3" role="status">
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-3">🤖 AI Inference in Progress</p>
                  <ul className="space-y-2">
                    {INFERENCE_STEPS.map((step, idx) => (
                      <li key={idx} className={`flex items-center gap-2 text-sm transition-opacity ${idx <= inferenceStep ? 'opacity-100 font-medium text-indigo-700' : 'opacity-30 text-slate-500'}`}>
                        {idx < inferenceStep ? '✅' : idx === inferenceStep ? '⏳' : '○'}
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {!imageLoading && imageError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">
                ❌ {imageError}
              </div>
            )}

            {!imageLoading && !imageError && !imageResult && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                <p className="text-2xl mb-2">🔬</p>
                <p>Upload a crop leaf photo and click <strong>Analyze Image</strong> to run AI disease detection.</p>
                <p className="mt-1 text-xs text-slate-400">Powered by image analysis + CNN classification</p>
              </div>
            )}

            {!imageLoading && !imageError && imageResult && (
              <div className="space-y-4">
                {/* Model badge */}
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${imageResult.modelUsed === 'cnn' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'}`}>
                    {imageResult.modelUsed === 'cnn' ? '🧠 CNN Model' : '🔍 Visual Analysis'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {imageResult.modelUsed === 'cnn' ? 'PlantVillage CNN inference' : 'Heuristic image analysis (deploy model for CNN)'}
                  </span>
                </div>

                <article className="rounded-xl border border-rose-200 bg-rose-50 p-5">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="text-2xl font-black text-rose-700">{imageResult.disease}</h3>
                      {imageResult.hindiName && <p className="mt-0.5 text-sm text-rose-500">{imageResult.hindiName}</p>}
                      {imageResult.crop && <p className="mt-0.5 text-xs text-rose-400">Crop: {imageResult.crop}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {/* Confidence bar */}
                      <div className="text-right">
                        <span className="inline-flex items-center rounded-full border border-rose-300 bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                          {Math.round(imageResult.confidence * 100)}% confidence
                        </span>
                        <div className="mt-1 w-32 bg-rose-100 rounded-full h-1.5">
                          <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${Math.round(imageResult.confidence * 100)}%` }} />
                        </div>
                      </div>
                      {imageResult.severity && imageResult.severity !== 'None' && imageResult.severity !== 'Unknown' && (
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          imageResult.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                          imageResult.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          Severity: {imageResult.severity}
                        </span>
                      )}
                    </div>
                  </div>
                  {imageResult.estimatedYieldLoss && imageResult.estimatedYieldLoss !== '0%' && (
                    <p className="mt-2 text-xs font-semibold text-rose-600">⚠️ Estimated yield loss: {imageResult.estimatedYieldLoss}</p>
                  )}
                </article>

                {imageResult.treatment && imageResult.treatment.length > 0 && (
                  <article className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h4 className="text-base font-bold text-slate-900">💊 Treatment</h4>
                    <ul className="mt-3 space-y-2">
                      {imageResult.treatment.map((method, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-emerald-600 font-bold">✓</span>
                          <span className="text-sm text-slate-700">{method}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}

                {imageResult.prevention && imageResult.prevention.length > 0 && (
                  <article className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                    <h4 className="text-base font-bold text-blue-900">🛡️ Prevention</h4>
                    <ul className="mt-3 space-y-2">
                      {imageResult.prevention.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="mt-0.5 text-blue-600">•</span>
                          <span className="text-sm text-blue-800">{m}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}

                {imageResult.organicAlternative && (
                  <article className="rounded-xl border border-green-200 bg-green-50 p-4">
                    <h4 className="text-base font-bold text-green-900">🌿 Organic Alternative</h4>
                    <p className="mt-2 text-sm text-green-800">{imageResult.organicAlternative}</p>
                  </article>
                )}

                {imageResult.allPredictions && imageResult.allPredictions.length > 1 && (
                  <article className="rounded-xl border border-slate-200 bg-white p-5">
                    <h4 className="text-base font-bold text-slate-900">📊 Top AI Predictions</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Other diseases considered by the model:</p>
                    <ul className="mt-3 space-y-2">
                      {imageResult.allPredictions.map((pred, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400 w-4">{idx + 1}.</span>
                          <span className="text-sm text-slate-700 flex-1">{pred.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-slate-100 rounded-full h-1.5">
                              <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${Math.round(pred.confidence * 100)}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 w-8 text-right">{Math.round(pred.confidence * 100)}%</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                )}
              </div>
            )}
          </div>
        </section>
        </>
        )}
      </div>
    </div>
  );
}
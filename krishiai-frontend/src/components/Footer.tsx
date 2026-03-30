import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-emerald-100 bg-gradient-to-b from-white to-emerald-50/40 text-slate-700 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-xl font-black tracking-tight text-slate-900">🌾 KrishiAI</h3>
            <p className="max-w-sm text-sm leading-relaxed text-slate-600">
              Intelligent farming platform with AI tools designed to make decisions faster, clearer, and more confident.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-700">Features</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="transition-colors duration-200 hover:text-emerald-700">🌱 Crop Recommendations</li>
              <li className="transition-colors duration-200 hover:text-emerald-700">🦠 Disease Detection</li>
              <li className="transition-colors duration-200 hover:text-emerald-700">💹 Price Prediction</li>
              <li className="transition-colors duration-200 hover:text-emerald-700">🧪 Fertilizer Guide</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.12em] text-slate-700">Technology</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="transition-colors duration-200 hover:text-cyan-700">React + TypeScript</li>
              <li className="transition-colors duration-200 hover:text-cyan-700">Node.js + Express</li>
              <li className="transition-colors duration-200 hover:text-cyan-700">PostgreSQL</li>
              <li className="transition-colors duration-200 hover:text-cyan-700">Docker</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>&copy; {year} KrishiAI. Making farming smarter for India. 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
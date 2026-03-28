import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">🌾 KrishiAI</h3>
            <p className="text-gray-300">Intelligent Farming Platform with FREE APIs & AI</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="text-gray-300 space-y-2">
              <li>🌱 Crop Recommendations</li>
              <li>🦠 Disease Detection</li>
              <li>💹 Price Prediction</li>
              <li>🧪 Fertilizer Guide</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Technology</h3>
            <ul className="text-gray-300 space-y-2">
              <li>React + TypeScript</li>
              <li>Node.js + Express</li>
              <li>PostgreSQL</li>
              <li>Docker</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2024 KrishiAI. Making Farming Smarter. 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
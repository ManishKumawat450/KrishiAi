import React from 'react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold text-green-800 mb-4">🌾 KrishiAI</h1>
        <p className="text-2xl text-gray-600 mb-8">Intelligent Farming Guidance for Indian Farmers</p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
          AI-powered recommendations for crops, disease detection, market prices, and fertilizer optimization.
          Built with FREE APIs and Machine Learning.
        </p>
      </section>

      <section>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div 
            onClick={() => onNavigate('crops')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer border-t-4 border-green-500"
          >
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Crop Recommendation</h3>
            <p className="text-gray-600 mb-4">AI-powered crop suggestions based on weather and soil</p>
            <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
              Try Now →
            </button>
          </div>

          <div 
            onClick={() => onNavigate('disease')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer border-t-4 border-red-500"
          >
            <div className="text-4xl mb-4">🦠</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Disease Detection</h3>
            <p className="text-gray-600 mb-4">Identify crop diseases and get control methods</p>
            <button className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">
              Try Now →
            </button>
          </div>

          <div 
            onClick={() => onNavigate('price')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer border-t-4 border-blue-500"
          >
            <div className="text-4xl mb-4">💹</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Price Prediction</h3>
            <p className="text-gray-600 mb-4">Predict market prices before selling crops</p>
            <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
              Try Now →
            </button>
          </div>

          <div 
            onClick={() => onNavigate('fertilizer')}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition cursor-pointer border-t-4 border-yellow-500"
          >
            <div className="text-4xl mb-4">🧪</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fertilizer Guide</h3>
            <p className="text-gray-600 mb-4">Optimize fertilizer with cost breakdown</p>
            <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition">
              Try Now →
            </button>
          </div>
        </div>
      </section>

      <section className="bg-green-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Why KrishiAI?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">✅ 100% FREE</h3>
            <p className="text-gray-700">No subscription. Uses only free APIs and open-source technology.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">🤖 AI-Powered</h3>
            <p className="text-gray-700">Machine learning provides intelligent recommendations.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">🌍 Real Data</h3>
            <p className="text-gray-700">Uses OpenWeatherMap and real market data.</p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-2">⚡ Fast & Easy</h3>
            <p className="text-gray-700">Get recommendations in seconds.</p>
          </div>
        </div>
      </section>

      <section className="bg-green-600 text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farming?</h2>
        <button 
          onClick={() => onNavigate('crops')}
          className="bg-white text-green-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition text-lg"
        >
          🚀 Get Started Now
        </button>
      </section>
    </div>
  );
}
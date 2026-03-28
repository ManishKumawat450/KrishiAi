import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CropRecommendation from './pages/CropRecommendation';
import DiseaseDetection from './pages/DiseaseDetection';
import PricePrediction from './pages/PricePrediction';
import FertilizerGuide from './pages/FertilizerGuide';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <Navbar onNavigate={setCurrentPage} />
      
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 py-8">
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
        {currentPage === 'crops' && <CropRecommendation />}
        {currentPage === 'disease' && <DiseaseDetection />}
        {currentPage === 'price' && <PricePrediction />}
        {currentPage === 'fertilizer' && <FertilizerGuide />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
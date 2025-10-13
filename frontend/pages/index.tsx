import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { fetchSummary } from '../utils/api';

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      // Navigate to dashboard - the dashboard will fetch the data
      router.push('/dashboard');
    } catch (error) {
      console.error('Error generating summary:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="Mindscroll" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to{' '}
              <span className="text-gradient">Mindscroll</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI-powered health companion that orchestrates multiple wellness agents 
              to provide personalized daily insights and recommendations.
            </p>
          </div>

          <div className="mb-12">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card text-center">
                <div className="text-4xl mb-3">🍎</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Agent</h3>
                <p className="text-sm text-gray-600">
                  Analyzes your meals and provides nutritional insights
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-3">💪</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercise Agent</h3>
                <p className="text-sm text-gray-600">
                  Tracks your activities and motivates your fitness journey
                </p>
              </div>
              
              <div className="card text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lifestyle Agent</h3>
                <p className="text-sm text-gray-600">
                  Monitors sleep, screen time, and overall wellness
                </p>
              </div>
            </div>
          </div>

          <div className="card max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Generate Your Daily Summary
            </h2>
            <p className="text-gray-600 mb-6">
              Let our AI orchestrator analyze your health data and provide 
              personalized insights and recommendations.
            </p>
            
            <button
              onClick={handleGenerateSummary}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                'Generate Daily Summary'
              )}
            </button>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Powered by AI • Privacy-focused • Real-time insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

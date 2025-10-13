import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import { fetchSummary } from '../utils/api';

const Home: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleGenerateSummary = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      // Navigate to dashboard - the dashboard will fetch the data
      router.push('/dashboard');
    } catch (error) {
      console.error('Error generating summary:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
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
              <button
                onClick={() => router.push('/food-input')}
                className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🍎</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Food Agent</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Analyzes your meals and provides nutritional insights
                </p>
                <div className="text-primary-600 font-medium text-sm">
                  Click to input your meals →
                </div>
              </button>
              
              <button
                onClick={() => router.push('/exercise-input')}
                className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💪</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercise Agent</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Tracks your activities and motivates your fitness journey
                </p>
                <div className="text-primary-600 font-medium text-sm">
                  Click to input your exercises →
                </div>
              </button>
              
              <button
                onClick={() => router.push('/lifestyle-input')}
                className="card text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌱</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lifestyle Agent</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Monitors sleep, screen time, and overall wellness
                </p>
                <div className="text-primary-600 font-medium text-sm">
                  Click to input your lifestyle →
                </div>
              </button>
            </div>
          </div>

          {user ? (
            <div className="card max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-gray-600 mb-6">
                Ready to continue your personalized health journey? Let's track your progress today.
              </p>
              
              <div className="space-y-4">
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
                    'Track Today\'s Progress'
                  )}
                </button>
                
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full bg-blue-500 text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Profile & Goal
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="card max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Start Your Health Journey
              </h2>
              <p className="text-gray-600 mb-6">
                Create an account to get your personalized AI-generated health goal and start tracking your progress.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
                >
                  Create Account & Get AI Goal
                </button>
                
                <button
                  onClick={() => router.push('/login')}
                  className="w-full bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}

          <div className="mt-12 text-sm text-gray-500">
            <p>Powered by AI • Privacy-focused • Real-time insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

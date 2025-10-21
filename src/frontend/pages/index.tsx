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


  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="Mindscroll" showUserControls={!!user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="/data/Logo.jpg" 
                alt="Mindscroll Logo" 
                className="h-16 w-auto mr-4"
              />
              <h1 className="text-5xl font-bold text-gray-900">
                Welcome to{' '}
                <span className="text-gradient">Mindscroll</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your AI-powered study companion that helps students balance health, learning, and personal growth 
              with personalized daily insights and educational content.
            </p>
          </div>


          {user ? (
            <div className="card max-w-md mx-auto">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-3">{user.avatar || '🎓'}</span>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome back, {user.nickname || user.name}! 👋
                  </h2>
                  {user.nickname && (
                    <p className="text-sm text-gray-500">
                      {user.name} • The {user.nickname}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Ready to continue your student journey? Choose between health tracking for student life or intellectual exploration for your studies.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/path-selection')}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
                >
                  🎯 Choose Your Path
                </button>
              </div>
            </div>
          ) : (
            <div className="card max-w-md mx-auto">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Start Your Student Journey
              </h2>
              <p className="text-gray-600 mb-6">
                Create an account to get your personalized AI-generated study and health goals, plus access to educational content tailored for students.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300"
                >
                  🎓 Create Student Account
                </button>
                
                <button
                  onClick={() => router.push('/intellectual')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  📚 Explore Study Path
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

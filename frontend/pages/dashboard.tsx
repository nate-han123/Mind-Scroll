import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import SummaryCard from '../components/SummaryCard';
import AgentOutput from '../components/AgentOutput';
import { fetchSummaryFromUserData, DailySummary } from '../utils/api';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [summary, setSummary] = useState<DailySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is logged in
        const userDataString = localStorage.getItem('user');
        if (!userDataString) {
          router.push('/login');
          return;
        }
        
        const userData = JSON.parse(userDataString);
        setUser(userData);
        
        // Debug: Log the user data to see what we're working with
        console.log('Dashboard user data:', userData);
        
        // Get today's data from localStorage, with sample data if empty
        let foodData = JSON.parse(localStorage.getItem('userFoodData') || '[]');
        let exerciseData = JSON.parse(localStorage.getItem('userExerciseData') || '[]');
        let lifestyleData = JSON.parse(localStorage.getItem('userLifestyleData') || '{}');
        
        // Add sample data if no data exists
        if (foodData.length === 0) {
          foodData = ['Oatmeal with berries', 'Grilled chicken salad', 'Greek yogurt with nuts'];
          localStorage.setItem('userFoodData', JSON.stringify(foodData));
        }
        if (exerciseData.length === 0) {
          exerciseData = ['30-minute morning jog', '15-minute strength training'];
          localStorage.setItem('userExerciseData', JSON.stringify(exerciseData));
        }
        if (Object.keys(lifestyleData).length === 0) {
          lifestyleData = { sleep_hours: 8, screen_time: 6, stress_level: 4, water_intake: 8 };
          localStorage.setItem('userLifestyleData', JSON.stringify(lifestyleData));
        }
        
        // Use personalized summary API
        const response = await fetch('http://localhost:8000/generate-personalized-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userData.user_id,
            meals: foodData,
            exercises: exerciseData,
            lifestyle: lifestyleData
          }),
        });
        
        if (response.ok) {
          const data = await response.json();
          setSummary(data);
        } else {
          throw new Error('Failed to generate personalized summary');
        }
      } catch (err) {
        setError('Failed to load summary. Please try again.');
        console.error('Error loading summary:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, [router]);

  // Refresh when user data changes (e.g., after profile update)
  useEffect(() => {
    const handleStorageChange = () => {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUser(userData);
        console.log('User data refreshed:', userData);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Analyzing your health data...</p>
              <p className="text-sm text-gray-500 mt-2">Our AI agents are working hard</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="card max-w-md mx-auto">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Oops!</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'User'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                Your personalized health insights and progress toward your goals
              </p>
            </div>
            <button
              onClick={handleBackToHome}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Overall Summary */}
        <div className="mb-8">
          <SummaryCard
            title="Overall Health Score"
            value={summary.orchestrator_summary.overall_health_score}
            subtitle="out of 10"
            comment={summary.orchestrator_summary.summary}
            score={summary.orchestrator_summary.overall_health_score}
            color="primary"
            className="mb-6"
          />
        </div>

        {/* Agent Outputs */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <AgentOutput agent="food" data={summary.food_agent} />
          <AgentOutput agent="exercise" data={summary.exercise_agent} />
          <AgentOutput agent="lifestyle" data={summary.lifestyle_agent} />
        </div>

        {/* Goal Progress */}
        {summary.goal_alignment && (
          <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              Goal Progress
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary.goal_alignment}</p>
          </div>
        )}

        {/* Motivation */}
        {summary.orchestrator_summary.motivation && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">💪</span>
              Daily Motivation
            </h3>
            <p className="text-gray-700 leading-relaxed">{summary.orchestrator_summary.motivation}</p>
          </div>
        )}

        {/* Recommendations */}
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">💡</span>
            Personalized Recommendations
          </h3>
          <div className="space-y-3">
            {summary.orchestrator_summary.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/profile')}
            className="bg-secondary-500 text-white px-6 py-3 rounded-lg hover:bg-secondary-600 transition-colors font-medium"
          >
            Edit Profile & Goal
          </button>
          <button
            onClick={handleRefresh}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            Refresh Summary
          </button>
          <button
            onClick={handleBackToHome}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Generate New Summary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

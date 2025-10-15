import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

interface UserGoal {
  goal_type: string;
  target_weight?: number;
  target_calories_per_day?: number;
  target_protein_per_day?: number;
  target_exercise_minutes_per_week?: number;
  target_sleep_hours?: number;
  target_screen_time_hours?: number;
  target_stress_level?: number;
  goal_description: string;
  ai_generated: boolean;
  created_at: string;
}

interface User {
  user_id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  email: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  activity_level: string;
  goal: UserGoal;
}

const GoalHomepage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = () => {
      const userDataString = localStorage.getItem('user');
      if (!userDataString) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(userDataString);
      setUser(userData);
      setIsLoading(false);
    };

    loadUserData();
  }, [router]);

  const getGoalTypeDisplay = (goalType: string) => {
    const goalTypes: { [key: string]: string } = {
      'weight_loss': 'Weight Loss',
      'weight_gain': 'Weight Gain',
      'muscle_gain': 'Muscle Building',
      'endurance': 'Endurance Training',
      'general_health': 'General Health',
      'stress_reduction': 'Stress Reduction',
      'better_sleep': 'Better Sleep'
    };
    return goalTypes[goalType] || goalType;
  };

  const getGoalIcon = (goalType: string) => {
    const icons: { [key: string]: string } = {
      'weight_loss': '🔥',
      'weight_gain': '💪',
      'muscle_gain': '🏋️',
      'endurance': '🏃',
      'general_health': '❤️',
      'stress_reduction': '🧘',
      'better_sleep': '😴'
    };
    return icons[goalType] || '🎯';
  };

  const getGoalColor = (goalType: string) => {
    const colors: { [key: string]: string } = {
      'weight_loss': 'from-red-500 to-orange-500',
      'weight_gain': 'from-blue-500 to-purple-500',
      'muscle_gain': 'from-green-500 to-teal-500',
      'endurance': 'from-yellow-500 to-red-500',
      'general_health': 'from-pink-500 to-rose-500',
      'stress_reduction': 'from-indigo-500 to-blue-500',
      'better_sleep': 'from-purple-500 to-indigo-500'
    };
    return colors[goalType] || 'from-gray-500 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your personalized goal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar showUserControls={true} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl mr-4">{user.avatar || '💪'}</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome, {user.nickname || user.name}! 👋
              </h1>
              {user.nickname && (
                <p className="text-lg text-gray-500 mt-1">
                  {user.name} • The {user.nickname}
                </p>
              )}
            </div>
          </div>
          <p className="text-xl text-gray-600">
            Your personalized student health journey starts here
          </p>
        </div>

        {/* Main Goal Card */}
        <div className="card max-w-4xl mx-auto mb-8">
          <div className={`bg-gradient-to-r ${getGoalColor(user.goal.goal_type)} p-8 rounded-lg text-white mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-4xl mr-4">{getGoalIcon(user.goal.goal_type)}</span>
                <div>
                  <h2 className="text-3xl font-bold">{getGoalTypeDisplay(user.goal.goal_type)}</h2>
                  <p className="text-lg opacity-90">Your Personalized Student Goal</p>
                </div>
              </div>
            </div>
            <p className="text-lg leading-relaxed">
              {user.goal.goal_description}
            </p>
          </div>

          {/* Goal Details Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.goal.target_calories_per_day && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🍽️</span>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Calories</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">{user.goal.target_calories_per_day}</p>
                <p className="text-sm text-gray-600">calories per day</p>
              </div>
            )}

            {user.goal.target_protein_per_day && (
              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🥩</span>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Protein</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">{user.goal.target_protein_per_day}g</p>
                <p className="text-sm text-gray-600">grams per day</p>
              </div>
            )}

            {user.goal.target_exercise_minutes_per_week && (
              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🏃</span>
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Exercise</h3>
                </div>
                <p className="text-3xl font-bold text-orange-600">{user.goal.target_exercise_minutes_per_week}</p>
                <p className="text-sm text-gray-600">minutes per week</p>
              </div>
            )}

            {user.goal.target_sleep_hours && (
              <div className="bg-purple-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">😴</span>
                  <h3 className="text-lg font-semibold text-gray-900">Daily Sleep</h3>
                </div>
                <p className="text-3xl font-bold text-purple-600">{user.goal.target_sleep_hours}h</p>
                <p className="text-sm text-gray-600">hours per night</p>
              </div>
            )}

            {user.goal.target_screen_time_hours && (
              <div className="bg-red-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">📱</span>
                  <h3 className="text-lg font-semibold text-gray-900">Screen Time</h3>
                </div>
                <p className="text-3xl font-bold text-red-600">{user.goal.target_screen_time_hours}h</p>
                <p className="text-sm text-gray-600">hours per day</p>
              </div>
            )}

            {user.goal.target_stress_level && (
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🧘</span>
                  <h3 className="text-lg font-semibold text-gray-900">Target Stress</h3>
                </div>
                <p className="text-3xl font-bold text-yellow-600">{user.goal.target_stress_level}/10</p>
                <p className="text-sm text-gray-600">stress level</p>
              </div>
            )}
          </div>
        </div>

        {/* Lifestyle Recommendations */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Exercise Recommendations */}
          <div className="card">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">💪</span>
              <h3 className="text-2xl font-bold text-gray-900">Exercise Plan</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Weekly Target</h4>
                <p className="text-gray-700">
                  {user.goal.target_exercise_minutes_per_week 
                    ? `${user.goal.target_exercise_minutes_per_week} minutes per week`
                    : 'Exercise recommendations will be provided based on your goal'
                  }
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Recommended Activities</h4>
                <p className="text-gray-700">
                  Based on your goal type, we'll suggest specific exercises that align with your objectives and preferences.
                </p>
              </div>
            </div>
          </div>

          {/* Nutrition Recommendations */}
          <div className="card">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🥗</span>
              <h3 className="text-2xl font-bold text-gray-900">Nutrition Plan</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Daily Calories</h4>
                <p className="text-gray-700">
                  {user.goal.target_calories_per_day 
                    ? `${user.goal.target_calories_per_day} calories per day`
                    : 'Calorie recommendations will be provided based on your goal'
                  }
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Protein Target</h4>
                <p className="text-gray-700">
                  {user.goal.target_protein_per_day 
                    ? `${user.goal.target_protein_per_day}g protein per day`
                    : 'Protein recommendations will be provided based on your goal'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/data-entry')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Track Today's Progress
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Edit My Goal
          </button>
        </div>

        {/* Getting Started Section */}
        <div className="mt-12 text-center">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h3>
            <p className="text-gray-600 mb-6">
              Click "Track Today's Progress" to log your meals, exercises, and lifestyle activities. 
              We'll analyze your progress against your personalized goal and provide insights to keep you on track.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-500">
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">🍽️</span>
                Log your meals
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">🏃</span>
                Track your exercises
              </div>
              <div className="flex items-center justify-center">
                <span className="text-2xl mr-2">😴</span>
                Monitor your lifestyle
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalHomepage;

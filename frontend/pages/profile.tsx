import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const Profile: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activity_level: 'moderately_active',
    medical_conditions: [] as string[],
    dietary_restrictions: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load current user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    setUser(user);
    
    // Populate form with current user data
    // Handle both nested (login response) and flat (profile update response) structures
    const profileData = user.profile || user;
    
    setFormData({
      name: user.name || '',
      email: user.email || '',
      age: profileData.age || 25,
      gender: profileData.gender || 'male',
      weight: profileData.weight || 70,
      height: profileData.height || 170,
      activity_level: profileData.activity_level || 'moderately_active',
      medical_conditions: profileData.medical_conditions || [],
      dietary_restrictions: profileData.dietary_restrictions || []
    });
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:8000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.user_id,
          ...formData
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update localStorage with new user data
        // The profile update response has a flat structure, but we need to maintain consistency
        const updatedUser = {
          user_id: result.user.user_id,
          name: result.user.name,
          email: result.user.email,
          profile: {
            name: result.user.name,
            age: result.user.age,
            gender: result.user.gender,
            weight: result.user.weight,
            height: result.user.height,
            activity_level: result.user.activity_level,
            medical_conditions: result.user.medical_conditions,
            dietary_restrictions: result.user.dietary_restrictions,
            created_at: new Date().toISOString()
          },
          goal: result.goal
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setSuccess('Profile updated successfully! Your AI goal has been regenerated based on your new information.');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        // Handle both string and object errors
        if (typeof errorData.detail === 'string') {
          setError(errorData.detail);
        } else if (Array.isArray(errorData.detail)) {
          setError(errorData.detail.map((err: any) => err.msg || err.message || JSON.stringify(err)).join(', '));
        } else {
          setError('Profile update failed. Please check your information.');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg">
        <Navbar title="Loading..." />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="Edit Profile" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Edit Your Profile
          </h1>
          <p className="text-xl text-gray-600">
            Update your information and get a new AI-generated goal
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Physical Info */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="13"
                  max="120"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="30"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="100"
                  max="250"
                  step="0.1"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  value={formData.activity_level}
                  onChange={(e) => handleInputChange('activity_level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="sedentary">Sedentary (little/no exercise)</option>
                  <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                  <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                  <option value="extra_active">Extra Active (very hard exercise, physical job)</option>
                </select>
              </div>
            </div>

            {/* Current Goal Display */}
            {user.goal && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Current AI Goal</h3>
                <p className="text-blue-700 mb-2">{user.goal.goal_description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-blue-600">
                  <div>Target Calories: {user.goal.target_calories_per_day}/day</div>
                  <div>Target Exercise: {user.goal.target_exercise_minutes_per_week}min/week</div>
                  <div>Target Sleep: {user.goal.target_sleep_hours}h/day</div>
                  <div>Goal Type: {user.goal.goal_type}</div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Updating Profile...' : 'Update Profile & Regenerate Goal'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔄 Your AI goal will be automatically regenerated based on your updated profile</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

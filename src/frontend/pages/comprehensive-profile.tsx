import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const ComprehensiveProfile: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    age: 25,
    gender: 'male',
    weight: 70,
    height: 170,
    activity_level: 'moderately_active',
    
    // Health Goals
    primary_health_goal: 'lose_weight',
    motivation: 'general_health',
    lifestyle_vision: 'balanced_lifestyle',
    
    // Intellectual Interests
    intellectual_interests: [] as string[],
    learning_style: 'visual',
    time_availability: 'moderate',
    
    // Personalization
    nickname: '',
    avatar: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const intellectualCategories = [
    'Science', 'Art', 'Technology', 'Psychology', 'History', 
    'Literature', 'Design', 'Philosophy', 'Mathematics', 'Music'
  ];

  const healthGoals = [
    { value: 'lose_weight', label: 'Lose Weight' },
    { value: 'gain_weight', label: 'Gain Weight' },
    { value: 'gain_muscle', label: 'Gain Muscle' },
    { value: 'maintain_weight', label: 'Maintain Weight' },
    { value: 'improve_fitness', label: 'Improve Fitness' },
    { value: 'better_nutrition', label: 'Better Nutrition' },
    { value: 'other', label: 'Other (specify below)' }
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little/no exercise)' },
    { value: 'lightly_active', label: 'Lightly Active (light exercise 1-3 days/week)' },
    { value: 'moderately_active', label: 'Moderately Active (moderate exercise 3-5 days/week)' },
    { value: 'very_active', label: 'Very Active (hard exercise 6-7 days/week)' },
    { value: 'extremely_active', label: 'Extremely Active (very hard exercise, physical job)' }
  ];

  const learningStyles = [
    { value: 'visual', label: 'Visual (videos, diagrams, charts)' },
    { value: 'auditory', label: 'Auditory (podcasts, discussions)' },
    { value: 'reading', label: 'Reading (books, articles, text)' },
    { value: 'hands_on', label: 'Hands-on (practical, interactive)' },
    { value: 'other', label: 'Other (specify below)' }
  ];

  const timeAvailability = [
    { value: 'minimal', label: 'Minimal (15-30 min/day)' },
    { value: 'moderate', label: 'Moderate (30-60 min/day)' },
    { value: 'extensive', label: 'Extensive (1-2 hours/day)' }
  ];

  const motivationOptions = [
    { value: 'general_health', label: 'General Health & Wellness' },
    { value: 'energy', label: 'More Energy' },
    { value: 'confidence', label: 'Confidence & Self-esteem' },
    { value: 'longevity', label: 'Long-term Health' },
    { value: 'appearance', label: 'Physical Appearance' },
    { value: 'performance', label: 'Better Performance' },
    { value: 'family', label: 'Family & Loved Ones' },
    { value: 'other', label: 'Other (specify below)' }
  ];

  const lifestyleVisionOptions = [
    { value: 'balanced_lifestyle', label: 'Balanced & Healthy Lifestyle' },
    { value: 'active_lifestyle', label: 'Active & Energetic' },
    { value: 'mindful_lifestyle', label: 'Mindful & Stress-free' },
    { value: 'productive_lifestyle', label: 'Productive & Focused' },
    { value: 'social_lifestyle', label: 'Social & Connected' },
    { value: 'creative_lifestyle', label: 'Creative & Inspired' },
    { value: 'other', label: 'Other (specify below)' }
  ];

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
    const profileData = user.profile || user;
    
    setFormData({
      name: user.name || '',
      age: profileData.age || 25,
      gender: profileData.gender || 'male',
      weight: profileData.weight || 70,
      height: profileData.height || 170,
      activity_level: profileData.activity_level || 'moderately_active',
      primary_health_goal: profileData.primary_health_goal || 'lose_weight',
      motivation: profileData.motivation || 'general_health',
      lifestyle_vision: profileData.lifestyle_vision || 'balanced_lifestyle',
      intellectual_interests: profileData.intellectual_interests || [],
      learning_style: profileData.learning_style || 'visual',
      time_availability: profileData.time_availability || 'moderate',
      nickname: user.nickname || '',
      avatar: user.avatar || ''
    });
  }, [router]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[];
      if (checked) {
        return { ...prev, [field]: [...currentArray, value] };
      } else {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const nextStep = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && 
               formData.age > 0 && 
               formData.weight > 0 && 
               formData.height > 0;
      case 2:
        return formData.primary_health_goal !== '' && 
               formData.motivation !== '' && 
               formData.lifestyle_vision !== '';
      case 3:
        return formData.intellectual_interests.length >= 3 && 
               formData.learning_style !== '' && 
               formData.time_availability !== '';
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all steps
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setError('Please complete all required fields before saving.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://mind-scroll-production.up.railway.app/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.user_id,
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          activity_level: formData.activity_level,
          primary_health_goal: formData.primary_health_goal,
          motivation: formData.motivation,
          lifestyle_vision: formData.lifestyle_vision,
          intellectual_interests: formData.intellectual_interests,
          learning_style: formData.learning_style,
          time_availability: formData.time_availability,
          nickname: formData.nickname,
          avatar: formData.avatar
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update localStorage with new user data
        const updatedUser = {
          ...user,
          name: result.user.name,
          nickname: result.user.nickname,
          avatar: result.user.avatar,
          profile: {
            ...user.profile,
            age: result.user.age,
            gender: result.user.gender,
            weight: result.user.weight,
            height: result.user.height,
            activity_level: result.user.activity_level,
            primary_health_goal: formData.primary_health_goal,
            motivation: formData.motivation,
            lifestyle_vision: formData.lifestyle_vision,
            intellectual_interests: formData.intellectual_interests,
            learning_style: formData.learning_style,
            time_availability: formData.time_availability
          },
          goal: result.goal
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Force a storage event to notify other components
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(updatedUser),
          oldValue: localStorage.getItem('user')
        }));
        
        setSuccess('Profile updated successfully! Your AI goals have been regenerated.');
        
        // Redirect to path selection after a short delay
        setTimeout(() => {
          router.push('/path-selection');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar showUserControls={true} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Edit Your Student Profile
          </h1>
          <p className="text-lg text-gray-600">
            Update your student information to get better personalized study recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div key={i} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div className={`w-12 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                      required
                      min="13"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level *</label>
                    <select
                      value={formData.activity_level}
                      onChange={(e) => handleInputChange('activity_level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      {activityLevels.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg) *</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                      required
                      min="30"
                      max="300"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm) *</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                      required
                      min="100"
                      max="250"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your cool nickname"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar Emoji</label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="💪"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Health Goals */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Health Goals</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Health Goal *</label>
                  <select
                    value={formData.primary_health_goal}
                    onChange={(e) => handleInputChange('primary_health_goal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {healthGoals.map(goal => (
                      <option key={goal.value} value={goal.value}>{goal.label}</option>
                    ))}
                  </select>
                  {formData.primary_health_goal === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify your health goal..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2"
                      onChange={(e) => handleInputChange('primary_health_goal', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What motivates you? *</label>
                  <select
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {motivationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {formData.motivation === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify your motivation..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2"
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Lifestyle Vision *</label>
                  <select
                    value={formData.lifestyle_vision}
                    onChange={(e) => handleInputChange('lifestyle_vision', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {lifestyleVisionOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  {formData.lifestyle_vision === 'other' && (
                    <input
                      type="text"
                      placeholder="Please describe your ideal lifestyle..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2"
                      onChange={(e) => handleInputChange('lifestyle_vision', e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Intellectual Interests */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Interests</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What subjects interest you? (Select 3-4) *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {intellectualCategories.map(category => (
                      <label key={category} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.intellectual_interests.includes(category)}
                          onChange={(e) => handleArrayChange('intellectual_interests', category, e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{category}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Selected: {formData.intellectual_interests.length}/4
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Learning Style *</label>
                  <select
                    value={formData.learning_style}
                    onChange={(e) => handleInputChange('learning_style', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {learningStyles.map(style => (
                      <option key={style.value} value={style.value}>{style.label}</option>
                    ))}
                  </select>
                  {formData.learning_style === 'other' && (
                    <input
                      type="text"
                      placeholder="Please specify your learning style..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mt-2"
                      onChange={(e) => handleInputChange('learning_style', e.target.value)}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time for Learning *</label>
                  <select
                    value={formData.time_availability}
                    onChange={(e) => handleInputChange('time_availability', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {timeAvailability.map(time => (
                      <option key={time.value} value={time.value}>{time.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !validateStep(1) || !validateStep(2) || !validateStep(3)}
                  className="px-8 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : 'Save Profile & Regenerate Goals'}
                </button>
              )}
            </div>

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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveProfile;

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

interface User {
  user_id: string;
  name: string;
  nickname?: string;
  avatar?: string;
  goal: any;
}

const DataEntry: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'food' | 'exercise' | 'lifestyle'>('food');
  
  // Food data
  const [foodInput, setFoodInput] = useState('');
  const [foodList, setFoodList] = useState<string[]>([]);
  const [foodImage, setFoodImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Exercise data
  const [exerciseInput, setExerciseInput] = useState('');
  const [exerciseList, setExerciseList] = useState<string[]>([]);
  
  // Lifestyle data
  const [lifestyleData, setLifestyleData] = useState({
    sleep_hours: 8,
    screen_time: 6,
    stress_level: 5,
    water_intake: 8
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    setUser(user);
    
    // Load existing data
    const existingFood = JSON.parse(localStorage.getItem('userFoodData') || '[]');
    const existingExercise = JSON.parse(localStorage.getItem('userExerciseData') || '[]');
    const existingLifestyle = JSON.parse(localStorage.getItem('userLifestyleData') || '{}');
    
    setFoodList(existingFood);
    setExerciseList(existingExercise);
    setLifestyleData({ ...lifestyleData, ...existingLifestyle });
  }, [router]);

  const addFood = () => {
    if (foodInput.trim()) {
      const newFoodList = [...foodList, foodInput.trim()];
      setFoodList(newFoodList);
      setFoodInput('');
      localStorage.setItem('userFoodData', JSON.stringify(newFoodList));
    }
  };

  const removeFood = (index: number) => {
    const newFoodList = foodList.filter((_, i) => i !== index);
    setFoodList(newFoodList);
    localStorage.setItem('userFoodData', JSON.stringify(newFoodList));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFoodImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFoodImage = async () => {
    if (!foodImage) return;
    
    setIsAnalyzingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', foodImage);
      
      const response = await fetch('http://localhost:8000/api/food/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.upgrade_required) {
          // Show upgrade message
          alert(`Vision analysis requires OpenAI Pro plan. ${result.message}`);
          // Still add the sample items for demonstration
          if (result.foodItems && result.foodItems.length > 0) {
            const newFoodList = [...foodList, ...result.foodItems];
            setFoodList(newFoodList);
            localStorage.setItem('userFoodData', JSON.stringify(newFoodList));
            setFoodImage(null);
            setImagePreview(null);
          }
        } else if (result.free_model && result.foodItems && result.foodItems.length > 0) {
          // Show feedback interface instead of auto-adding
          setAnalysisResults(result);
          setShowFeedback(true);
        } else if (result.foodItems && result.foodItems.length > 0) {
          // Show feedback interface for other models too
          setAnalysisResults(result);
          setShowFeedback(true);
        }
      } else {
        console.error('Failed to analyze image');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const clearImage = () => {
    setFoodImage(null);
    setImagePreview(null);
    setAnalysisResults(null);
    setShowFeedback(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setFoodImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const confirmAnalysis = () => {
    if (analysisResults && analysisResults.foodItems) {
      const newFoodList = [...foodList, ...analysisResults.foodItems];
      setFoodList(newFoodList);
      localStorage.setItem('userFoodData', JSON.stringify(newFoodList));
      clearImage();
    }
  };

  const rejectAnalysis = () => {
    setShowFeedback(false);
    setAnalysisResults(null);
    // Keep the image for re-analysis or manual entry
  };

  const addManualFood = (foodName: string) => {
    if (foodName.trim()) {
      // Send feedback to improve AI
      if (analysisResults && analysisResults.image_info) {
        sendFeedback(analysisResults.foodItems, foodName.trim());
      }
      
      const newFoodList = [...foodList, foodName.trim()];
      setFoodList(newFoodList);
      localStorage.setItem('userFoodData', JSON.stringify(newFoodList));
      clearImage();
    }
  };

  const sendFeedback = async (aiPrediction: string[], userCorrection: string) => {
    try {
      const feedbackData = {
        image_hash: analysisResults?.image_info?.hash || 'unknown',
        ai_prediction: aiPrediction,
        user_correction: userCorrection,
        image_info: analysisResults?.image_info || {}
      };
      
      const response = await fetch('http://localhost:8000/api/food/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      
      if (response.ok) {
        console.log('✅ Feedback sent successfully - AI will learn from this correction!');
      } else {
        console.log('❌ Failed to send feedback');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const addExercise = () => {
    if (exerciseInput.trim()) {
      const newExerciseList = [...exerciseList, exerciseInput.trim()];
      setExerciseList(newExerciseList);
      setExerciseInput('');
      localStorage.setItem('userExerciseData', JSON.stringify(newExerciseList));
    }
  };

  const removeExercise = (index: number) => {
    const newExerciseList = exerciseList.filter((_, i) => i !== index);
    setExerciseList(newExerciseList);
    localStorage.setItem('userExerciseData', JSON.stringify(newExerciseList));
  };

  const updateLifestyle = (field: string, value: number) => {
    const newLifestyleData = { ...lifestyleData, [field]: value };
    setLifestyleData(newLifestyleData);
    localStorage.setItem('userLifestyleData', JSON.stringify(newLifestyleData));
  };

  const isAllDataComplete = () => {
    return foodList.length > 0 && exerciseList.length > 0 && lifestyleData.sleep_hours > 0;
  };

  const runAIAnalysis = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/generate-personalized-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.user_id,
          meals: foodList,
          exercises: exerciseList,
          lifestyle: lifestyleData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('AI Analysis Complete:', data);
        // Navigate to dashboard to see results
        router.push('/dashboard');
      } else {
        throw new Error('Failed to generate analysis');
      }
    } catch (error) {
      console.error('Error running AI analysis:', error);
      alert('Failed to generate analysis. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: "url('/data/ExerciseDietPicture.jpg')",
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10">
        <Navbar showUserControls={true} />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">{user.avatar || '💪'}</span>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Track Your Student Progress, {user.nickname || user.name}! 📊
              </h1>
              <p className="text-lg text-gray-200 mt-1">
                Log your daily student activities to get personalized study insights
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setActiveSection('food')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeSection === 'food'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🍽️ Student Meals {foodList.length > 0 && <span className="text-green-300">✓</span>}
            </button>
            <button
              onClick={() => setActiveSection('exercise')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeSection === 'exercise'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏃 Student Activity {exerciseList.length > 0 && <span className="text-green-300">✓</span>}
            </button>
            <button
              onClick={() => setActiveSection('lifestyle')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeSection === 'lifestyle'
                  ? 'bg-purple-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              😴 Student Lifestyle {lifestyleData.sleep_hours > 0 && <span className="text-green-300">✓</span>}
            </button>
          </div>
        </div>

        {/* Food Section */}
        {activeSection === 'food' && (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">🍽️</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                Log Your Student Meals
                {foodList.length > 0 && <span className="ml-2 text-green-500">✓</span>}
              </h2>
              <p className="text-gray-600">Track what you eat during your study day</p>
            </div>
            
            <div className="space-y-4">
              {/* Manual Entry */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={foodInput}
                  onChange={(e) => setFoodInput(e.target.value)}
                  placeholder="e.g., Grilled chicken with rice"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addFood()}
                />
                <button
                  onClick={addFood}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Add
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500 text-sm">OR</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="text-center">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div 
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                        isDragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="text-4xl mb-2">📸</div>
                      <p className="text-gray-600 font-medium">
                        {isDragOver ? 'Drop your food image here' : 'Take a photo of your food'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Click to upload or drag and drop
                      </p>
                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700">
                        ✅ Free AI food recognition available
                      </div>
                    </div>
                  </label>
                </div>

                {/* Image Preview */}
                {imagePreview && !showFeedback && (
                  <div className="space-y-3">
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Food preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <button
                      onClick={analyzeFoodImage}
                      disabled={isAnalyzingImage}
                      className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50"
                    >
                      {isAnalyzingImage ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Analyzing Food...
                        </div>
                      ) : (
                        '🔍 Analyze Food Image'
                      )}
                    </button>
                  </div>
                )}

                {/* Feedback Interface */}
                {showFeedback && analysisResults && (
                  <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-blue-900">AI Analysis Results</h3>
                      <button
                        onClick={rejectAnalysis}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-blue-700">
                        AI identified these food items:
                      </p>
                      <div className="space-y-2">
                        {analysisResults.foodItems.map((food: string, index: number) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                            <span className="font-medium">{food}</span>
                            <span className="text-xs text-gray-500">
                              {analysisResults.detailedAnalysis?.[index]?.confidence 
                                ? `${Math.round(analysisResults.detailedAnalysis[index].confidence * 100)}% confidence`
                                : 'AI detected'
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={confirmAnalysis}
                        className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                      >
                        ✅ Add These Foods
                      </button>
                      <button
                        onClick={rejectAnalysis}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                      >
                        ❌ Not Correct
                      </button>
                    </div>

                    {/* Re-analyze Option */}
                    <div className="text-center">
                      <button
                        onClick={() => {
                          setShowFeedback(false);
                          setAnalysisResults(null);
                          analyzeFoodImage();
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm underline"
                      >
                        🔄 Re-analyze Image
                      </button>
                    </div>

                    {/* Manual Entry Option */}
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 mb-2">Or enter the correct food manually:</p>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="e.g., boiled egg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addManualFood((e.target as HTMLInputElement).value);
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = (e.target as HTMLButtonElement).parentElement?.querySelector('input') as HTMLInputElement;
                            if (input) {
                              addManualFood(input.value);
                            }
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add & Learn
                        </button>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        🧠 AI will learn from your correction to improve future predictions
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {foodList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Today's Meals:</h3>
                  {foodList.map((food, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-800">{food}</span>
                      <button
                        onClick={() => removeFood(index)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exercise Section */}
        {activeSection === 'exercise' && (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">🏃</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                Track Your Student Activity
                {exerciseList.length > 0 && <span className="ml-2 text-green-500">✓</span>}
              </h2>
              <p className="text-gray-600">Record your physical activities and study breaks</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exerciseInput}
                  onChange={(e) => setExerciseInput(e.target.value)}
                  placeholder="e.g., 30-minute jog"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && addExercise()}
                />
                <button
                  onClick={addExercise}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Add
                </button>
              </div>
              
              {exerciseList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Today's Exercises:</h3>
                  {exerciseList.map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-800">{exercise}</span>
                      <button
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle Section */}
        {activeSection === 'lifestyle' && (
          <div className="card max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-4xl mb-4 block">😴</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                Student Lifestyle Data
                {lifestyleData.sleep_hours > 0 && <span className="ml-2 text-green-500">✓</span>}
              </h2>
              <p className="text-gray-600">Monitor your student habits and study wellness</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Hours: {lifestyleData.sleep_hours} hours
                </label>
                <input
                  type="range"
                  min="0"
                  max="12"
                  value={lifestyleData.sleep_hours}
                  onChange={(e) => updateLifestyle('sleep_hours', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screen Time: {lifestyleData.screen_time} hours
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={lifestyleData.screen_time}
                  onChange={(e) => updateLifestyle('screen_time', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level: {lifestyleData.stress_level}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={lifestyleData.stress_level}
                  onChange={(e) => updateLifestyle('stress_level', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Water Intake: {lifestyleData.water_intake} glasses
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={lifestyleData.water_intake}
                  onChange={(e) => updateLifestyle('water_intake', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mt-8 mb-6">
          <div className="card max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Data Completion Status
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className={`text-center p-3 rounded-lg ${foodList.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="text-2xl mb-1">🍽️</div>
                <div className="text-sm font-medium">Food</div>
                <div className="text-xs">{foodList.length > 0 ? `${foodList.length} items` : 'No data'}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${exerciseList.length > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="text-2xl mb-1">🏃</div>
                <div className="text-sm font-medium">Exercise</div>
                <div className="text-xs">{exerciseList.length > 0 ? `${exerciseList.length} activities` : 'No data'}</div>
              </div>
              <div className={`text-center p-3 rounded-lg ${lifestyleData.sleep_hours > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'}`}>
                <div className="text-2xl mb-1">😴</div>
                <div className="text-sm font-medium">Lifestyle</div>
                <div className="text-xs">{lifestyleData.sleep_hours > 0 ? 'Complete' : 'Incomplete'}</div>
              </div>
            </div>
            {!isAllDataComplete() && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Complete all three sections to enable AI analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push('/goal-homepage')}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            ← Back to Goals
          </button>
          
          <button
            onClick={runAIAnalysis}
            disabled={isLoading || !isAllDataComplete()}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing...
              </div>
            ) : isAllDataComplete() ? (
              'Get Student AI Analysis →'
            ) : (
              'Complete All Sections First'
            )}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DataEntry;

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const FoodInput: React.FC = () => {
  const router = useRouter();
  const [meals, setMeals] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const addMeal = () => {
    setMeals([...meals, '']);
  };

  const updateMeal = (index: number, value: string) => {
    const newMeals = [...meals];
    newMeals[index] = value;
    setMeals(newMeals);
  };

  const removeMeal = (index: number) => {
    if (meals.length > 1) {
      const newMeals = meals.filter((_, i) => i !== index);
      setMeals(newMeals);
    }
  };

  const handleSubmit = async () => {
    const validMeals = meals.filter(meal => meal.trim() !== '');
    if (validMeals.length === 0) {
      alert('Please enter at least one meal');
      return;
    }

    setIsLoading(true);
    try {
      // Store in localStorage for now (in production, this would go to a database)
      localStorage.setItem('userFoodData', JSON.stringify(validMeals));
      router.push('/exercise-input');
    } catch (error) {
      console.error('Error saving food data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="🍎 Food Input" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What did you eat today?
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your meals so our AI can analyze your nutrition
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={meal}
                    onChange={(e) => updateMeal(index, e.target.value)}
                    placeholder={`Meal ${index + 1} (e.g., "Avocado toast with eggs", "Grilled chicken salad")`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {meals.length > 1 && (
                  <button
                    onClick={() => removeMeal(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={addMeal}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Another Meal
            </button>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Back
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Next: Exercise →'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tip: Be as specific as possible for better AI analysis</p>
        </div>
      </div>
    </div>
  );
};

export default FoodInput;

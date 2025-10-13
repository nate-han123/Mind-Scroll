import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const ExerciseInput: React.FC = () => {
  const router = useRouter();
  const [exercises, setExercises] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, '']);
  };

  const updateExercise = (index: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = value;
    setExercises(newExercises);
  };

  const removeExercise = (index: number) => {
    if (exercises.length > 1) {
      const newExercises = exercises.filter((_, i) => i !== index);
      setExercises(newExercises);
    }
  };

  const handleSubmit = async () => {
    const validExercises = exercises.filter(exercise => exercise.trim() !== '');
    if (validExercises.length === 0) {
      alert('Please enter at least one exercise activity');
      return;
    }

    setIsLoading(true);
    try {
      // Store in localStorage for now (in production, this would go to a database)
      localStorage.setItem('userExerciseData', JSON.stringify(validExercises));
      router.push('/lifestyle-input');
    } catch (error) {
      console.error('Error saving exercise data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="💪 Exercise Input" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What exercises did you do?
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your physical activities so our AI can track your fitness
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={exercise}
                    onChange={(e) => updateExercise(index, e.target.value)}
                    placeholder={`Exercise ${index + 1} (e.g., "30-minute jog", "3 sets of pushups", "Yoga class")`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                {exercises.length > 1 && (
                  <button
                    onClick={() => removeExercise(index)}
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
              onClick={addExercise}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              + Add Another Exercise
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
              {isLoading ? 'Saving...' : 'Next: Lifestyle →'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tip: Include duration and intensity for better analysis</p>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInput;

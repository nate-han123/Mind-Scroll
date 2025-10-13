import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

const LifestyleInput: React.FC = () => {
  const router = useRouter();
  const [sleepHours, setSleepHours] = useState<number>(8);
  const [screenTime, setScreenTime] = useState<number>(4);
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const lifestyleData = {
        sleep_hours: sleepHours,
        screen_time: screenTime,
        stress_level: stressLevel
      };
      
      // Store in localStorage for now (in production, this would go to a database)
      localStorage.setItem('userLifestyleData', JSON.stringify(lifestyleData));
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving lifestyle data:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar title="🌱 Lifestyle Input" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How was your day?
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your lifestyle habits so our AI can assess your wellness
          </p>
        </div>

        <div className="card max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Sleep Hours */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                😴 How many hours did you sleep last night?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-2xl font-bold text-primary-600 min-w-[3rem] text-center">
                  {sleepHours}h
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>3h</span>
                <span>12h</span>
              </div>
            </div>

            {/* Screen Time */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                📱 How many hours of screen time did you have?
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="16"
                  value={screenTime}
                  onChange={(e) => setScreenTime(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-2xl font-bold text-primary-600 min-w-[3rem] text-center">
                  {screenTime}h
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0h</span>
                <span>16h</span>
              </div>
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-4">
                😌 How stressed did you feel today? (1 = Very Relaxed, 10 = Very Stressed)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stressLevel}
                  onChange={(e) => setStressLevel(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-2xl font-bold text-primary-600 min-w-[3rem] text-center">
                  {stressLevel}
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Very Relaxed</span>
                <span>Very Stressed</span>
              </div>
            </div>
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
              {isLoading ? 'Saving...' : 'Generate Summary →'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>💡 Tip: Be honest for the most accurate wellness assessment</p>
        </div>
      </div>
    </div>
  );
};

export default LifestyleInput;

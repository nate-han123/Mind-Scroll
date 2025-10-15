import React, { useState } from 'react';
import { interestCategories } from './fallbackData';

const InterestSelector = ({ user, onInterestsSelected }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 4) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      alert('Please select at least 3 interests to continue');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to get personalized content
    setTimeout(() => {
      onInterestsSelected(selectedInterests);
      setIsLoading(false);
    }, 1000);
  };

  const getInterestIcon = (interest) => {
    const icons = {
      'Science': '🔬',
      'Art': '🎨',
      'Technology': '💻',
      'Psychology': '🧠',
      'History': '📚',
      'Literature': '📖',
      'Design': '🎨',
      'Philosophy': '🤔',
      'Mathematics': '📐',
      'Music': '🎵'
    };
    return icons[interest] || '💡';
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <span className="text-6xl mr-4">💡</span>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Study Path
              </h1>
              <p className="text-xl text-gray-600">
                {user ? `Welcome ${user.nickname || user.name}! ` : ''}Discover your academic interests
              </p>
            </div>
          </div>
        </div>

        {/* Interest Selection */}
        <div className="card max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              What subjects interest you? 🎯
            </h2>
            <p className="text-gray-600 mb-6">
              Select 3-4 subjects that spark your academic curiosity. We'll personalize your study journey.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Selected:</strong> {selectedInterests.length}/4 interests
              </p>
            </div>
          </div>

          {/* Interest Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {interestCategories.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 4}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedInterests.includes(interest)
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                    : selectedInterests.length >= 4
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                <div className="text-3xl mb-2">{getInterestIcon(interest)}</div>
                <div className="text-sm font-medium">{interest}</div>
                {selectedInterests.includes(interest) && (
                  <div className="text-blue-500 text-lg mt-1">✓</div>
                )}
              </button>
            ))}
          </div>

          {/* Selected Interests Display */}
          {selectedInterests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Selected Interests:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center"
                  >
                    {getInterestIcon(interest)} {interest}
                    <button
                      onClick={() => handleInterestToggle(interest)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={selectedInterests.length < 3 || isLoading}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedInterests.length >= 3 && !isLoading
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Finding your content...
                </div>
              ) : (
                `Continue with ${selectedInterests.length} interests →`
              )}
            </button>
            
            {selectedInterests.length < 3 && (
              <p className="text-sm text-gray-500 mt-2">
                Please select at least 3 interests to continue
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestSelector;

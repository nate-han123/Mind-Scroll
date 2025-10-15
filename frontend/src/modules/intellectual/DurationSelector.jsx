import React, { useState } from 'react';

const DurationSelector = ({ onDurationSelected, onCancel }) => {
  const [selectedDuration, setSelectedDuration] = useState('short');

  const durationOptions = [
    { value: 'short', label: 'Short Videos (Under 4 minutes)', description: 'Quick educational content' },
    { value: 'medium', label: 'Medium Videos (4-20 minutes)', description: 'In-depth explanations' },
    { value: 'long', label: 'Long Videos (20+ minutes)', description: 'Comprehensive tutorials' },
    { value: 'any', label: 'Any Duration', description: 'Mix of all video lengths' }
  ];

  const handleSubmit = () => {
    onDurationSelected(selectedDuration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">⏱️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Video Duration Preference</h2>
          <p className="text-gray-600">
            How long would you like your educational videos to be?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {durationOptions.map((option) => (
            <label
              key={option.value}
              className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedDuration === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="duration"
                value={option.value}
                checked={selectedDuration === option.value}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedDuration === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedDuration === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DurationSelector;

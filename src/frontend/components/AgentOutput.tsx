import React from 'react';
import { FoodAgentOutput, ExerciseAgentOutput, LifestyleAgentOutput } from '../utils/api';

interface AgentOutputProps {
  agent: 'food' | 'exercise' | 'lifestyle';
  data: FoodAgentOutput | ExerciseAgentOutput | LifestyleAgentOutput;
}

const AgentOutput: React.FC<AgentOutputProps> = ({ agent, data }) => {
  const getAgentConfig = () => {
    // Determine color based on performance
    let performanceColor = 'green'; // Default to good
    let bgColor = 'bg-green-50';
    let borderColor = 'border-green-200';
    let textColor = 'text-green-700';
    
    if (agent === 'food') {
      const score = (data as FoodAgentOutput).nutrition_score;
      if (score < 4) {
        performanceColor = 'red';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-200';
        textColor = 'text-red-700';
      } else if (score < 7) {
        performanceColor = 'yellow';
        bgColor = 'bg-yellow-50';
        borderColor = 'border-yellow-200';
        textColor = 'text-yellow-700';
      }
    } else if (agent === 'exercise') {
      const calories = (data as ExerciseAgentOutput).calories_burned;
      if (calories < 100) {
        performanceColor = 'red';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-200';
        textColor = 'text-red-700';
      } else if (calories < 300) {
        performanceColor = 'yellow';
        bgColor = 'bg-yellow-50';
        borderColor = 'border-yellow-200';
        textColor = 'text-yellow-700';
      }
    } else if (agent === 'lifestyle') {
      const score = (data as LifestyleAgentOutput).wellness_score;
      if (score < 4) {
        performanceColor = 'red';
        bgColor = 'bg-red-50';
        borderColor = 'border-red-200';
        textColor = 'text-red-700';
      } else if (score < 7) {
        performanceColor = 'yellow';
        bgColor = 'bg-yellow-50';
        borderColor = 'border-yellow-200';
        textColor = 'text-yellow-700';
      }
    }
    
    switch (agent) {
      case 'food':
        return {
          title: '🍎 Food Agent',
          icon: '🍎',
          color: 'success' as const,
          bgColor,
          borderColor,
          textColor,
          performanceColor
        };
      case 'exercise':
        return {
          title: '💪 Exercise Agent',
          icon: '💪',
          color: 'primary' as const,
          bgColor,
          borderColor,
          textColor,
          performanceColor
        };
      case 'lifestyle':
        return {
          title: '🌱 Lifestyle Agent',
          icon: '🌱',
          color: 'secondary' as const,
          bgColor,
          borderColor,
          textColor,
          performanceColor
        };
    }
  };

  const config = getAgentConfig();
  const foodData = agent === 'food' ? data as FoodAgentOutput : null;
  const exerciseData = agent === 'exercise' ? data as ExerciseAgentOutput : null;
  const lifestyleData = agent === 'lifestyle' ? data as LifestyleAgentOutput : null;

  return (
    <div className={`card ${config.bgColor} ${config.borderColor} border animate-slide-up`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{config.icon}</span>
          <h3 className={`text-lg font-semibold ${config.textColor}`}>{config.title}</h3>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          config.performanceColor === 'green' ? 'bg-green-100 text-green-800' :
          config.performanceColor === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {config.performanceColor === 'green' ? 'Good' :
           config.performanceColor === 'yellow' ? 'Fair' : 'Needs Attention'}
        </div>
      </div>
      
      <div className="space-y-3">
        {foodData && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Calories</span>
              <span className={`font-semibold ${config.textColor}`}>{foodData.calories}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nutrition Score</span>
              <span className={`font-semibold ${config.textColor}`}>{foodData.nutrition_score}/10</span>
            </div>
            <div className="text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
              {foodData.comment}
            </div>
          </>
        )}
        
        {exerciseData && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Calories Burned</span>
              <span className={`font-semibold ${config.textColor}`}>{exerciseData.calories_burned}</span>
            </div>
            <div className="text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
              {exerciseData.note}
            </div>
          </>
        )}
        
        {lifestyleData && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Wellness Score</span>
              <span className={`font-semibold ${config.textColor}`}>{lifestyleData.wellness_score}/10</span>
            </div>
            <div className="text-sm text-gray-700 bg-white/50 p-3 rounded-lg">
              {lifestyleData.advice}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AgentOutput;

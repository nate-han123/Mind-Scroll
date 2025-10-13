import React from 'react';
import { FoodAgentOutput, ExerciseAgentOutput, LifestyleAgentOutput } from '../utils/api';

interface AgentOutputProps {
  agent: 'food' | 'exercise' | 'lifestyle';
  data: FoodAgentOutput | ExerciseAgentOutput | LifestyleAgentOutput;
}

const AgentOutput: React.FC<AgentOutputProps> = ({ agent, data }) => {
  const getAgentConfig = () => {
    switch (agent) {
      case 'food':
        return {
          title: '🍎 Food Agent',
          icon: '🍎',
          color: 'success' as const,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'exercise':
        return {
          title: '💪 Exercise Agent',
          icon: '💪',
          color: 'primary' as const,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'lifestyle':
        return {
          title: '🌱 Lifestyle Agent',
          icon: '🌱',
          color: 'secondary' as const,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
    }
  };

  const config = getAgentConfig();
  const foodData = agent === 'food' ? data as FoodAgentOutput : null;
  const exerciseData = agent === 'exercise' ? data as ExerciseAgentOutput : null;
  const lifestyleData = agent === 'lifestyle' ? data as LifestyleAgentOutput : null;

  return (
    <div className={`card ${config.bgColor} ${config.borderColor} border animate-slide-up`}>
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-3">{config.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{config.title}</h3>
      </div>
      
      <div className="space-y-3">
        {foodData && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Calories</span>
              <span className="font-semibold text-green-700">{foodData.calories}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nutrition Score</span>
              <span className="font-semibold text-green-700">{foodData.nutrition_score}/10</span>
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
              <span className="font-semibold text-blue-700">{exerciseData.calories_burned}</span>
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
              <span className="font-semibold text-purple-700">{lifestyleData.wellness_score}/10</span>
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

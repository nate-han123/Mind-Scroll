import React from 'react';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  comment?: string;
  score?: number;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  subtitle,
  comment,
  score,
  color = 'primary',
  className = ''
}) => {
  const colorClasses = {
    primary: 'border-primary-200 bg-primary-50',
    secondary: 'border-secondary-200 bg-secondary-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const textColorClasses = {
    primary: 'text-primary-700',
    secondary: 'text-secondary-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    info: 'text-blue-700'
  };

  return (
    <div className={`card card-hover ${colorClasses[color]} ${className} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-lg font-semibold ${textColorClasses[color]}`}>
          {title}
        </h3>
        {score !== undefined && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${textColorClasses[color]} bg-white/50`}>
            {score}/10
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className={`text-3xl font-bold ${textColorClasses[color]} mb-1`}>
          {value}
        </div>
        {subtitle && (
          <div className="text-sm text-gray-600">
            {subtitle}
          </div>
        )}
      </div>
      
      {comment && (
        <div className="text-sm text-gray-700 leading-relaxed">
          {comment}
        </div>
      )}
    </div>
  );
};

export default SummaryCard;

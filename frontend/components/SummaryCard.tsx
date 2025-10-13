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
  // Determine color based on score if provided
  let actualColor = color;
  if (score !== undefined) {
    if (score >= 8) {
      actualColor = 'success';
    } else if (score >= 6) {
      actualColor = 'warning';
    } else {
      actualColor = 'info'; // Use info for low scores (red-ish)
    }
  }

  const colorClasses = {
    primary: 'border-primary-200 bg-primary-50',
    secondary: 'border-secondary-200 bg-secondary-50',
    success: 'border-green-200 bg-green-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-red-200 bg-red-50'
  };

  const textColorClasses = {
    primary: 'text-primary-700',
    secondary: 'text-secondary-700',
    success: 'text-green-700',
    warning: 'text-yellow-700',
    info: 'text-red-700'
  };

  return (
    <div className={`card card-hover ${colorClasses[actualColor]} ${className} animate-fade-in`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className={`text-lg font-semibold ${textColorClasses[actualColor]}`}>
          {title}
        </h3>
        {score !== undefined && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            actualColor === 'success' ? 'bg-green-100 text-green-800' :
            actualColor === 'warning' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {score}/10
          </div>
        )}
      </div>
      
      <div className="mb-3">
        <div className={`text-3xl font-bold ${textColorClasses[actualColor]} mb-1`}>
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

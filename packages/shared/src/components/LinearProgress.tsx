import React from 'react';

interface LinearProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  className?: string;
}

const LinearProgress: React.FC<LinearProgressProps> = ({
  value = 0,
  variant = 'determinate',
  color = 'primary',
  className = ''
}) => {
  const baseClasses = 'w-full bg-gray-200 rounded-full overflow-hidden';
  
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600'
  };

  if (variant === 'indeterminate') {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className={`h-2 ${colorClasses[color]} animate-pulse`} />
      </div>
    );
  }

  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`${baseClasses} ${className}`}>
      <div
        className={`h-2 ${colorClasses[color]} transition-all duration-300 ease-in-out`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

export default LinearProgress;

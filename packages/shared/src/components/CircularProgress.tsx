import React from 'react';

interface CircularProgressProps {
  size?: number;
  className?: string;
  color?: 'primary' | 'secondary';
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 40,
  className = '',
  color = 'primary'
}) => {
  const colorClass = color === 'primary' ? 'text-primary-600' : 'text-secondary-600';
  
  return (
    <div className={`inline-block ${className}`}>
      <svg
        className={`animate-spin ${colorClass}`}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
        />
      </svg>
    </div>
  );
};

export default CircularProgress;

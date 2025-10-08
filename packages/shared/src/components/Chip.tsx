import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium';
  className?: string;
  label?: string;
}

const Chip: React.FC<ChipProps> = ({
  children,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  className = '',
  label
}) => {
  const baseClasses = 'inline-flex items-center font-mono font-medium rounded-full border';
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm'
  };

  const colorClasses = {
    default: variant === 'filled' 
      ? 'bg-gray-100 text-gray-800 border-gray-200' 
      : 'bg-transparent text-gray-800 border-gray-300',
    primary: variant === 'filled'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-transparent text-blue-800 border-blue-300',
    secondary: variant === 'filled'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-transparent text-purple-800 border-purple-300',
    success: variant === 'filled'
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-transparent text-green-800 border-green-300',
    warning: variant === 'filled'
      ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
      : 'bg-transparent text-yellow-800 border-yellow-300',
    error: variant === 'filled'
      ? 'bg-red-100 text-red-800 border-red-200'
      : 'bg-transparent text-red-800 border-red-300',
    info: variant === 'filled'
      ? 'bg-blue-100 text-blue-800 border-blue-200'
      : 'bg-transparent text-blue-800 border-blue-300'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <span className={classes}>
      {label || children}
    </span>
  );
};

export default Chip;

import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  color?: 'primary' | 'secondary' | 'inherit';
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  onClick,
  disabled = false,
  size = 'medium',
  className = '',
  color = 'inherit'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full border-2 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50';
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'border-primary-600 text-primary-600 hover:bg-primary-50',
    secondary: 'border-secondary-600 text-secondary-600 hover:bg-secondary-50',
    inherit: 'border-gray-300 text-gray-700 hover:bg-gray-50'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default IconButton;

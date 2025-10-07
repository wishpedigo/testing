import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'contained';
  size?: 'sm' | 'md' | 'lg' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  color?: 'primary' | 'secondary' | 'inherit';
  fullWidth?: boolean;
  sx?: { [key: string]: any };
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  color = 'primary',
  fullWidth = false,
  sx = {}
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  // Handle variant mapping (contained -> primary)
  const actualVariant = variant === 'contained' ? 'primary' : variant;
  
  const variantClasses = {
    primary: color === 'inherit' 
      ? 'bg-transparent hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-transparent disabled:cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed',
    secondary: color === 'inherit'
      ? 'bg-transparent hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-transparent disabled:cursor-not-allowed'
      : 'bg-pink-600 hover:bg-pink-700 text-white focus:ring-pink-500 disabled:bg-gray-700 disabled:cursor-not-allowed',
    outline: 'border border-gray-600 text-gray-300 hover:bg-gray-700 focus:ring-gray-500 disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    large: 'px-6 py-3 text-lg'
  };
  
  // Handle sx prop styles
  const sxStyles: React.CSSProperties = {};
  if (sx.fontSize) {
    sxStyles.fontSize = sx.fontSize;
  }
  if (sx.padding) {
    sxStyles.padding = sx.padding;
  }
  if (sx.minHeight) {
    sxStyles.minHeight = sx.minHeight;
  }
  if (sx.minWidth) {
    sxStyles.minWidth = sx.minWidth;
  }

  const classes = `${baseClasses} ${variantClasses[actualVariant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      style={sxStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
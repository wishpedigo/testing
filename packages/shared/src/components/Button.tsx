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
  size = 'sm', 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  color = 'primary',
  fullWidth = false,
  sx = {}
}) => {
  const baseClasses = 'font-mono font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed relative';
  
  // Handle variant mapping (contained -> primary)
  const actualVariant = variant === 'contained' ? 'primary' : variant;
  
  const variantClasses = {
    primary: color === 'inherit' 
      ? 'border-2 border-primary-600 text-text-primary disabled:opacity-50'
      : 'border-2 border-primary-600 text-text-primary disabled:bg-gray-400 disabled:border-gray-400',
    secondary: color === 'inherit'
      ? 'border-2 border-secondary-600 text-text-primary  disabled:opacity-50'
      : 'border-2 border-secondary-600 text-text-primary  disabled:bg-gray-400 disabled:border-gray-400',
    outline: 'border-2 border-info-600 text-text-primary disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    large: 'px-6 py-3 text-lg'
  };
  
  // Handle sx prop styles and button background
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
  
  // Add grey background for primary/secondary buttons
  if (actualVariant === 'primary' && color !== 'inherit') {
    sxStyles.backgroundColor = '#AAA'; // bg-secondary grey
  } else if (actualVariant === 'secondary' && color !== 'inherit') {
    sxStyles.backgroundColor = '#AAA'; // bg-secondary grey
  }

  // Add classic raised button shadow effect
  // const shadowClasses = 'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2),inset_0_-1px_0_0_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.3),inset_0_-1px_0_0_rgba(0,0,0,0.3),0_4px_8px_rgba(0,0,0,0.15)] active:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.2),inset_0_-1px_0_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.1)] disabled:shadow-none';

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
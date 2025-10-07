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
  const baseClasses = 'font-mono font-medium transition-all duration-200 focus:outline-none disabled:cursor-not-allowed relative';
  
  // Handle variant mapping (contained -> primary)
  const actualVariant = variant === 'contained' ? 'primary' : variant;
  
  const variantClasses = {
    primary: color === 'inherit' 
      ? 'bg-transparent border-4 border-sunset-orange-600 text-white hover:bg-sunset-orange-600/10 hover:shadow-glow-orange focus:shadow-glow-orange disabled:opacity-50 disabled:shadow-none'
      : 'bg-sunset-orange-600 border-4 border-sunset-orange-600 text-white hover:bg-sunset-orange-500 hover:border-sunset-orange-400 hover:shadow-glow-orange focus:shadow-glow-orange disabled:bg-gray-600 disabled:border-gray-600 disabled:shadow-none',
    secondary: color === 'inherit'
      ? 'bg-transparent border-4 border-sunset-red-600 text-white hover:bg-sunset-red-600/10 hover:shadow-glow-red focus:shadow-glow-red disabled:opacity-50 disabled:shadow-none'
      : 'bg-sunset-red-600 border-4 border-sunset-red-600 text-white hover:bg-sunset-red-500 hover:border-sunset-red-400 hover:shadow-glow-red focus:shadow-glow-red disabled:bg-gray-700 disabled:border-gray-600 disabled:shadow-none',
    outline: 'border-4 border-sunset-purple-600 text-white hover:bg-sunset-purple-600/10 hover:shadow-glow-purple focus:shadow-glow-purple disabled:border-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none'
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

  // Add retro shadow effect
  const shadowClasses = 'shadow-pixel hover:shadow-pixel-lg focus:shadow-pixel-lg disabled:shadow-[2px_2px_0px_theme(colors.gray.800)]';

  const classes = `${baseClasses} ${variantClasses[actualVariant]} ${sizeClasses[size]} ${shadowClasses} ${fullWidth ? 'w-full' : ''} ${className}`;
  
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
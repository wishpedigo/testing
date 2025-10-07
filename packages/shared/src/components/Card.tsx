import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-sunset-navy-800 border-4 border-sunset-orange-600 shadow-pixel p-6 font-mono transition-all duration-200 hover:shadow-pixel-lg hover:border-sunset-orange-500 hover:shadow-glow-orange ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
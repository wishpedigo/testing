import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
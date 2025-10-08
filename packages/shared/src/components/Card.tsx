import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, title }) => {
  return (
    <div 
      className={`border-[1px] border-[#1e3a8a] shadow-sm p-1 rounded-[1px] border-solid font-mono ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {title && (
        <div 
          className="text-white px-2 font-mono text-md py-1 font-bold border-b border-primary-700"
          style={{ background: 'linear-gradient(to right, #1e40af, #1e3a8a)' }}
        >
          {title}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
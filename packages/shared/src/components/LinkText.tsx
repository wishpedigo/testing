import React from 'react';

interface LinkTextProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const LinkText: React.FC<LinkTextProps> = ({ 
  children, 
  href, 
  onClick, 
  className = '' 
}) => {
  const baseClasses = 'text-blue-600 font-semibold font-mono cursor-pointer underline';
  
  const classes = `${baseClasses} ${className}`;
  
  if (href) {
    return (
      <a 
        href={href} 
        className={classes}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }
  
  return (
    <span 
      className={classes}
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export default LinkText;

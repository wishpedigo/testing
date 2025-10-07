import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'false';
  className?: string;
}

const Container: React.FC<ContainerProps> = ({ 
  children, 
  maxWidth = 'lg',
  className = ''
}) => {
  const maxWidthClasses: Record<string, string> = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md', 
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    'false': '',
  };

  const classes = `mx-auto px-4 ${maxWidthClasses[maxWidth] || ''} ${className}`;
  
  return <div className={classes}>{children}</div>;
};

export default Container;

import React from 'react';

interface AppBarProps {
  children: React.ReactNode;
  position?: 'fixed' | 'static' | 'sticky';
  className?: string;
  sx?: { [key: string]: any };
}

const AppBar: React.FC<AppBarProps> = ({ 
  children, 
  position = 'static',
  className = '',
  sx = {}
}) => {
  const positionClasses = {
    fixed: 'fixed top-0 left-0 right-0 z-50',
    static: 'static',
    sticky: 'sticky top-0 z-50',
  };

  // Handle sx prop styles
  const sxClasses = [];
  if (sx.bgcolor) {
    // Convert bgcolor to Tailwind class
    sxClasses.push('bg-primary-500'); // Default to primary blue
  }

  const classes = `bg-gradient-to-r from-primary-500 to-primary-600 border-b-4 border-primary-700 shadow-glow-primary ${positionClasses[position]} ${sxClasses.join(' ')} ${className}`;
  
  return <header className={classes}>{children}</header>;
};

export default AppBar;

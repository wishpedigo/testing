import React from 'react';

interface AppBarProps {
  children: React.ReactNode;
  position?: 'fixed' | 'static' | 'sticky';
  className?: string;
}

const AppBar: React.FC<AppBarProps> = ({ 
  children, 
  position = 'static',
  className = ''
}) => {
  const positionClasses = {
    fixed: 'fixed top-0 left-0 right-0 z-50',
    static: 'static',
    sticky: 'sticky top-0 z-50',
  };

  const classes = ` ${positionClasses[position]} ${className}`;
  
  return <header className={classes}>{children}</header>;
};

export default AppBar;

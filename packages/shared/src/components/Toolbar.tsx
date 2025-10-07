import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ children, className = '' }) => {
  return (
    <nav className={`flex items-center justify-between px-4 py-3 ${className}`}>
      {children}
    </nav>
  );
};

export default Toolbar;

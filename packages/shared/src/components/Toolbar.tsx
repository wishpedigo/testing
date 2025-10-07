import React from 'react';

interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

const Toolbar: React.FC<ToolbarProps> = ({ children, className = '' }) => {
  return (
    <nav className={`flex items-center justify-between px-6 py-4 font-mono ${className}`}>
      {children}
    </nav>
  );
};

export default Toolbar;

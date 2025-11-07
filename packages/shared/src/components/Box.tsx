import React from 'react';

interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Box: React.FC<BoxProps> = ({ children, className = '', onClick, style }) => {
  return (
    <div className={className} onClick={onClick} style={style}>
      {children}
    </div>
  );
};

export default Box;

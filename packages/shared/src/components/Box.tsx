import React from 'react';

interface BoxProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  sx?: { [key: string]: any };
}

const Box: React.FC<BoxProps> = ({ children, className = '', onClick, sx = {} }) => {
  // Handle sx prop styles
  const sxClasses = [];
  if (sx.display === 'flex') {
    sxClasses.push('flex');
  }
  if (sx.alignItems === 'center') {
    sxClasses.push('items-center');
  }
  if (sx.gap) {
    sxClasses.push(`gap-${sx.gap}`);
  }

  const classes = `${sxClasses.join(' ')} ${className}`;

  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

export default Box;

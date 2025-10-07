import React from 'react';

interface GridProps {
  children: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  spacing?: number;
  className?: string;
}

const Grid: React.FC<GridProps> = ({ 
  children, 
  container = false,
  item = false,
  xs,
  sm,
  md,
  lg,
  xl,
  spacing = 0,
  className = ''
}) => {
  let classes = className;

  if (container) {
    classes += ' flex flex-wrap';
    if (spacing > 0) {
      const gapClass = `gap-${spacing * 2}`; // Convert MUI spacing to Tailwind
      classes += ` ${gapClass}`;
    }
  }

  if (item) {
    const widthClasses = [
      xs && `w-${xs}/12`,
      sm && `sm:w-${sm}/12`, 
      md && `md:w-${md}/12`,
      lg && `lg:w-${lg}/12`,
      xl && `xl:w-${xl}/12`,
    ].filter(Boolean).join(' ');

    classes += ` ${widthClasses}`;
  }

  return <div className={classes}>{children}</div>;
};

export default Grid;

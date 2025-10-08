import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  className?: string;
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'text.primary' | 'text.secondary';
  gutterBottom?: boolean;
  paragraph?: boolean;
  sx?: { [key: string]: any };
}

const Typography: React.FC<TypographyProps> = ({ 
  children, 
  variant = 'body1', 
  component,
  className = '',
  color = 'textPrimary',
  gutterBottom = false,
  paragraph = false,
  sx = {}
}) => {
  // Map typography variants to Tailwind classes with pixel fonts for headings
  const variantClasses = {
    h1: 'text-4xl font-bold font-pixel text-shadow-[2px_2px_0px_#ff6b35]',
    h2: 'text-3xl font-bold font-pixel text-shadow-[2px_2px_0px_#ff6b35]',
    h3: 'text-2xl font-bold font-pixel text-shadow-[1px_1px_0px_#ff6b35]',
    h4: 'text-xl font-bold font-mono',
    h5: 'text-lg font-semibold font-mono',
    h6: 'text-base font-semibold font-mono',
    body1: 'text-base font-mono',
    body2: 'text-sm font-mono',
    caption: 'text-xs font-mono',
  };

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    textPrimary: 'text-text-primary',
    textSecondary: 'text-text-secondary',
    'text.primary': 'text-text-primary',
    'text.secondary': 'text-text-secondary',
  };

  // Determine the HTML element
  let Component = component;
  if (!Component) {
    switch (variant) {
      case 'h1': Component = 'h1'; break;
      case 'h2': Component = 'h2'; break;
      case 'h3': Component = 'h3'; break;
      case 'h4': Component = 'h4'; break;
      case 'h5': Component = 'h5'; break;
      case 'h6': Component = 'h6'; break;
      case 'body1':
      case 'body2': Component = paragraph ? 'p' : 'span'; break;
      case 'caption': Component = 'span'; break;
      default: Component = 'span';
    }
  }

  // Handle sx prop styles
  const sxClasses = [];
  if (sx.flexGrow) {
    sxClasses.push('flex-1');
  }
  if (sx.display === 'flex') {
    sxClasses.push('flex');
  }
  if (sx.alignItems === 'center') {
    sxClasses.push('items-center');
  }
  if (sx.gap) {
    sxClasses.push(`gap-${sx.gap}`);
  }

  const classes = `${variantClasses[variant]} ${colorClasses[color]} ${gutterBottom ? 'mb-4' : ''} ${paragraph ? 'mb-4' : ''} ${sxClasses.join(' ')} ${className}`;

  return React.createElement(Component, { className: classes }, children);
};

export default Typography;

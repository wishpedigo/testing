import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  sx?: { [key: string]: any };
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  children,
  size = 'medium',
  className = '',
  sx = {}
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-medium overflow-hidden';
  
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`;

  const style: React.CSSProperties = {
    width: sx.width,
    height: sx.height,
    ...sx
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={classes}
        style={style}
      />
    );
  }

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

export default Avatar;

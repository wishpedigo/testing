import React from 'react';

interface MenuItemProps {
  children: React.ReactNode;
  value?: string | number;
  disabled?: boolean;
  className?: string;
}

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  value,
  disabled = false,
  className = ''
}) => {
  return (
    <option
      value={value}
      disabled={disabled}
      className={`font-mono ${className}`}
    >
      {children}
    </option>
  );
};

export default MenuItem;

import React from 'react';

interface SelectProps {
  children: React.ReactNode;
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Select: React.FC<SelectProps> = ({
  children,
  value,
  onChange,
  label,
  disabled = false,
  className = '',
  fullWidth = false,
  size = 'md'
}) => {
  const baseClasses = 'font-mono border-2 border-gray-300 bg-white text-gray-900 rounded focus:outline-none focus:border-primary-600 disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-3 py-2 text-base',
    lg: 'px-4 py-3 text-lg'
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={classes}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;

import React from 'react';

interface TextFieldProps {
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  placeholder?: string;
  className?: string;
  name?: string;
  autoComplete?: string;
  margin?: 'normal' | 'dense' | 'none';
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error = false,
  helperText,
  fullWidth = false,
  required = false,
  placeholder,
  className = '',
  name,
  autoComplete,
  margin = 'normal',
}) => {
  const inputClasses = `
    w-full px-4 py-3 bg-sunset-navy-700 border-4 font-mono text-white placeholder-gray-400
    focus:outline-none focus:border-sunset-orange-600 focus:shadow-glow-orange
    transition-all duration-200
    ${error ? 'border-sunset-red-600 shadow-glow-red' : 'border-gray-600'}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  const marginClasses = {
    normal: 'mb-4',
    dense: 'mb-2',
    none: 'mb-0',
  };

  return (
    <div className={`${marginClasses[margin]} ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-mono font-medium text-white mb-2">
          {label}
          {required && <span className="text-sunset-orange-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        name={name}
        autoComplete={autoComplete}
        className={inputClasses}
      />
      {helperText && (
        <p className={`text-xs mt-1 font-mono ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;

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
    w-full px-3 py-2 bg-gray-800 border rounded-lg
    text-white placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? 'border-red-500' : 'border-gray-600'}
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
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
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
        <p className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;

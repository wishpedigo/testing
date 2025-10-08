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
    w-[97%] px-2 py-2 bg-white font-mono text-text-primary placeholder-text-muted
    border-t-2 border-l-2 border-r-0 border-b-0 border-gray-400
    focus:outline-none
    ${error ? 'border-t-error-600 border-l-error-600 border-r-0 border-b-0' : ''}
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
        <label className="block text-sm font-mono font-medium text-text-primary mb-2">
          {label}
          {required && <span className="text-primary-600 ml-1">*</span>}
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
        <p className={`text-xs mt-1 font-mono ${error ? 'text-error-600' : 'text-text-muted'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default TextField;

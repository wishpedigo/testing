import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  severity?: 'error' | 'warning' | 'info' | 'success';
  className?: string;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ 
  children, 
  severity = 'info',
  className = '',
  onClose
}) => {
  const severityClasses = {
    error: 'bg-sunset-navy-700 border-4 border-sunset-red-600 text-white shadow-glow-red',
    warning: 'bg-sunset-navy-700 border-4 border-sunset-orange-600 text-white shadow-glow-orange',
    info: 'bg-sunset-navy-700 border-4 border-sunset-purple-600 text-white shadow-glow-purple',
    success: 'bg-sunset-navy-700 border-4 border-sunset-green-600 text-white shadow-glow-green',
  };

  const iconClasses = {
    error: 'text-sunset-red-600',
    warning: 'text-sunset-orange-600',
    info: 'text-sunset-purple-600',
    success: 'text-sunset-green-600',
  };

  const icons = {
    error: '⚠',
    warning: '⚡',
    info: 'ℹ',
    success: '✓',
  };

  return (
    <div className={`p-4 font-mono shadow-pixel ${severityClasses[severity]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-xl ${iconClasses[severity]}`}>
            {icons[severity]}
          </span>
          <div>{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-white hover:text-gray-300 font-mono text-xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

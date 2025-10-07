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
    error: 'bg-red-900 border-red-700 text-red-200',
    warning: 'bg-yellow-900 border-yellow-700 text-yellow-200',
    info: 'bg-blue-900 border-blue-700 text-blue-200',
    success: 'bg-green-900 border-green-700 text-green-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${severityClasses[severity]} ${className}`}>
      <div className="flex items-center justify-between">
        <div>{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-current hover:opacity-75"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

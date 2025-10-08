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
    error: 'bg-bg-secondary border-4 border-error-600 text-text-primary shadow-glow-error',
    warning: 'bg-bg-secondary border-4 border-warning-600 text-text-primary shadow-glow-warning',
    info: 'bg-bg-secondary border-4 border-info-600 text-text-primary shadow-glow-info',
    success: 'bg-bg-secondary border-4 border-success-600 text-text-primary shadow-glow-success',
  };

  const iconClasses = {
    error: 'text-error-600',
    warning: 'text-warning-600',
    info: 'text-info-600',
    success: 'text-success-600',
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
            className="ml-4 text-text-primary hover:text-text-secondary font-mono text-xl"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;

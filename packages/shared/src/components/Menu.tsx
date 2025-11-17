import React from 'react';

interface MenuProps {
  children: React.ReactNode;
  anchorEl?: HTMLElement | null;
  open?: boolean;
  onClose?: () => void;
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  className?: string;
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Menu: React.FC<MenuProps> = ({
  children,
  anchorEl,
  open = false,
  onClose: _onClose,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  transformOrigin: _transformOrigin = { vertical: 'top', horizontal: 'right' },
  className = ''
}) => {
  if (!open || !anchorEl) return null;

  const getPosition = () => {
    const rect = anchorEl.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    let top = rect.bottom + scrollTop;
    let left = rect.left + scrollLeft;

    if (anchorOrigin.vertical === 'bottom') {
      top = rect.top + scrollTop;
    }

    if (anchorOrigin.horizontal === 'right') {
      left = rect.right + scrollLeft;
    }

    return { top, left };
  };

  const position = getPosition();

  return (
    <div
      className={`fixed z-50 bg-white border border-gray-300 rounded-md shadow-lg min-w-48 ${className}`}
      style={{
        top: position.top,
        left: position.left
      }}
    >
      {children}
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export { Menu, MenuItem };

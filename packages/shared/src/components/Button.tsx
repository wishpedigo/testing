import React from 'react';
import { Button as MuiButton, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  label?: string;
}

const Button: React.FC<CustomButtonProps> = ({ label, children, ...props }) => {
  return (
    <MuiButton {...props}>
      {label || children}
    </MuiButton>
  );
};

export default Button;


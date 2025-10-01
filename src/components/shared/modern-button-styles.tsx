"use client";

import React from 'react';
import { Button, ButtonProps } from 'antd';
import { motion } from 'framer-motion';

// Modern button style configurations
export const modernButtonStyles = {
  primary: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    height: '44px',
    padding: '0 24px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
    },
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
    }
  },
  secondary: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '2px solid #667eea',
    color: '#667eea',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    height: '44px',
    padding: '0 24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#ffffff',
      borderColor: '#667eea',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
    }
  },
  ghost: {
    background: 'transparent',
    border: '2px solid rgba(102, 126, 234, 0.3)',
    color: '#667eea',
    borderRadius: '12px',
    fontWeight: 500,
    fontSize: '14px',
    height: '40px',
    padding: '0 20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'rgba(102, 126, 234, 0.1)',
      borderColor: '#667eea',
      color: '#667eea',
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
    }
  },
  success: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16a34a 100%)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    height: '44px',
    padding: '0 24px',
    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
      boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(34, 197, 94, 0.2)',
    }
  },
  warning: {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 600,
    fontSize: '14px',
    height: '44px',
    padding: '0 24px',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
      transform: 'translateY(-2px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:focus': {
      boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)',
    }
  }
};

// Modern Button Component with animations
interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'success' | 'warning';
  animated?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  animated = true,
  icon,
  children,
  style,
  className,
  ...props
}) => {
  const baseStyle = modernButtonStyles[variant];
  
  const buttonStyle = {
    ...baseStyle,
    ...style,
  };

  const ButtonComponent = animated ? motion.button : 'button';

  return (
    <Button
      {...props}
      style={buttonStyle}
      className={`modern-button modern-button-${variant} ${className || ''}`}
      icon={icon}
    >
      {children}
    </Button>
  );
};

// Specialized button components for different use cases
export const EnrollButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="primary" {...props} />
);

export const ViewDetailsButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="secondary" {...props} />
);

export const RegisterButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="success" {...props} />
);

export const ApplyButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="warning" {...props} />
);

export const ReadMoreButton: React.FC<Omit<ModernButtonProps, 'variant'>> = (props) => (
  <ModernButton variant="ghost" {...props} />
);

// CSS for additional hover effects and animations
export const modernButtonCSS = `
  .modern-button {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .modern-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .modern-button:hover::before {
    left: 100%;
  }

  .modern-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  .modern-button:disabled:hover {
    transform: none !important;
    box-shadow: inherit !important;
  }

  .modern-button-primary {
    color: white;
  }

  .modern-button-secondary {
    color: #667eea;
  }

  .modern-button-secondary:hover {
    color: white;
  }

  .modern-button-ghost {
    color: #667eea;
  }

  .modern-button-success {
    color: white;
  }

  .modern-button-warning {
    color: white;
  }

  @media (max-width: 768px) {
    .modern-button {
      height: 40px !important;
      font-size: 13px !important;
      padding: 0 20px !important;
    }
  }

  @media (max-width: 480px) {
    .modern-button {
      height: 36px !important;
      font-size: 12px !important;
      padding: 0 16px !important;
    }
  }
`;

// Utility function to get button styles for inline use
export const getModernButtonStyle = (variant: keyof typeof modernButtonStyles) => {
  return modernButtonStyles[variant];
};

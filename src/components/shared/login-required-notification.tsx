"use client";
import React from 'react';
import { notification, Button } from 'antd';
import { LoginOutlined, UserOutlined } from '@ant-design/icons';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

interface LoginRequiredNotificationProps {
  message?: string;
  description?: string;
  duration?: number;
  redirectUrl?: string;
  router?: AppRouterInstance;
}

export const showLoginRequiredNotification = ({
  message = "Authentication Required",
  description = "Please log in to enroll in courses and access premium features.",
  duration = 6,
  redirectUrl,
  router
}: LoginRequiredNotificationProps = {}) => {
  // Get current URL if no redirect URL is provided
  const currentUrl = redirectUrl || (typeof window !== 'undefined' ? window.location.href : '/');
  const encodedRedirectUrl = encodeURIComponent(currentUrl);

const handleSignIn = () => {
    notification.destroy();
    if (router) {
      router.push(`/login?callbackUrl=${encodedRedirectUrl}`);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/login?callbackUrl=${encodedRedirectUrl}`;
    }
  };

const handleSignUp = () => {
    notification.destroy();
    if (router) {
      router.push(`/signup?callbackUrl=${encodedRedirectUrl}`);
    } else if (typeof window !== 'undefined') {
      window.location.href = `/signup?callbackUrl=${encodedRedirectUrl}`;
    }
  };

notification.open({
    message: (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontWeight: 600,
        fontSize: '16px'
      }}>
        <UserOutlined style={{ color: '#667eea' }} />
        {message}
      </div>
    ),
    description: (
      <div style={{ marginTop: '8px' }}>
        <div style={{ 
          marginBottom: '12px',
          color: '#6b7280',
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          {description}
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleSignIn}
            size="small"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 500,
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
          >
            Sign In
          </Button>
          <Button
            icon={<UserOutlined />}
            onClick={handleSignUp}
            size="small"
            style={{
              borderColor: '#667eea',
              color: '#667eea',
              borderRadius: '6px',
              fontWeight: 500
            }}
          >
            Sign Up
          </Button>
        </div>
      </div>
    ),
    placement: 'bottomRight',
    duration: duration,
    style: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
      padding: '16px 20px',
      maxWidth: '380px',
      marginBottom: '24px',
      marginRight: '24px'
    },
    icon: (
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        <UserOutlined />
      </div>
    ),
    closeIcon: (
      <div style={{
        color: '#9ca3af',
        fontSize: '14px',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        transition: 'all 0.2s ease'
      }}>
        ✕
      </div>
    )
  });
};

// Hook for easy usage in components
export const useLoginRequiredNotification = () => {
  const { useRouter } = require('next/navigation');
  const router = useRouter();

return {
    showLoginRequired: (props: Omit<LoginRequiredNotificationProps, 'router'>) => 
      showLoginRequiredNotification({ ...props, router })
  };
};

// Simple wrapper function that uses window.location as fallback
export const showLoginRequiredNotificationSimple = (props: Omit<LoginRequiredNotificationProps, 'router'>) => {
  return showLoginRequiredNotification(props);
};

// Utility function to get current URL for redirect
export const getCurrentUrlForRedirect = () => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return '/';
};

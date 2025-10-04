"use client";

import { message } from "antd";

// Performance-optimized message utility
export const optimizedMessage = {
  success: (content: string, duration: number = 3) => {
    requestAnimationFrame(() => {
      message.success({
        content,
        duration,
        style: {
          marginTop: '20px',
        },
      });
    });
  },
  
  error: (content: string, duration: number = 3) => {
    requestAnimationFrame(() => {
      message.error({
        content,
        duration,
        style: {
          marginTop: '20px',
        },
      });
    });
  },
  
  warning: (content: string, duration: number = 3) => {
    requestAnimationFrame(() => {
      message.warning({
        content,
        duration,
        style: {
          marginTop: '20px',
        },
      });
    });
  },
  
  info: (content: string, duration: number = 3) => {
    requestAnimationFrame(() => {
      message.info({
        content,
        duration,
        style: {
          marginTop: '20px',
        },
      });
    });
  },
};

// Debounced function utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttled function utility
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Performance-optimized setTimeout
export const optimizedSetTimeout = (callback: () => void, delay: number = 0) => {
  return requestAnimationFrame(() => {
    setTimeout(callback, delay);
  });
};


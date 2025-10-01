"use client";

import { useEffect } from 'react';
import { notification } from 'antd';

export default function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Unregister old service workers first
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((reg) => {
          reg.unregister();
        });
      });

      // Register service worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('[SW] Service Worker registered successfully:', registration.scope);

          // Check for updates every hour
          const updateInterval = setInterval(() => {
            registration.update();
          }, 3600000);

          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;

            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available
                  notification.info({
                    message: 'Update Available',
                    description: 'A new version is available. Refresh to update.',
                    duration: 0,
                    btn: (
                      <button
                        onClick={() => {
                          window.location.reload();
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#15b9a1',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Refresh Now
                      </button>
                    ),
                  });
                }
              });
            }
          });

          return () => clearInterval(updateInterval);
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });

      // Online/offline listeners
      const handleOnline = () => {
        console.log('[Network] Back online');
        notification.success({
          message: 'Back Online',
          description: 'Your connection has been restored.',
          placement: 'bottomRight',
        });
      };

      const handleOffline = () => {
        console.log('[Network] Gone offline');
        notification.warning({
          message: 'Offline Mode',
          description: 'You are now offline. Some features may be limited.',
          placement: 'bottomRight',
          duration: 0,
        });
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return <>{children}</>;
}


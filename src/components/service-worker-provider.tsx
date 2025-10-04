"use client";

import { useEffect } from 'react';
import { notification } from 'antd';

export default function ServiceWorkerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Register service worker (or get existing registration)
      navigator.serviceWorker
        .register('/sw.js', { scope: '/', updateViaCache: 'none' })
        .then((registration) => {
          console.log('[SW] Service Worker registered successfully:', registration.scope);

          // Check for updates periodically
          const updateInterval = setInterval(() => {
            registration.update();
          }, 3600000); // 1 hour

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
                    placement: 'bottomRight',
                    btn: (
                      <button
                        onClick={() => {
                          // Skip waiting and reload
                          newWorker.postMessage({ type: 'SKIP_WAITING' });
                          window.location.reload();
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(135deg, #22C55E 0%, #14B8A6 100%)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: 600,
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


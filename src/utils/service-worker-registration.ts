export const registerServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available, prompt user to refresh
                if (confirm('New version available! Reload to update?')) {
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[SW] Service Worker registration failed:', error);
      });
  });
};

export const unregisterServiceWorker = () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  navigator.serviceWorker.ready
    .then((registration) => {
      registration.unregister();
    })
    .catch((error) => {
      console.error('[SW] Error unregistering Service Worker:', error);
    });
};

// Request persistent storage
export const requestPersistentStorage = async () => {
  if (navigator.storage && navigator.storage.persist) {
    const isPersisted = await navigator.storage.persist();
    console.log(`[Storage] Persistent storage granted: ${isPersisted}`);
  }
};

// Check if user is online
export const checkOnlineStatus = () => {
  return navigator.onLine;
};

// Listen for online/offline events
export const setupOnlineStatusListeners = (
  onOnline?: () => void,
  onOffline?: () => void
) => {
  window.addEventListener('online', () => {
    console.log('[Network] Back online');
    onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('[Network] Gone offline');
    onOffline?.();
  });
};


import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  updateServiceWorker: () => void;
}

export const useServiceWorker = (): ServiceWorkerState => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Registrar el service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered:', registration);

          // Verificar si ya está instalado
          if (registration.installing) {
            console.log('Service Worker installing...');
          } else if (registration.waiting) {
            console.log('Service Worker waiting...');
          } else if (registration.active) {
            console.log('Service Worker active');
            setIsInstalled(true);
          }

          // Escuchar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });

          // Escuchar cambios de estado
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('New Service Worker activated');
            setIsInstalled(true);
            setIsUpdateAvailable(false);
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Manejar cambios en el estado de la conexión
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Registrar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Registrar el service worker
    registerServiceWorker();

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Función para actualizar el service worker
  const updateServiceWorker = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    isInstalled,
    isOnline,
    isUpdateAvailable,
    updateServiceWorker,
  };
};

'use client';
import { useServiceWorker } from '../hooks/useServiceWorker';
import { useOfflineData } from '../hooks/useOfflineData';

export const ConnectionStatus = () => {
  const { isInstalled, isOnline, isUpdateAvailable, updateServiceWorker } = useServiceWorker();
  const { isBackendOffline, syncOfflineData } = useOfflineData();

  if (!isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Indicador de estado del backend */}
      <div className="bg-white rounded-lg shadow-lg border p-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${!isBackendOffline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {!isBackendOffline ? 'Backend Online' : 'Backend Offline'}
          </span>
          {isBackendOffline && (
            <span className="text-xs text-gray-500">(Using cached data)</span>
          )}
        </div>
      </div>

      {/* Indicador de conexión a internet */}
      <div className="bg-white rounded-lg shadow-lg border p-3 mb-2">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium">
            {isOnline ? 'Internet Online' : 'Internet Offline'}
          </span>
        </div>
      </div>

      {/* Notificación de actualización disponible */}
      {isUpdateAvailable && (
        <div className="bg-blue-500 text-white rounded-lg shadow-lg p-3 mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Update available</span>
            <button
              onClick={updateServiceWorker}
              className="bg-white text-blue-500 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Botón de sincronización cuando vuelve el backend */}
      {!isBackendOffline && isOnline && (
        <div className="bg-yellow-500 text-white rounded-lg shadow-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Sync cached data</span>
            <button
              onClick={syncOfflineData}
              className="bg-white text-yellow-500 px-2 py-1 rounded text-xs font-medium hover:bg-gray-100"
            >
              Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import { useState, useEffect, useCallback } from 'react';
import { useServiceWorker } from './useServiceWorker';
import { useIndexedDB } from './useIndexedDB';

interface Brand {
  id: number;
  name: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OfflineDataState {
  brands: Brand[];
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  isBackendOffline: boolean;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBrand: (id: number, updates: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  refreshData: () => Promise<void>;
  syncOfflineData: () => Promise<void>;
  checkBackendStatus: () => Promise<boolean>;
}

export const useOfflineData = (): OfflineDataState => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendOffline, setIsBackendOffline] = useState(false);

  const { isOnline } = useServiceWorker();
  const { 
    isReady: isDBReady, 
    addBrand: addBrandToDB, 
    getBrands: getBrandsFromDB, 
    updateBrand: updateBrandInDB, 
    deleteBrand: deleteBrandFromDB 
  } = useIndexedDB();

  // Verificar estado del backend
  const checkBackendStatus = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
      
      const response = await fetch('/api/v1/brands', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setIsBackendOffline(false);
        return true;
      } else {
        setIsBackendOffline(true);
        return false;
      }
    } catch (error) {
      console.log('Backend check failed:', error);
      setIsBackendOffline(true);
      return false;
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    if (isDBReady) {
      loadInitialData();
    }
  }, [isDBReady]);

  // Verificar estado del backend periódicamente
  useEffect(() => {
    const interval = setInterval(checkBackendStatus, 30000); // Cada 30 segundos
    
    return () => clearInterval(interval);
  }, [checkBackendStatus]);

  // Cargar datos iniciales
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar si el backend está disponible
      const isBackendOnline = await checkBackendStatus();
      
      if (isBackendOnline) {
        // Intentar cargar desde la API
        await loadFromAPI();
      } else {
        // Backend caído, cargar desde IndexedDB
        await loadOfflineData();
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
      // Fallback a datos offline
      await loadOfflineData();
    } finally {
      setIsLoading(false);
    }
  }, [checkBackendStatus]);

  // Cargar datos desde la API
  const loadFromAPI = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/brands');
      if (response.ok) {
        const apiBrands = await response.json();
        setBrands(apiBrands);
        
        // Sincronizar con IndexedDB
        await syncToIndexedDB(apiBrands);
        setIsBackendOffline(false);
      } else {
        throw new Error('Failed to fetch brands from API');
      }
    } catch (err) {
      console.log('API request failed, switching to offline mode');
      setIsBackendOffline(true);
      throw new Error('API request failed');
    }
  }, []);

  // Cargar datos offline desde IndexedDB
  const loadOfflineData = useCallback(async () => {
    try {
      const offlineBrands = await getBrandsFromDB();
      setBrands(offlineBrands as Brand[]);
      console.log('Loaded offline data:', offlineBrands.length, 'brands');
    } catch (err) {
      console.error('Error loading offline data:', err);
      setError('Failed to load offline data');
    }
  }, [getBrandsFromDB]);

  // Sincronizar datos con IndexedDB
  const syncToIndexedDB = useCallback(async (brandsData: Brand[]) => {
    try {
      // Limpiar datos existentes y agregar nuevos
      for (const brand of brandsData) {
        await addBrandToDB(brand);
      }
      console.log('Data synced to IndexedDB');
    } catch (err) {
      console.error('Error syncing to IndexedDB:', err);
    }
  }, [addBrandToDB]);

  // Agregar marca
  const addBrand = useCallback(async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setError(null);

      if (!isBackendOffline) {
        // Intentar agregar a la API
        const response = await fetch('/api/v1/brands', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(brand),
        });

        if (response.ok) {
          const newBrand = await response.json();
          setBrands(prev => [...prev, newBrand]);
          await addBrandToDB(newBrand);
        } else {
          throw new Error('Failed to add brand to API');
        }
      } else {
        // Backend caído: agregar solo a IndexedDB
        const newId = await addBrandToDB(brand);
        const newBrand: Brand = {
          ...brand,
          id: newId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setBrands(prev => [...prev, newBrand]);
        console.log('Brand added to IndexedDB (will sync when backend is back)');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isBackendOffline, addBrandToDB]);

  // Actualizar marca
  const updateBrand = useCallback(async (id: number, updates: Partial<Brand>) => {
    try {
      setError(null);

      if (!isBackendOffline) {
        // Intentar actualizar en la API
        const response = await fetch(`/api/v1/brands/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });

        if (response.ok) {
          const updatedBrand = await response.json();
          setBrands(prev => prev.map(brand => 
            brand.id === id ? updatedBrand : brand
          ));
          await updateBrandInDB(id, updates);
        } else {
          throw new Error('Failed to update brand in API');
        }
      } else {
        // Backend caído: actualizar solo en IndexedDB
        await updateBrandInDB(id, updates);
        setBrands(prev => prev.map(brand => 
          brand.id === id ? { ...brand, ...updates, updatedAt: new Date().toISOString() } : brand
        ));
        console.log('Brand updated in IndexedDB (will sync when backend is back)');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isBackendOffline, updateBrandInDB]);

  // Eliminar marca
  const deleteBrand = useCallback(async (id: number) => {
    try {
      setError(null);

      if (!isBackendOffline) {
        // Intentar eliminar de la API
        const response = await fetch(`/api/v1/brands/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setBrands(prev => prev.filter(brand => brand.id !== id));
          await deleteBrandFromDB(id);
        } else {
          throw new Error('Failed to delete brand from API');
        }
      } else {
        // Backend caído: eliminar solo de IndexedDB
        await deleteBrandFromDB(id);
        setBrands(prev => prev.filter(brand => brand.id !== id));
        console.log('Brand deleted from IndexedDB (will sync when backend is back)');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [isBackendOffline, deleteBrandFromDB]);

  // Refrescar datos
  const refreshData = useCallback(async () => {
    const isBackendOnline = await checkBackendStatus();
    
    if (isBackendOnline) {
      await loadFromAPI();
    } else {
      await loadOfflineData();
    }
  }, [checkBackendStatus, loadFromAPI, loadOfflineData]);

  // Sincronizar datos offline cuando vuelve el backend
  const syncOfflineData = useCallback(async () => {
    if (!isBackendOffline) {
      try {
        console.log('Syncing offline data with backend...');
        // Aquí podrías implementar la lógica para sincronizar
        // datos que se crearon/actualizaron offline
        await loadFromAPI();
      } catch (err) {
        console.error('Error syncing offline data:', err);
      }
    }
  }, [isBackendOffline, loadFromAPI]);

  return {
    brands,
    isLoading,
    error,
    isOnline,
    isBackendOffline,
    addBrand,
    updateBrand,
    deleteBrand,
    refreshData,
    syncOfflineData,
    checkBackendStatus,
  };
};

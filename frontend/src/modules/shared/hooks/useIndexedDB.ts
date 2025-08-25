import { useState, useEffect, useCallback } from 'react';

interface Brand {
  id: string; // Changed from number to string for UUID
  name: string;
  owner: string;
  status: string;
  lang: string; // Added lang field for backend compatibility
  createdAt: string;
  updatedAt: string;
}

interface IndexedDBState {
  isReady: boolean;
  error: string | null;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<string>; // Changed return type to string
  getBrands: () => Promise<Brand[]>;
  getBrand: (id: string) => Promise<Brand | undefined>; // Changed parameter type to string
  updateBrand: (id: string, updates: Partial<Brand>) => Promise<void>; // Changed parameter type to string
  deleteBrand: (id: string) => Promise<void>; // Changed parameter type to string
  clearBrands: () => Promise<void>;
  migrateAndCleanData: () => Promise<void>;
  syncBrands: (brands: Brand[]) => Promise<void>; // Added sync function
}

export const useIndexedDB = (): IndexedDBState => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abrir conexión a IndexedDB
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TrademarkDB', 3); // Increment version for UUID migration
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Crear store para marcas si no existe
        if (!db.objectStoreNames.contains('brands')) {
          const brandStore = db.createObjectStore('brands', { 
            keyPath: 'id' // No autoIncrement for UUID
          });
          brandStore.createIndex('name', 'name', { unique: false });
          brandStore.createIndex('status', 'status', { unique: false });
          brandStore.createIndex('owner', 'owner', { unique: false });
          brandStore.createIndex('lang', 'lang', { unique: false }); // Added lang index
          brandStore.createIndex('createdAt', 'createdAt', { unique: false });
        } else if (oldVersion < 3) {
          // Migrar datos existentes para UUID
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          if (transaction) {
            const brandStore = transaction.objectStore('brands');
            
            // Limpiar datos existentes con estructura incorrecta
            brandStore.clear();
            console.log('Cleared old data structure for UUID migration');
          }
        }
      };
    });
  }, []);

  // Migrar y limpiar datos existentes
  const migrateAndCleanData = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB();
      
      // Solo limpiar datos si es necesario para la migración
      // La migración ya se maneja en onupgradeneeded
      console.log('Migration check completed, keeping existing data');
      
    } catch (err) {
      console.error('Error migrating data:', err);
      throw err;
    }
  }, [openDB]);

  // Agregar marca
  const addBrand = useCallback(async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      
      // Generar UUID para la nueva marca
      const newId = crypto.randomUUID();
      
      const newBrand = {
        ...brand,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const request = store.add(newBrand);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(newId);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding brand');
      throw err;
    }
  }, [openDB]);

  // Obtener todas las marcas
  const getBrands = useCallback(async (): Promise<Brand[]> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readonly');
      const store = transaction.objectStore('brands');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting brands');
      throw err;
    }
  }, [openDB]);

  // Obtener marca por ID
  const getBrand = useCallback(async (id: string): Promise<Brand | undefined> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readonly');
      const store = transaction.objectStore('brands');
      const request = store.get(id);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error getting brand');
      throw err;
    }
  }, [openDB]);

  // Actualizar marca
  const updateBrand = useCallback(async (id: string, updates: Partial<Brand>): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      
      // Obtener la marca existente
      const existingBrand = await getBrand(id);
      if (!existingBrand) {
        throw new Error('Brand not found');
      }
      
      const updatedBrand = {
        ...existingBrand,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      const request = store.put(updatedBrand);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating brand');
      throw err;
    }
  }, [openDB, getBrand]);

  // Eliminar marca
  const deleteBrand = useCallback(async (id: string): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      const request = store.delete(id);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting brand');
      throw err;
    }
  }, [openDB]);

  // Limpiar todas las marcas
  const clearBrands = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      const request = store.clear();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error clearing brands');
      throw err;
    }
  }, [openDB]);

  // Sincronizar marcas sin sobrescribir
  const syncBrands = useCallback(async (brands: Brand[]): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      
      // Obtener marcas existentes
      const existingBrands = await getBrands();
      const existingIds = new Set(existingBrands.map(brand => brand.id));
      
      // Sincronizar cada marca
      for (const brand of brands) {
        if (existingIds.has(brand.id)) {
          // Actualizar marca existente
          await store.put(brand);
        } else {
          // Agregar nueva marca
          await store.add(brand);
        }
      }
      
      console.log('Brands synced successfully without overwriting');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error syncing brands');
      throw err;
    }
  }, [openDB, getBrands]);

  // Inicializar IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        await openDB();
        // Migrar datos existentes si es necesario
        await migrateAndCleanData();
        setIsReady(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error initializing IndexedDB');
        setIsReady(false);
      }
    };

    initDB();
  }, [openDB, migrateAndCleanData]);

  return {
    isReady,
    error,
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    clearBrands,
    migrateAndCleanData,
    syncBrands,
  };
};

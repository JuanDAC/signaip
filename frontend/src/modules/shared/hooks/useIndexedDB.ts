import { useState, useEffect, useCallback } from 'react';

interface Brand {
  id: number;
  name: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IndexedDBState {
  isReady: boolean;
  error: string | null;
  addBrand: (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => Promise<number>;
  getBrands: () => Promise<Brand[]>;
  getBrand: (id: number) => Promise<Brand | undefined>;
  updateBrand: (id: number, updates: Partial<Brand>) => Promise<void>;
  deleteBrand: (id: number) => Promise<void>;
  clearBrands: () => Promise<void>;
  migrateAndCleanData: () => Promise<void>;
}

export const useIndexedDB = (): IndexedDBState => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Abrir conexión a IndexedDB
  const openDB = useCallback((): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('TrademarkDB', 2); // Incrementar versión para forzar migración
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const oldVersion = event.oldVersion;
        
        // Crear store para marcas si no existe
        if (!db.objectStoreNames.contains('brands')) {
          const brandStore = db.createObjectStore('brands', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          brandStore.createIndex('name', 'name', { unique: false });
          brandStore.createIndex('status', 'status', { unique: false });
          brandStore.createIndex('owner', 'owner', { unique: false });
          brandStore.createIndex('createdAt', 'createdAt', { unique: false });
        } else if (oldVersion < 2) {
          // Migrar datos existentes
          const transaction = (event.target as IDBOpenDBRequest).transaction;
          if (transaction) {
            const brandStore = transaction.objectStore('brands');
            
            // Limpiar datos existentes con estructura incorrecta
            brandStore.clear();
            console.log('Cleared old data structure for migration');
          }
        }
      };
    });
  }, []);

  // Migrar y limpiar datos existentes
  const migrateAndCleanData = useCallback(async (): Promise<void> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      
      // Limpiar todos los datos existentes
      await store.clear();
      console.log('Data migrated and cleaned successfully');
      
      // Esperar a que la transacción se complete
      return new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (err) {
      console.error('Error migrating data:', err);
      throw err;
    }
  }, [openDB]);

  // Agregar marca
  const addBrand = useCallback(async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> => {
    try {
      const db = await openDB();
      const transaction = db.transaction(['brands'], 'readwrite');
      const store = transaction.objectStore('brands');
      
      const newBrand = {
        ...brand,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const request = store.add(newBrand);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result as number);
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
  const getBrand = useCallback(async (id: number): Promise<Brand | undefined> => {
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
  const updateBrand = useCallback(async (id: number, updates: Partial<Brand>): Promise<void> => {
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
  const deleteBrand = useCallback(async (id: number): Promise<void> => {
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
  };
};

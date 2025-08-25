import { useOfflineData } from '@/modules/shared/hooks/useOfflineData';

export const useBrandList = () => {
    const { 
        brands, 
        isLoading: loading, 
        error,
        isOnline,
        isBackendOffline,
        deleteBrand, 
        updateBrand,
        refreshData 
    } = useOfflineData();

    const handleDelete = async (id: string) => {
        try {
            await deleteBrand(parseInt(id));
        } catch (error) {
            console.error('Failed to delete brand:', error);
            throw error;
        }
    };

    const handleUpdate = async (id: string, newEstado: string) => {
        try {
            await updateBrand(parseInt(id), { status: newEstado });
        } catch (error) {
            console.error('Failed to update brand:', error);
            throw error;
        }
    };

    return { 
        brands, 
        loading, 
        error,
        isOnline,
        isBackendOffline,
        handleDelete, 
        handleUpdate,
        refreshData 
    };
}

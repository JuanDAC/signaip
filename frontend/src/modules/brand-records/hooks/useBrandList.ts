import { useState, useEffect } from 'react';
import { Brand } from '../domain/types';
import { useBrandsTranslation, useCommonTranslation } from '@/modules/shared/hooks/useTranslation';
import { brandAPI } from '../api/brandAPI';

export const useBrandList = () => {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const { t } = useBrandsTranslation();
    const { t: tCommon } = useCommonTranslation();
    
    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const data = await brandAPI.getAll();
                setBrands(data);
            } catch (error) {
                console.error('Failed to fetch brands:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMarcas();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await brandAPI.remove(id);
            setBrands(brands.filter(brand => brand.id !== id));
        } catch (error) {
            console.error('Failed to delete brand:', error);
        }
    };

    const handleUpdate = async (id: string, newEstado: string) => {
        try {
            const updatedBrand = await brandAPI.update(id, { status: newEstado });
            setBrands(brands.map(b => b.id === id ? updatedBrand : b)); 
        } catch (error) {
            console.error('Failed to update brand:', error);
        }
    };

    return { brands, loading, handleDelete, handleUpdate };
}

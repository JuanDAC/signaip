
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOfflineData } from '@/modules/shared/hooks/useOfflineData';
import { useBrandsTranslation } from '@/modules/shared/hooks/useTranslation';

export const useCreateBrandForm = () => {
    const [step, setStep] = useState(1);
    const [brandName, setBrandName] = useState('');
    const [owner, setOwner] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { t } = useBrandsTranslation();
    const { addBrand, isOnline, isBackendOffline } = useOfflineData();

    const handleNext = () => {
        if (step === 1 && brandName) {
            setStep(2);
        } else if (step === 2 && owner) {
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            const lang = location.pathname.split('/').at(1) || 'es';
            await addBrand({ 
                name: brandName, 
                owner: owner, 
                status: 'Pendiente',
                lang: lang
            });
            
            const successMessage = isBackendOffline 
                ? t('success.brandCreatedOffline') || 'Brand created offline. Will sync when backend is back.'
                : t('success.brandCreated');
                
            alert(successMessage);
            router.push('/');
        } catch (error) {
            const errorMessage = isBackendOffline 
                ? t('errors.offlineError') || 'Failed to create brand offline'
                : t('errors.networkError');
                
            alert(errorMessage);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrandName(e.target.value);
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwner(e.target.value);
    };

    return { 
        step, 
        brandName, 
        owner, 
        isSubmitting,
        isOnline,
        isBackendOffline,
        handleBrandNameChange, 
        handleOwnerChange, 
        handleNext, 
        handleBack, 
        handleSubmit 
    };
}

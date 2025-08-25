
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { brandAPI } from '../api/brandAPI';
import { useBrandsTranslation, useCommonTranslation } from '@/modules/shared/hooks/useTranslation';

export const useCreateBrandForm = () => {
    const [step, setStep] = useState(1);
    const [brandName, setBrandName] = useState('');
    const [owner, setOwner] = useState('');
    const router = useRouter();
    const { t } = useBrandsTranslation();
    const { t: tCommon } = useCommonTranslation();

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
        try {
            const lang = location.pathname.split('/').at(1) || 'es';
            await brandAPI.create({ name: brandName, owner: owner, lang: lang, status: 'Pendiente' });
            alert(t('success.brandCreated'));
            router.push('/');
        } catch (error) {
            alert(t('errors.networkError'));
            console.error(error);
        }
    };

    
    const handleBrandNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBrandName(e.target.value);
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOwner(e.target.value);
    };

    return { step, brandName, owner, handleBrandNameChange, handleOwnerChange, handleNext, handleBack, handleSubmit };
}

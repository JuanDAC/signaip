'use client'
import { useState } from 'react';
import { useStepperTranslation } from '@/modules/shared/hooks/useTranslation';

export const Stepper = ({ currentStep }: { currentStep: number }) => {
    const { t } = useStepperTranslation();
    
    const steps = [
        t('step1'),
        t('step2'), 
        t('step3'),
        t('step4')
    ];

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            {steps.map((step, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base ${currentStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}>
                        {index + 1}
                    </div>
                    <span className="ml-0 sm:ml-2 mr-0 sm:mr-4 text-gray-500 text-xs sm:text-sm text-center mt-1 sm:mt-0">{step}</span>
                    {index < steps.length - 1 && (
                        <div className="hidden sm:block h-1 w-12 bg-gray-300 mx-2"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

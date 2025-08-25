'use client';

import { useHeaderTranslation } from '@/modules/shared/hooks/useTranslation';
import { LanguageSelector } from '@/modules/shared/components/LanguageSelector';

export const Header = () => {
    const { t } = useHeaderTranslation();

    return (
        <header className="bg-white p-3 sm:p-4 shadow-sm rounded-lg mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="ml-6 lg:ml-0 flex items-center space-x-2">
                <span className="text-gray-500 text-sm sm:text-base">/</span>
                <span className="text-gray-800 font-semibold text-base sm:text-lg lg:text-xl">{t('title')}</span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
                <LanguageSelector size="sm" />
            </div>
        </header>
    );
};

'use client'
import { Stepper } from './Stepper';
import { useBrandsTranslation, useCommonTranslation } from '@/modules/shared/hooks/useTranslation';

export const CreateBrandForm = () => {
    const { step, brandName, owner, handleBrandNameChange, handleOwnerChange, handleNext, handleBack, handleSubmit } = useCreateBrandForm();
    const { t } = useBrandsTranslation();
    const { t: tCommon } = useCommonTranslation();

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow text-gray-500-lg max-w-2xl mx-auto">
            <Stepper currentStep={step} />
            {step === 1 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-500">{t('form.name')}</h3>
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-gray-700 mb-2 text-sm sm:text-base">{t('form.name')}</label>
                        <input
                            type="text"
                            value={brandName}
                            onChange={handleBrandNameChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder={t('form.name')}
                            required
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={handleNext} className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base">
                            {tCommon('next')} →
                        </button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-500">{t('form.owner')}</h3>
                    <div className="mb-4 sm:mb-6">
                        <label className="block text-gray-700 mb-2 text-sm sm:text-base">{t('form.owner')}</label>
                        <input
                            type="text"
                            value={owner}
                            onChange={handleOwnerChange}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            placeholder={t('form.owner')}
                            required
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                        <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1">
                            {tCommon('back')}
                        </button>
                        <button type="button" onClick={handleNext} className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-600 transition-colors text-sm sm:text-base order-1 sm:order-2">
                            {tCommon('next')} →
                        </button>
                    </div>
                </div>
            )}
            {step === 3 && (
                <div>
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-4 sm:mb-6 text-center text-gray-500">{tCommon('confirm')}</h3>
                    <div className="bg-gray-100 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                        <p className="mb-2 text-gray-500 text-sm sm:text-base"><strong>{t('form.name')}:</strong> {marca}</p>
                        <p className="text-gray-500 text-sm sm:text-base"><strong>{t('form.owner')}:</strong> {titular}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
                        <button type="button" onClick={handleBack} className="bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base order-2 sm:order-1">
                            {tCommon('back')}
                        </button>
                        <button type="submit" className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-600 transition-colors text-sm sm:text-base order-1 sm:order-2">
                            {tCommon('create')}
                        </button>
                    </div>
                </div>
            )}
        </form>
    );
};

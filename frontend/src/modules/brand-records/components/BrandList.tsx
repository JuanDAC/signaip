'use client'
import { useBrandsTranslation, useCommonTranslation } from '@/modules/shared/hooks/useTranslation';
import { useBrandList } from '../hooks/useBrandList';


export const BrandList = () => {
    const { brands, loading, handleDelete, handleUpdate } = useBrandList();
    const { t } = useBrandsTranslation();
    const { t: tCommon } = useCommonTranslation();

    if (loading) return <p>{tCommon('loading')}</p>;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow text-gray-500-md">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">{t('listTitle')}</h3>
                <button className="text-gray-500 hover:text-gray-800 transition-colors self-start sm:self-auto">
                    🔄
                </button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('form.name')}</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('form.owner')}</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('form.status')}</th>
                                    <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{tCommon('actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {brands.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-3 sm:px-6 py-4 text-center text-gray-500 text-sm sm:text-base">
                                            {t('noBrands')}
                                        </td>
                                    </tr>
                                ) : (
                                    brands.map((brand, index) => (
                                        <tr key={brand.id} className="hover:bg-gray-50">
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm sm:text-base">{index + 1}</td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">{brand.name}</td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">{brand.owner}</td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm sm:text-base text-gray-500">{brand.lang}</td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${brand.status === 'Aprobada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {brand.status}
                                                </span>
                                            </td>
                                            <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                                    <button onClick={() => handleDelete(brand.id)} className="text-red-600 hover:text-red-900 text-xs sm:text-sm">
                                                        {t('actions.delete')}
                                                    </button>
                                                    <select
                                                        value={brand.status}
                                                        onChange={(e) => handleUpdate(brand.id, e.target.value)}
                                                        className="border rounded px-2 py-1 text-xs sm:text-sm bg-white"
                                                    >
                                                        <option value="Pendiente">{t('status.pending')}</option>
                                                        <option value="Aprobada">{t('status.active')}</option>
                                                        <option value="Rechazada">{t('status.cancelled')}</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

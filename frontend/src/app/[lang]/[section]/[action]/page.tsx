import { CreateBrandForm } from "@/modules/brand-records/components/CreateBrandForm";
import { LanguageSelector } from "@/modules/shared/components/LanguageSelector";
import { redirect } from "next/navigation";
import { isValidRouteForLang } from '@/modules/shared/i18n/routes';
import { serverTranslation } from "@/modules/shared/i18n/server";

export default async function ActionPage({
  params,
}: {
  params: Promise<{ lang: string; section: string; action: string }>;
}) {
  const { lang, section, action } = await params;


  const { t } = await serverTranslation(lang);
  const { t: tNav } = await serverTranslation(lang, 'routes');

  // Validar que la sección y acción sean válidas para el idioma
  if (!isValidRouteForLang(lang, section, action)) {
    redirect(`/${lang}/${section}`);
  }

  // Renderizar contenido según la sección, acción y idioma
  if (section === 'dashboard') {
    if (action === 'overview' || action === 'vista-general') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tNav('sections.dashboard.actions.overview.title')}
            </h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h2 className="text-xl font-semibold mb-4">
              {t('dashboard.overview.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">150</div>
                <div className="text-sm text-gray-600">
                  {t('dashboard.overview.totalTrademarks')}
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-gray-600">
                  {t('dashboard.overview.activeBrands')}
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">12</div>
                <div className="text-sm text-gray-600">
                  {t('dashboard.overview.pendingBrands')}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  if (section === 'trademark-registration' || section === 'registro-de-marca') {
    if (action === 'create' || action === 'crear') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tNav('sections.trademark-registration.actions.create.description')}
            </h1>
          </div>
          <CreateBrandForm />
        </div>
      );
    }

    if (action === 'edit' || action === 'editar') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {t('brands.edit')}
            </h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <p className="text-gray-600">
              {t('brands.edit')}
            </p>
          </div>
        </div>
      );
    }

  }

  if (section === 'reports' || section === 'reportes') {
    if (action === 'generate' || action === 'generar') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tNav('sections.reports.actions.generate.title')}
            </h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h2 className="text-xl font-semibold mb-4">
              {tNav('sections.reports.actions.generate.title')}
            </h2>
            <p className="text-gray-600">
              {tNav('sections.reports.actions.generate.description')}
            </p>
          </div>
        </div>
      );
    }

    if (action === 'view' || action === 'ver') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tNav('sections.reports.actions.view.title')}
            </h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h2 className="text-xl font-semibold mb-4">
              {tNav('sections.reports.actions.view.title')}
            </h2>
            <p className="text-gray-600">
              {tNav('sections.reports.actions.view.description')}
            </p>
          </div>
        </div>
      );
    }

    if (action === 'export' || action === 'exportar') {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {tNav('sections.reports.actions.export.title')}
            </h1>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h2 className="text-xl font-semibold mb-4">
              {tNav('sections.reports.actions.export.title')}
            </h2>
            <p className="text-gray-600">
              {tNav('sections.reports.actions.export.description')}
            </p>
          </div>
        </div>
      );
    }
  }

  // Fallback para acciones no reconocidas
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {lang === 'en' ? 'Action' : 'Acción'}
        </h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow text-gray-500">
        <p className="text-gray-600">
          {lang === 'en' ? 'Action content' : 'Contenido de la acción'}
        </p>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    // Dashboard actions
    { lang: 'en', section: 'dashboard', action: 'overview' },
    { lang: 'en', section: 'dashboard', action: 'analytics' },
    { lang: 'es', section: 'dashboard', action: 'vista-general' },
    { lang: 'es', section: 'dashboard', action: 'analiticas' },
    // Trademark actions
    { lang: 'en', section: 'trademark-registration', action: 'create' },
    { lang: 'en', section: 'trademark-registration', action: 'edit' },
    { lang: 'en', section: 'trademark-registration', action: 'list' },
    { lang: 'es', section: 'registro-de-marca', action: 'crear' },
    { lang: 'es', section: 'registro-de-marca', action: 'editar' },
    { lang: 'es', section: 'registro-de-marca', action: 'lista' },
    // Reports actions
    { lang: 'en', section: 'reports', action: 'generate' },
    { lang: 'en', section: 'reports', action: 'view' },
    { lang: 'en', section: 'reports', action: 'export' },
    { lang: 'es', section: 'reportes', action: 'generar' },
    { lang: 'es', section: 'reportes', action: 'ver' },
    { lang: 'es', section: 'reportes', action: 'exportar' }
  ];
}

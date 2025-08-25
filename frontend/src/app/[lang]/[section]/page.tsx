import { BrandList } from "@/modules/brand-records/components/BrandList";
import { redirect } from "next/navigation";
import { isValidRouteForLang } from '@/modules/shared/i18n/routes';
import { serverTranslation } from "@/modules/shared/i18n/server";
import Link from "next/link";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ lang: string; section: string }>;
}) {
  const { lang, section } = await params;

  const { t } = await serverTranslation(lang, 'routes');
  const { t: tApp } = await serverTranslation(lang);

  // Validar que la sección sea válida para el idioma
  if (!isValidRouteForLang(lang, section)) {
    redirect(`/${lang}/dashboard`);
  }

  // Renderizar contenido según la sección y el idioma
  if (section === 'dashboard') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('sections.dashboard.title')}
          </h1>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {t('overview.title', 'sections.dashboard.actions')}
            </h3>
            <p className="text-gray-600">
              {t('overview.description', 'sections.dashboard.actions')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {t('analytics.title', 'sections.dashboard.actions')}
            </h3>
            <p className="text-gray-600">
              {t('analytics.description', 'sections.dashboard.actions')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'trademark-registration' || section === 'registro-de-marca') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('sections.trademark-registration.title')}
          </h1>
          <Link href={`/${lang}/${section}/${t('sections.trademark-registration.actions.create.path')}`}>
              <button className="bg-[#df3253] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#d01045] transition-colors shadow-md cursor-pointer">
                  {tApp('brands.create')}
              </button>
          </Link>
        </div>
        <BrandList />
      </div>
    );
  }

  if (section === 'reports' || section === 'reportes') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('sections.reports.title')}
          </h1>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {t('generate.title', 'sections.reports.actions')}
            </h3>
            <p className="text-gray-600">
              {t('generate.description', 'sections.reports.actions')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {t('view.title', 'sections.reports.actions')}
            </h3>
            <p className="text-gray-600">
              {t('view.description', 'sections.reports.actions')}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {t('export.title', 'sections.reports.actions')}
            </h3>
            <p className="text-gray-600">
              {t('export.description', 'sections.reports.actions')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {t('sections.trademark-registration.title')}
        </h1>
      </div>
      <p className="text-gray-600">
        {t('sections.trademark-registration.description')}
      </p>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { lang: 'en', section: 'dashboard' },
    { lang: 'en', section: 'trademark-registration' },
    { lang: 'en', section: 'reports' },
    { lang: 'es', section: 'dashboard' },
    { lang: 'es', section: 'registro-de-marca' },
    { lang: 'es', section: 'reportes' }
  ];
}

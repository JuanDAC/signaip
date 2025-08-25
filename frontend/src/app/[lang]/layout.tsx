import { LanguageProvider } from "@/modules/shared/contexts/LanguageContext";
import { Header } from "@/modules/shared/components/Header";
import { Sidebar } from "@/modules/shared/components/Sidebar";
import { redirect } from "next/navigation";
import { languages, fallbackLng } from '@/modules/shared/i18n/settings';
import { getServerTranslations } from '@/modules/shared/i18n/server';
import { ResponsiveLayout } from "@/modules/shared/components/ResponsiveLayout";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // Validar que el locale sea soportado
  if (!languages.includes(lang)) {
    redirect(`/${fallbackLng}`);
  }

  // Cargar traducciones en el servidor usando el idioma de la URL
  const serverMessages = await getServerTranslations(lang);

  return (
    <LanguageProvider initialLocale={lang} initialMessages={serverMessages}>
      <ResponsiveLayout sidebar={<Sidebar />}>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Header />
          {children}
        </main>
      </ResponsiveLayout>
    </LanguageProvider>
  );
}

export async function generateStaticParams() {
  return languages.map((lng) => ({ lang: lng }))
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  const titles = {
    en: "Brand Manager",
    es: "Gestor de Marcas"
  };
  
  const descriptions = {
    en: "Professional brand management and trademark registration",
    es: "Gestión profesional de marcas y registro de marcas comerciales"
  };

  return {
    title: titles[lang as keyof typeof titles] || titles[fallbackLng],
    description: descriptions[lang as keyof typeof descriptions] || descriptions[fallbackLng],
  };
}

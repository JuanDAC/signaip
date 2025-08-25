import { redirect } from "next/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  
  // Redirigir a la ruta específica del idioma usando la nueva estructura
  if (lang === 'en') {
    redirect('/en/dashboard');
  } else {
    redirect('/es/dashboard');
  }
}

export async function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'es' }
  ];
}

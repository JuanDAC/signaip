import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirigir al idioma por defecto (español)
  redirect('/es');
}

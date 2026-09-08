import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Impulsa · Asistente de proyectos",
  description: "Ordena tu idea y entiende qué antecedentes necesitas para explorar convocatorias y apoyos para proyectos en Chile.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        {children}
      </body>
    </html>
  );
}

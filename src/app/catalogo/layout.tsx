import Link from "next/link";

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return <>
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] px-5 py-6 md:px-10">
      <Link className="font-semibold text-[var(--navy)]" href="/">IP · Impulsa Proyectos</Link>
      <nav aria-label="Navegación principal" className="flex gap-5 text-sm font-semibold text-[var(--blue)]">
        <Link href="/catalogo">Explorar apoyos</Link><Link href="/proyectos">Mis proyectos</Link>
      </nav>
    </header>
    {children}
  </>;
}

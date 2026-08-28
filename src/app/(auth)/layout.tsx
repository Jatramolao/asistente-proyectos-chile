import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]" id="contenido">
      <aside className="hidden bg-[var(--navy)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link className="flex items-center gap-3 font-semibold" href="/">
          <span className="grid size-9 place-items-center rounded-lg bg-white text-sm font-bold text-[var(--navy)]">IP</span>
          Impulsa Proyectos
        </Link>
        <div className="max-w-xl pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#99c9e9]">Tu idea es el punto de partida</p>
          <p className="mt-6 text-4xl font-semibold leading-tight tracking-[-0.045em]">Ordena antecedentes una vez y entiende cómo se reutilizan.</p>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#cbd8e5]">Sin puntajes opacos, sin promesas de adjudicación y siempre con acceso a la fuente oficial.</p>
        </div>
      </aside>
      <section className="grid place-items-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}

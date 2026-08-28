import Link from "next/link";

const steps = [
  ["01", "Describe tu proyecto", "Parte con tus propias palabras. No necesitas conocer fondos ni formularios."],
  ["02", "Confirma antecedentes", "Ordenamos lo entendido y te preguntamos solo lo que cambia el resultado."],
  ["03", "Revisa oportunidades", "Compara condiciones, beneficios, brechas y fuentes oficiales en un solo lugar."],
] as const;

export default function HomePage() {
  return (
    <main id="contenido">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 md:px-10">
        <Link className="group flex items-center gap-3 text-[0.95rem] font-semibold tracking-[-0.02em] text-[var(--navy)]" href="/">
          <span className="grid size-9 place-items-center rounded-lg bg-[var(--navy)] text-sm font-bold text-white transition-transform duration-150 group-active:scale-[0.97]">
            IP
          </span>
          Impulsa Proyectos
        </Link>
        <Link className="rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--navy)] transition-[background-color,transform] duration-150 hover:bg-white active:scale-[0.97]" href="/ingresar">
          Ingresar
        </Link>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-14 md:px-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:pb-24 lg:pt-24">
        <div>
          <p className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--blue)]">
            Orientación para proyectos tecnológicos · Chile
          </p>
          <h1 className="max-w-4xl text-[clamp(3rem,8vw,6.8rem)] font-semibold leading-[0.91] tracking-[-0.065em] text-[var(--navy)]">
            Ordena tu idea. Prepara el camino.
          </h1>
        </div>

        <div className="border-l-2 border-[var(--blue)] pl-6 lg:mb-2">
          <p className="max-w-xl text-lg leading-8 text-[var(--ink-muted)]">
            Convierte una idea inicial en antecedentes reutilizables y descubre qué instrumentos públicos vale la pena revisar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(20,48,79,0.18)] transition-[background-color,transform] duration-150 hover:bg-[#1c426b] active:scale-[0.97]" href="/registro">
              Crear mi proyecto
            </Link>
            <a className="rounded-lg px-4 py-3 text-sm font-semibold text-[var(--blue)] underline decoration-[var(--blue-soft)] decoration-4 underline-offset-4 hover:decoration-[var(--blue)]" href="#como-funciona">
              Ver cómo funciona
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--surface)]" id="como-funciona">
        <div className="mx-auto max-w-7xl px-5 py-14 md:px-10 md:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-muted)]">Un recorrido progresivo</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)] md:text-4xl">Comienza sin saber postular</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--ink-muted)]">La información se construye contigo y queda disponible para distintas convocatorias.</p>
          </div>

          <ol className="grid border-t border-[var(--line-strong)] md:grid-cols-3">
            {steps.map(([number, title, description]) => (
              <li className="border-b border-[var(--line)] py-7 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0" key={number}>
                <span className="font-mono text-xs font-semibold text-[var(--blue)]">{number}</span>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em] text-[var(--navy)]">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-10">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)]">Catálogo piloto: 3 instrumentos</p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Capital Semilla Emprende, Semilla Inicia y Emprendamos Semilla, con vigencia y ámbito declarados.</p>
        </div>
        <p className="max-w-lg rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-xs leading-5 text-[var(--ink-muted)]">
          Esta herramienta centraliza información oficial. No evalúa ni valida documentos y la institución convocante siempre prevalece.
        </p>
      </section>
    </main>
  );
}

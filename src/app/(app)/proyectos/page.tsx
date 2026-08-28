import Link from "next/link";
import { Plus } from "lucide-react";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";

export default async function ProjectsPage() {
  const { userId } = await requireSession();
  const projects = projectRepository(getDb()).list(userId);

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-14" id="contenido">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Espacio de trabajo</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[var(--navy)]">Tus proyectos</h1>
        </div>
        <Link className="flex items-center gap-2 rounded-lg bg-[var(--navy)] px-4 py-3 text-sm font-semibold text-white active:scale-[0.98]" href="/proyectos/nuevo">
          <Plus aria-hidden size={17} /> Nueva idea
        </Link>
      </div>

      {projects.length === 0 ? (
        <section className="mt-10 rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface)] px-6 py-14 text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--navy)]">Tu primera idea puede estar incompleta.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">La ordenaremos en antecedentes reutilizables y mostraremos convocatorias reales como referencia.</p>
          <Link className="mt-7 inline-flex rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white" href="/proyectos/nuevo">Describir mi proyecto</Link>
        </section>
      ) : (
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link className="block rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_10px_30px_rgba(20,48,79,0.05)] transition-transform active:scale-[0.99]" href={`/proyectos/${project.id}`}>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[var(--green)]">Proyecto activo</p>
                <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-[var(--navy)]">{project.name}</h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--ink-muted)]">{project.narrative}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

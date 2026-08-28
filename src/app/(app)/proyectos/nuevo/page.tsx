import Link from "next/link";
import { createProjectAction } from "@/app/actions/projects";
import { ProjectIdeaForm } from "@/components/project-idea-form";

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-10 md:px-10 md:py-16" id="contenido">
      <Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/proyectos">← Mis proyectos</Link>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_15rem]">
        <section>
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Nuevo proyecto · Paso 1</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-[var(--navy)] md:text-5xl">Primero, una idea en tus palabras.</h1>
          <ProjectIdeaForm action={createProjectAction} />
        </section>
        <aside className="border-l border-[var(--line-strong)] pl-6 text-sm leading-6 text-[var(--ink-muted)] lg:mt-20">
          <p className="font-semibold text-[var(--navy)]">No necesitas tener</p>
          <ul className="mt-3 space-y-2">
            <li>— Una empresa constituida</li>
            <li>— Un Canvas terminado</li>
            <li>— Experiencia postulando</li>
            <li>— Un fondo elegido</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}

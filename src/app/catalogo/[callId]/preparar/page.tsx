import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { loadCatalog } from "@/server/services/catalog";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { selectCallAction } from "@/app/actions/projects";

export default async function PrepareCallPage({ params }: { params: Promise<{ callId: string }> }) {
  const { callId } = await params;
  const call = loadCatalog().calls.find(c => c.id === callId);
  if (!call) notFound();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(`/ingresar?oportunidad=${encodeURIComponent(call.id)}`);
  const projects = projectRepository(getDb()).list(session.user.id);
  return <main className="mx-auto max-w-3xl px-5 py-12" id="contenido">
    <Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={`/catalogo/${call.id}`}>← Volver al apoyo</Link>
    <p className="mt-8 text-sm font-semibold text-[var(--green)]">{call.name}</p>
    <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[var(--navy)]">¿Con qué proyecto quieres prepararlo?</h1>
    <p className="mt-4 text-sm leading-7 text-[var(--ink-muted)]">Tus respuestas confirmadas se reutilizan. Guardar este apoyo organiza la preparación y no envía una postulación.</p>
    {projects.length ? <form action={selectCallAction} className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <input type="hidden" name="callId" value={call.id} />
      <label className="text-sm font-semibold" htmlFor="projectId">Elegir uno de mis proyectos</label>
      <select className="mt-3 w-full rounded-lg border border-[var(--line-strong)] bg-white p-3" id="projectId" name="projectId" required>{projects.map(project => <option key={project.id} value={project.id}>{project.name}</option>)}</select>
      <button className="mt-5 rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white" type="submit">Guardar apoyo en este proyecto</button>
    </form> : null}
    <Link className="mt-7 inline-block rounded-lg border border-[var(--line-strong)] px-5 py-3 text-sm font-semibold text-[var(--blue)]" href={`/proyectos/nuevo?oportunidad=${encodeURIComponent(call.id)}`}>Crear un proyecto para este apoyo →</Link>
  </main>;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CircleAlert, FileCheck2 } from "lucide-react";
import { confirmAntecedentAction, removeCallAction } from "@/app/actions/projects";
import { updateChecklistItemAction } from "@/app/actions/checklist";
import { getAntecedentDefinition } from "@/domain/antecedents";
import { getBeginnerProgress } from "@/domain/beginner-guide";
import { buildChecklist, buildChecklistByCall } from "@/domain/checklist";
import { AVAILABILITY_LABELS, benefitLabel, formatCatalogDate, getAvailability, reviewIsDue } from "@/domain/catalog";
import { matchCall } from "@/domain/match";
import type { FundingCall, MatchStatus } from "@/domain/types";
import { ProjectGuide } from "@/components/project-guide";
import { ChecklistView } from "@/components/checklist-view";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";
import { loadCatalog } from "@/server/services/catalog";

const MATCH_LABELS: Record<MatchStatus, string> = {
  compatible_to_review: "Compatible para revisar",
  requires_preparation: "Requiere preparación",
  not_compatible_now: "No compatible actualmente",
  insufficient_information: "Información insuficiente",
  call_not_current: "Condiciones por revisar",
};

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ checklist?: string | string[] }>;
}) {
  const { projectId } = await params;
  const query = await searchParams;
  const activeChecklistView = query.checklist === "transversal" ? "transversal" : "calls";
  const { userId } = await requireSession();
  const projects = projectRepository(getDb());
  const project = projects.getById(userId, projectId);
  if (!project) notFound();

  const antecedents = projects.listAntecedents(userId, projectId);
  const catalog = loadCatalog();
  const selectedIds = projects.listSelectedCalls(userId, projectId);
  const selectedCalls = catalog.calls.filter(call => selectedIds.includes(call.id));
  const preparationCalls = selectedCalls.length ? selectedCalls : catalog.calls;
  const now = new Date();
  const sources = new Map(catalog.sources.map((source) => [source.id, source]));
  const results = preparationCalls.map((call) => ({
    call,
    match: matchCall(call as FundingCall, antecedents, now, catalog.version),
  }));
  const checklistInput = {
    calls: preparationCalls as FundingCall[],
    progress: projects.getChecklistProgress(userId, projectId),
  };
  const checklist = buildChecklist(checklistInput);
  const checklistByCall = buildChecklistByCall(checklistInput);
  const { completed, total } = getBeginnerProgress(antecedents);
  const currentCalls = results.filter(({ call }) => getAvailability(call, now) === "open").length;
  const serviceCount = results.filter(({ call }) => getAvailability(call, now) === "ongoing").length;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12" id="contenido">
      <Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/proyectos">← Mis proyectos</Link>

      <header className="mt-7 border-b border-[var(--line-strong)] pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)]">Proyecto activo · información declarada</p>
            <h1 className="mt-3 break-words text-3xl font-semibold tracking-[-0.05em] text-[var(--navy)] md:text-5xl">{project.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ink-muted)]">{project.narrative}</p>
          </div>
          <div className="min-w-44 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[var(--ink-muted)]">Tu ficha inicial</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--navy)]">{completed} <span className="text-sm font-normal text-[var(--ink-muted)]">de {total} respuestas</span></p>
            <p className="mt-2 text-xs text-[var(--ink-muted)]">Avance de preparación, no de elegibilidad.</p>
          </div>
        </div>
        <nav aria-label="Secciones del proyecto" className="mt-8 flex gap-5 overflow-x-auto text-sm font-semibold">
          <a className="border-b-2 border-[var(--blue)] pb-2 text-[var(--navy)]" href="#antecedentes">Antecedentes</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#oportunidades">Apoyos para preparar</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#checklist">Checklist</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#fuentes">Fuentes</a>
        </nav>
      </header>

      <ProjectGuide action={confirmAntecedentAction} antecedents={antecedents} projectId={projectId} />

      <section className="border-t border-[var(--line-strong)] py-10" id="oportunidades">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--blue)]">Apoyos con fuentes oficiales</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)] text-balance">Fondos y beneficios relacionados</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)] text-pretty">{catalog.coverageNotice}</p>
            <p className="mt-2 text-sm text-[var(--ink-muted)]">En esta vista: {currentCalls} fondos abiertos y {serviceCount} servicios continuos. Consulta la disponibilidad y revisión de cada ficha.</p>
          </div>
          <aside className="border-l-2 border-[var(--green)] pl-4 text-xs leading-5 text-[var(--ink-muted)]">
            <p className="font-semibold text-[var(--navy)]">
              Actualización por oportunidad
            </p>
            <p className="mt-1">Última búsqueda: {formatCatalogDate(catalog.lastDiscoveryAt)}.</p>
            <Link className="underline underline-offset-4" href="/catalogo#cobertura">Ver cobertura y fuentes revisadas</Link>
          </aside>
        </div>

        {currentCalls === 0 && serviceCount === 0 ? <aside className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-[var(--navy)]">No hay apoyos disponibles en esta selección</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Esto no significa que tu idea no pueda recibir apoyo. Puedes completar tu ficha y conocer los requisitos de referencia mientras revisas nuevas oportunidades en las instituciones oficiales.</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-[var(--blue)]">
            <a className="underline underline-offset-4" href="#antecedentes">Preparar mi ficha</a>
            <a className="underline underline-offset-4" href="#fuentes">Consultar las instituciones</a>
          </div>
        </aside> : null}

        <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-sm font-semibold text-[var(--navy)]">{selectedCalls.length ? `Preparando ${selectedCalls.length} ${selectedCalls.length === 1 ? "apoyo elegido" : "apoyos elegidos"}` : "Aún no has elegido un apoyo"}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{selectedCalls.length ? "El checklist se concentra en tu selección. Quitar un apoyo conserva las respuestas y avances guardados." : "Explora las fichas y elige un apoyo para concentrar tu preparación. Por ahora puedes consultar todos los requisitos de referencia."}</p>
          <Link className="mt-3 inline-block text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/catalogo">Explorar y elegir apoyos →</Link>
        </div>

        <div className="mt-8 border-y border-[var(--line-strong)]">
          {results.map(({ call, match }, index) => {
            const primarySource = sources.get(call.sourceIds[0]);
            return (
              <article className="grid gap-5 border-t border-[var(--line)] py-6 first:border-t-0 lg:grid-cols-[13rem_minmax(0,1fr)_16rem]" key={call.id}>
                <div>
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--blue)]">{String(index + 1).padStart(2, "0")} · {call.institutionId}</p>
                  <p className="mt-3 text-xs font-semibold text-[var(--green)]">{AVAILABILITY_LABELS[getAvailability(call, now)]}</p>
                  <span className="mt-3 inline-flex border-l-2 border-[#b98a3d] pl-2 text-[0.7rem] font-semibold text-[#76551e]">Preparación: {MATCH_LABELS[match.status]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--navy)] text-balance">{call.name}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)] text-pretty">{call.benefit.summary}</p>
                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--ink-muted)]">
                    <CircleAlert aria-hidden className="mt-0.5 shrink-0" size={15} />
                    <div>
                      <ul className="space-y-1">{match.reasons.map((reason, reasonIndex) => <li key={reasonIndex}>{reason}</li>)}</ul>
                      <p className="mt-2">{call.closesAt ? `Cierre: ${formatCatalogDate(call.closesAt)} · hora de Chile continental.` : call.scheduleMode === "ongoing" ? "Consulta la atención disponible en la institución." : "Fechas por confirmar."}</p>
                    </div>
                  </div>
                  {match.missingAntecedentKeys.length > 0 ? <details className="mt-4 text-sm text-[var(--ink-muted)]">
                    <summary className="cursor-pointer font-semibold">{match.status === "call_not_current" ? "Datos para preparar una futura revisión" : "Qué datos faltan para orientarte"}</summary>
                    <p className="mt-2 text-xs leading-5">Confirmarlos ayuda a revisar las condiciones; no garantiza admisibilidad.</p>
                    <ul className="mt-2 space-y-2">
                      {match.missingAntecedentKeys.map((key) => <li key={key}><a className="underline underline-offset-4" href={`#antecedent-${key}`}>{getAntecedentDefinition(key).label}</a></li>)}
                    </ul>
                  </details> : null}
                </div>
                <div className="lg:border-l lg:border-[var(--line)] lg:pl-5">
                  <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1">
                    <div><dt className="text-xs text-[var(--ink-muted)]">Beneficio máximo</dt><dd className="mt-1 font-mono font-semibold tabular-nums text-[var(--navy)]">{benefitLabel(call)}</dd></div>
                    <div><dt className="text-xs text-[var(--ink-muted)]">Aporte beneficiario</dt><dd className="mt-1 font-mono font-semibold tabular-nums text-[var(--navy)]">{call.discovery.contribution}</dd></div>
                  </dl>
                  {primarySource ? (
                    <a className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--blue)] underline decoration-[var(--blue-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--blue)]" href={primarySource.officialUrl} rel="noreferrer" target="_blank">
                      Revisar fuente oficial <ArrowUpRight aria-hidden size={15} />
                    </a>
                  ) : null}
                  <Link className="mt-4 block text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={`/catalogo/${call.id}`}>Ver ficha y requisitos completos</Link>
                  {selectedIds.includes(call.id) ? <form action={removeCallAction} className="mt-3"><input type="hidden" name="projectId" value={projectId} /><input type="hidden" name="callId" value={call.id} /><button type="submit" className="text-xs text-[var(--ink-muted)] underline underline-offset-4">Quitar de mi preparación</button></form> : null}
                  <p className="mt-2 text-xs text-[var(--ink-muted)]">{reviewIsDue(call, now) ? "Revisión pendiente" : `Próxima revisión: ${formatCatalogDate(call.editorial.nextReviewAt)}`}</p>
                  <p className="mt-2 text-[0.68rem] leading-4 text-[var(--ink-muted)]">Fuente revisada el {primarySource ? formatCatalogDate(primarySource.reviewedAt) : "—"}.</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--line-strong)] py-10" id="checklist">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--blue)]">Requisitos centralizados</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)] text-balance">Checklist de preparación</h2>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)] text-pretty">Revisa primero lo que pide cada convocatoria o cambia a la vista transversal para reconocer antecedentes reutilizables. El estado guardado es único en ambas vistas.</p>
        </div>
        <ChecklistView action={updateChecklistItemAction} activeView={activeChecklistView} byCall={checklistByCall} calls={preparationCalls as FundingCall[]} projectId={projectId} transversal={checklist} />
      </section>

      <section className="border-t border-[var(--line-strong)] py-10" id="fuentes">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <FileCheck2 aria-hidden className="mt-0.5 shrink-0 text-[var(--green)]" size={20} />
          <div>
            <h2 className="font-semibold text-[var(--navy)]">Trazabilidad del catálogo</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Versión {catalog.version}. Cada ficha conserva su propia fecha de revisión. Cada condición debe confirmarse nuevamente en la institución antes de postular.</p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {catalog.institutions.map((institution) => (
                <li key={institution.id}><a className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={institution.officialUrl} rel="noreferrer" target="_blank">{institution.name}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

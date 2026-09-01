import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CircleAlert, FileCheck2 } from "lucide-react";
import { confirmAntecedentAction } from "@/app/actions/projects";
import { updateChecklistItemAction } from "@/app/actions/checklist";
import { ANTECEDENT_DEFINITIONS, getAntecedentDefinition } from "@/domain/antecedents";
import { buildChecklist, buildChecklistByCall } from "@/domain/checklist";
import { assessCatalogFreshness } from "@/domain/freshness";
import { matchCall } from "@/domain/match";
import type { FundingCall, MatchStatus, ProjectAntecedent } from "@/domain/types";
import { AntecedentField } from "@/components/antecedent-field";
import { ChecklistView } from "@/components/checklist-view";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";
import { loadPilotCatalog } from "@/server/services/catalog";

const PRIORITY_KEYS = [
  "essence.problem",
  "essence.solution",
  "essence.customer",
  "technology.component",
  "technology.maturity",
  "applicant.region",
] as const;

const MATCH_LABELS: Record<MatchStatus, string> = {
  compatible_to_review: "Compatible para revisar",
  requires_preparation: "Requiere preparación",
  not_compatible_now: "No compatible actualmente",
  insufficient_information: "Información insuficiente",
  call_not_current: "Convocatoria no vigente",
};

function formatClp(value: number | null): string {
  if (value === null) return "Monto variable";
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string): string {
  const date = value.length === 10 ? new Date(`${value}T12:00:00-04:00`) : new Date(value);
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "America/Santiago" }).format(date);
}

function missingAntecedent(projectId: string, key: (typeof PRIORITY_KEYS)[number]): ProjectAntecedent {
  return {
    id: `missing-${key}`,
    projectId,
    key,
    value: null,
    confirmationStatus: "missing",
    origin: "manual",
    sourceExcerpt: null,
    updatedAt: new Date(0).toISOString(),
  };
}

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
  const byKey = new Map(antecedents.map((item) => [item.key, item]));
  const priorityAntecedents = PRIORITY_KEYS.map((key) => byKey.get(key) ?? missingAntecedent(projectId, key));
  const additionalAntecedents = antecedents.filter((item) => !PRIORITY_KEYS.includes(item.key as (typeof PRIORITY_KEYS)[number]));
  const catalog = loadPilotCatalog();
  const sources = new Map(catalog.sources.map((source) => [source.id, source]));
  const results = catalog.calls.map((call) => ({
    call,
    match: matchCall(call as FundingCall, antecedents, new Date(), catalog.version),
  }));
  const checklistInput = {
    calls: catalog.calls as FundingCall[],
    progress: projects.getChecklistProgress(userId, projectId),
  };
  const checklist = buildChecklist(checklistInput);
  const checklistByCall = buildChecklistByCall(checklistInput);
  const freshness = assessCatalogFreshness({
    reviewedAt: catalog.reviewedAt,
    callStatuses: catalog.calls.map((call) => call.status),
    now: new Date(),
  });
  const completed = antecedents.filter((item) => ["confirmed", "corrected"].includes(item.confirmationStatus)).length;

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12" id="contenido">
      <Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/proyectos">← Mis proyectos</Link>

      <header className="mt-7 border-b border-[var(--line-strong)] pb-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--green)]">Proyecto activo · información declarada</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[var(--navy)] md:text-5xl">{project.name}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--ink-muted)]">{project.narrative}</p>
          </div>
          <div className="min-w-44 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-[var(--ink-muted)]">Antecedentes confirmados</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--navy)]">{completed} <span className="text-sm font-normal text-[var(--ink-muted)]">de {ANTECEDENT_DEFINITIONS.length}</span></p>
          </div>
        </div>
        <nav aria-label="Secciones del proyecto" className="mt-8 flex gap-5 overflow-x-auto text-sm font-semibold">
          <a className="border-b-2 border-[var(--blue)] pb-2 text-[var(--navy)]" href="#antecedentes">Antecedentes</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#oportunidades">Oportunidades piloto</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#checklist">Checklist</a>
          <a className="pb-2 text-[var(--ink-muted)]" href="#fuentes">Fuentes</a>
        </nav>
      </header>

      <section className="py-10" id="antecedentes">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--blue)]">Ficha transversal</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)]">Confirma lo que entendimos</h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[var(--ink-muted)]">Prioriza estos antecedentes: se reutilizan entre instrumentos y nunca se consideran validados por la plataforma.</p>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {[...priorityAntecedents, ...additionalAntecedents].map((antecedent) => (
            <AntecedentField
              action={confirmAntecedentAction}
              antecedent={antecedent}
              definition={getAntecedentDefinition(antecedent.key)}
              key={antecedent.key}
            />
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line-strong)] py-10" id="oportunidades">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--blue)]">Catálogo oficial piloto</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)] text-balance">Fondos y beneficios relacionados</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)] text-pretty">Estas convocatorias 2026 están cerradas y sirven como referencia. Las condiciones pueden cambiar en una nueva apertura o según el territorio.</p>
          </div>
          <aside className="border-l-2 border-[var(--green)] pl-4 text-xs leading-5 text-[var(--ink-muted)]">
            <p className="font-semibold text-[var(--navy)]">
              {freshness.status === "recently_reviewed" ? "Fuentes revisadas recientemente" : "Revisión de fuentes pendiente"}
            </p>
            <p className="mt-1">Última revisión: {formatDate(catalog.reviewedAt)}.</p>
            <p>Próxima revisión: {formatDate(freshness.nextReviewAt)}.</p>
          </aside>
        </div>

        <div className="mt-8 border-y border-[var(--line-strong)]">
          {results.map(({ call, match }, index) => {
            const primarySource = sources.get(call.sourceIds[0]);
            return (
              <article className="grid gap-5 border-t border-[var(--line)] py-6 first:border-t-0 lg:grid-cols-[13rem_minmax(0,1fr)_16rem]" key={call.id}>
                <div>
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--blue)]">{String(index + 1).padStart(2, "0")} · {call.institutionId}</p>
                  <span className="mt-3 inline-flex border-l-2 border-[#b98a3d] pl-2 text-[0.7rem] font-semibold text-[#76551e]">{MATCH_LABELS[match.status]}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--navy)] text-balance">{call.name}</h3>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)] text-pretty">{call.benefit.summary}</p>
                  <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--ink-muted)]">
                    <CircleAlert aria-hidden className="mt-0.5 shrink-0" size={15} />
                    <p>{match.reasons[0]} Cierre: {formatDate(call.closesAt)}.</p>
                  </div>
                </div>
                <div className="lg:border-l lg:border-[var(--line)] lg:pl-5">
                  <dl className="grid grid-cols-2 gap-3 text-sm lg:grid-cols-1">
                    <div><dt className="text-xs text-[var(--ink-muted)]">Beneficio máximo</dt><dd className="mt-1 font-mono font-semibold tabular-nums text-[var(--navy)]">{formatClp(call.benefit.maximumAmountClp)}</dd></div>
                    <div><dt className="text-xs text-[var(--ink-muted)]">Aporte beneficiario</dt><dd className="mt-1 font-mono font-semibold tabular-nums text-[var(--navy)]">{call.benefit.beneficiaryContributionPercent === null ? "Variable" : `${call.benefit.beneficiaryContributionPercent}%`}</dd></div>
                  </dl>
                  {primarySource ? (
                    <a className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--blue)] underline decoration-[var(--blue-soft)] decoration-2 underline-offset-4 hover:decoration-[var(--blue)]" href={primarySource.officialUrl} rel="noreferrer" target="_blank">
                      Revisar fuente oficial <ArrowUpRight aria-hidden size={15} />
                    </a>
                  ) : null}
                  <p className="mt-2 text-[0.68rem] leading-4 text-[var(--ink-muted)]">Fuente revisada el {primarySource ? formatDate(primarySource.reviewedAt) : "—"}.</p>
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
        <ChecklistView action={updateChecklistItemAction} activeView={activeChecklistView} byCall={checklistByCall} calls={catalog.calls as FundingCall[]} projectId={projectId} transversal={checklist} />
      </section>

      <section className="border-t border-[var(--line-strong)] py-10" id="fuentes">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <FileCheck2 aria-hidden className="mt-0.5 shrink-0 text-[var(--green)]" size={20} />
          <div>
            <h2 className="font-semibold text-[var(--navy)]">Trazabilidad del catálogo</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Versión {catalog.version}, revisada el {formatDate(catalog.reviewedAt)}. Cada condición debe confirmarse nuevamente en la institución antes de postular.</p>
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

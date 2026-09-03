import Link from "next/link";
import { notFound } from "next/navigation";
import { AVAILABILITY_LABELS, benefitLabel, formatCatalogDate, getAvailability, reviewIsDue, supportLabel } from "@/domain/catalog";
import { loadCatalog } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
const stageLabels = { application: "Para postular o acceder", evaluation: "Durante la evaluación", selection: "Si te seleccionan", formalization: "Para formalizar el apoyo" } as const;
const partyLabels = { applicant: "Lo prepara la persona interesada", institution: "Lo verifica la institución", selected_beneficiary: "Solo si resultas seleccionado" } as const;
export default async function CallPage({ params }: { params: Promise<{ callId: string }> }) {
  const { callId } = await params;
  const catalog = loadCatalog();
  const call = catalog.calls.find(c => c.id === callId);
  if (!call) notFound();
  const now = new Date();
  const state = getAvailability(call, now);
  const sources = catalog.sources.filter(s => call.sourceIds.includes(s.id));
  const nextLabel = state === "open" ? "Revisar si corresponde a mi situación" : state === "scheduled" ? "Prepararme para la apertura" : state === "closed" ? "Preparar mi proyecto con esta referencia" : state === "announced" ? "Preparar mi idea para este programa" : "Llevar este apoyo a mi proyecto";
  return <main className="mx-auto max-w-6xl px-5 py-10 md:px-10 md:py-14" id="contenido">
    <Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/catalogo">← Explorar apoyos</Link>
    <header className="mt-8 border-b border-[var(--line-strong)] pb-8">
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--blue)]">{call.institutionId} · {supportLabel(call)}</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.045em] text-[var(--navy)] md:text-5xl">{call.name}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--ink-muted)]">{call.discovery.purpose}</p>
      <p className="mt-5 font-semibold text-[var(--green)]">{AVAILABILITY_LABELS[state]}</p>
      {state === "verify" || reviewIsDue(call, now) ? <p className="mt-3 rounded-lg bg-[#fff4dc] p-4 text-sm text-[#76551e]">La revisión de esta ficha está pendiente. Confirma los datos y eventuales cambios en la institución.</p> : null}
    </header>
    <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-9">
        <section><h2 className="text-2xl font-semibold text-[var(--navy)]">¿Qué recibiría?</h2><p className="mt-3 text-xl font-semibold text-[var(--blue)]">{benefitLabel(call)}</p><p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">{call.benefit.summary}</p>{call.benefit.allowedCosts.length > 0 ? <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--ink-muted)]">{call.benefit.allowedCosts.map(cost => <li key={cost}>{cost}</li>)}</ul> : null}</section>
        <section><h2 className="text-2xl font-semibold text-[var(--navy)]">¿Qué tendría que aportar?</h2><p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">{call.discovery.contribution}</p>{call.benefit.excludedCosts.length > 0 ? <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">No cubre: {call.benefit.excludedCosts.join(" ")}</p> : null}</section>
        <section><h2 className="text-2xl font-semibold text-[var(--navy)]">Condiciones que debes revisar</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-[var(--ink-muted)]">{call.discovery.conditions.map(condition => <li key={condition}>{condition}</li>)}</ul><p className="mt-4 text-xs leading-6 text-[var(--ink-muted)]">Este es un resumen inicial. La institución verifica los requisitos completos y decide el acceso.</p><a className="mt-3 inline-block text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={sources.find(s => s.sourceType === "bases")?.officialUrl ?? sources[0].officialUrl} target="_blank" rel="noreferrer">Leer condiciones completas en la fuente oficial ↗</a></section>
        <section><h2 className="text-2xl font-semibold text-[var(--navy)]">¿Qué necesito preparar?</h2>{Object.entries(stageLabels).map(([stage, label]) => { const requirements = call.requirements.filter(r => r.stage === stage); return requirements.length ? <details className="mt-4 rounded-lg border border-[var(--line)] p-4" open={stage === "application"} key={stage}><summary className="cursor-pointer font-semibold text-[var(--navy)]">{label} · {requirements.length}</summary><ul className="mt-4 space-y-5">{requirements.map(r => <li key={r.id}><h3 className="text-sm font-semibold">{r.label}</h3><p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{r.description}</p><p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">{partyLabels[r.responsibleParty]}. Verificación: {r.verifier}.{r.validity ? ` Vigencia: ${r.validity}.` : ""}</p><div className="mt-2 flex flex-wrap gap-3">{r.sourceIds.map(id => { const source = catalog.sources.find(s => s.id === id)!; return <a key={id} className="text-xs text-[var(--blue)] underline underline-offset-4" href={source.officialUrl} target="_blank" rel="noreferrer">{source.sourceType === "bases" ? "Bases oficiales" : "Fuente oficial"} ↗</a>; })}</div></li>)}</ul></details> : null; })}</section>
      </div>
      <aside className="h-fit rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 lg:sticky lg:top-6">
        <h2 className="text-lg font-semibold text-[var(--navy)]">Tu siguiente paso</h2><p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{state === "verify" ? "Consulta primero la fuente oficial para confirmar que la información sigue vigente." : call.discovery.nextStep}</p>
        <Link className="mt-5 block rounded-lg bg-[var(--navy)] px-4 py-3 text-center text-sm font-semibold text-white" href={`/catalogo/${call.id}/preparar`}>{nextLabel}</Link>
        <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">Podrás crear una cuenta o usar la que ya tienes para guardar este apoyo junto a tu proyecto.</p>
        <a className="mt-5 inline-block text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={sources[0].officialUrl} rel="noreferrer" target="_blank">{state === "verify" ? "Consultar la fuente oficial" : "Ir al sitio de la institución"} ↗</a>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">La postulación o inscripción se realiza en la institución. Aquí preparas tu información.</p>
        <dl className="mt-6 space-y-4 border-t border-[var(--line)] pt-5 text-sm"><div><dt className="font-semibold">Dónde</dt><dd className="mt-1 text-[var(--ink-muted)]">{call.territory}</dd></div><div><dt className="font-semibold">Apertura</dt><dd className="mt-1 text-[var(--ink-muted)]">{call.scheduleMode === "ongoing" ? "Atención continua, consulta disponibilidad" : formatCatalogDate(call.opensAt)}</dd></div><div><dt className="font-semibold">Cierre</dt><dd className="mt-1 text-[var(--ink-muted)]">{call.scheduleMode === "ongoing" ? "Sin cierre único para el servicio" : formatCatalogDate(call.closesAt)}</dd></div></dl>
        <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">Zona: America/Santiago (Chile continental). {call.schedulePrecision === "date" && call.closesAt ? "La fuente registra fecha, sin hora precisa." : ""}</p>
      </aside>
    </div>
    <section className="border-t border-[var(--line-strong)] pt-8" id="fuentes"><h2 className="text-2xl font-semibold text-[var(--navy)]">Fuentes y revisión de esta ficha</h2><p className="mt-3 text-sm leading-7 text-[var(--ink-muted)]">Revisada: {formatCatalogDate(call.editorial.reviewedAt)}. Próxima revisión prevista: {formatCatalogDate(call.editorial.nextReviewAt)}.</p><ul className="mt-4 space-y-4">{sources.map(source => <li key={source.id}><a className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href={source.officialUrl} target="_blank" rel="noreferrer">{source.title} ↗</a><p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">{source.scope} Revisión: {formatCatalogDate(source.reviewedAt)}.</p></li>)}</ul><details className="mt-6 text-xs leading-6 text-[var(--ink-muted)]"><summary className="cursor-pointer font-semibold">Ver registro de actualización</summary><p className="mt-3">Responsable: {call.editorial.owner}. Versión: {call.editorial.version}.</p><p>{call.editorial.evidenceNote}</p><ul>{call.editorial.history.map((item, index) => <li key={index}>{item.date}: {item.change}</li>)}</ul></details></section>
  </main>;
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Check, ChevronDown, ArrowRight, Info, CircleAlert } from "lucide-react";
import type { FundingCall } from "@/domain/types";
import type { PreparationStage } from "@/domain/preparation-journey";
import { PreparationTaskEditor, type PreparationAction } from "./preparation-task";
import { CallResponseEditor } from "./call-response-editor";

function subscribeToStorage(notify: () => void) {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
}

export function PreparationJourney({ projectId, projectName, call, stages, availabilityLabel, warnings, antecedentAction, checklistAction, responseAction, initialStage }: {
  projectId: string;
  projectName: string;
  call: Pick<FundingCall, "id" | "name" | "benefit">;
  stages: PreparationStage[];
  availabilityLabel: string;
  warnings: string[];
  antecedentAction: PreparationAction;
  checklistAction: PreparationAction;
  responseAction?: PreparationAction;
  initialStage?: string;
}) {
  const storageKey = `impulsa:journey:v1:${projectId}:${call.id}`;
  const readStage = useCallback(() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }, [storageKey]);
  const storedStage = useSyncExternalStore(subscribeToStorage, readStage, () => null);
  const [chosenStage, setChosenStage] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dirty = useRef(false);
  const stageHeading = useRef<HTMLHeadingElement>(null);
  const defaultStage = stages.find(stage => !stage.future && stage.completed < stage.tasks.length) ?? stages.filter(stage => !stage.future).at(-1)!;
  const activeStage = stages.find(stage => stage.id === (chosenStage ?? initialStage ?? storedStage)) ?? defaultStage;
  const activeIndex = stages.indexOf(activeStage);
  const nextTask = activeStage.tasks.find(task => !task.complete);
  const activeTaskId = expandedTask ?? nextTask?.id;
  const stageComplete = activeStage.tasks.length > 0 && activeStage.completed === activeStage.tasks.length;
  const recordUrl = `?view=record&call=${encodeURIComponent(call.id)}`;

  useEffect(() => {
    function warnBeforeUnload(event: BeforeUnloadEvent) {
      if (!dirty.current) return;
      event.preventDefault();
      event.returnValue = true;
    }
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => window.removeEventListener("beforeunload", warnBeforeUnload);
  }, []);

  function mayLeave() {
    return !saving && (!dirty.current || window.confirm("Tienes cambios sin guardar. ¿Quieres salir de esta tarea y descartarlos?"));
  }

  function rememberStage(stageId: string) {
    setChosenStage(stageId);
    try { localStorage.setItem(storageKey, stageId); } catch {}
  }

  function changeStage(stageId: string) {
    if (!mayLeave()) return;
    dirty.current = false;
    rememberStage(stageId);
    setExpandedTask(null);
    setSaved(false);
    requestAnimationFrame(() => stageHeading.current?.focus());
  }

  return <section aria-label="Ruta de preparación" className="rounded-lg bg-[var(--surface)] px-0 py-2 md:px-2">
    <header>
      <p className="text-sm text-[var(--ink-muted)]"><Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="text-[var(--blue)] hover:underline" href="/proyectos">Mis proyectos</Link><span aria-hidden className="mx-2">/</span>{projectName}</p>
      <h1 className="mt-7 text-3xl font-semibold leading-tight tracking-[-0.045em] text-[var(--navy)] md:text-[2.7rem]">Prepara tu próxima oportunidad</h1>
      <p className="mt-3 text-base leading-7 text-[var(--ink-muted)]">Un paso a la vez, sin perder de vista el camino.</p>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <p className="text-sm font-semibold text-[var(--navy)] md:text-base">{call.name}</p>
        <Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="text-sm text-[var(--blue)] underline-offset-4 hover:underline" href={`${recordUrl}#oportunidades`}>Cambiar convocatoria</Link>
        <span className="text-xs text-[var(--ink-muted)]">{availabilityLabel}</span>
      </div>
      {call.benefit.beneficiaryContributionPercent !== null ? <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">Para planificar: aporte de {call.benefit.beneficiaryContributionPercent}% según el catálogo. {call.benefit.taxTreatment} <Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="text-[var(--blue)] underline underline-offset-4" href={`/catalogo/${call.id}`}>Revisar condiciones</Link>.</p> : null}
      {warnings.length ? <aside className="mt-5 flex items-start gap-3 border-l-2 border-[#b98a3d] bg-[#faf4e7] p-4 text-sm leading-6 text-[#76551e]">
        <CircleAlert aria-hidden size={18} className="mt-1 shrink-0" />
        <div><p className="font-semibold">Antes de continuar</p><ul>{warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></div>
      </aside> : null}
    </header>

    <div className="mt-9 grid gap-8 lg:mt-11 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <aside className="lg:border-r lg:border-[var(--line)] lg:pr-7">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]">Tu recorrido</p>
        <nav aria-label="Etapas de preparación" className="mt-5">
          <ol className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-1">
            {stages.map((stage, index) => {
              const complete = stage.tasks.length > 0 && stage.completed === stage.tasks.length;
              const active = stage.id === activeStage.id;
              return <li key={stage.id}>
                <button type="button" disabled={saving} aria-current={active ? "step" : undefined} onClick={() => changeStage(stage.id)}
                  className={`flex min-h-20 w-full items-start gap-3 rounded-md border px-2.5 py-3 text-left transition-colors disabled:opacity-60 ${active ? "border-[#c3d7e5] bg-[var(--blue-soft)] text-[var(--navy)]" : "border-transparent text-[var(--ink-muted)] hover:bg-[var(--canvas)]"}`}>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold ${active ? "border-[var(--blue)] bg-[var(--blue)] text-white" : complete ? "border-[var(--green)] text-[var(--green)]" : "border-[var(--line)] bg-[var(--surface)]"}`}>
                    {complete ? <Check aria-hidden size={17} /> : <span aria-hidden>{index + 1}</span>}
                  </span>
                  <span className="min-w-0 pt-1 text-xs font-semibold leading-5 md:text-sm">
                    {stage.label}<span className={`mt-1 block text-[0.68rem] font-normal leading-4 ${complete ? "text-[var(--green)]" : "text-[var(--ink-muted)]"}`}>
                      {stage.previewOnly ? "Vista previa · según selección" : stage.future ? "Si eres seleccionado" : complete ? "Preparada por ti" : `${stage.completed} de ${stage.tasks.length} tareas`}
                    </span>
                  </span>
                </button>
              </li>;
            })}
          </ol>
        </nav>
        <div className="mt-5 space-y-3 text-sm leading-6 lg:mt-7">
          <Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="block text-[var(--blue)] underline-offset-4 hover:underline" href={`${recordUrl}#checklist`}>Ver todos los requisitos</Link>
          <Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="block text-[var(--blue)] underline-offset-4 hover:underline" href={`${recordUrl}#antecedentes`}>Consultar mi ficha</Link>
          <p className="text-xs leading-5 text-[var(--ink-muted)]">Puedes revisar otra etapa cuando lo necesites. Recordamos tu etapa en este navegador.</p>
        </div>
      </aside>

      <div className="min-w-0">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--blue)]">Etapa {activeIndex + 1} de {stages.length}</p>
        <h2 ref={stageHeading} tabIndex={-1} className="mt-3 scroll-mt-6 text-2xl font-semibold leading-tight tracking-[-0.035em] text-[var(--navy)] md:text-3xl">{activeStage.title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">{activeStage.help}</p>
        {activeStage.deadlineLabel ? <p className="mt-4 text-sm font-semibold text-[var(--blue)]">{activeStage.deadlineLabel}</p> : null}
        {activeStage.future ? <p className="mt-4 border-l-2 border-[var(--line-strong)] pl-3 text-sm leading-6 text-[var(--ink-muted)]">No necesitas completar esta etapa para preparar la postulación. El resultado se consulta fuera de esta aplicación.</p> : <div className="mt-5 max-w-lg">
          <p className="text-sm">{activeStage.completed} de {activeStage.tasks.length} tareas preparadas</p>
          <progress className="journey-progress mt-2 block h-1 w-full overflow-hidden rounded-full" aria-label={`Avance: ${activeStage.label}`} max={Math.max(1, activeStage.tasks.length)} value={activeStage.completed} />
        </div>}
        <p role="status" className="mt-3 min-h-5 text-xs text-[var(--green)]">{saved ? "Cambios guardados en tu proyecto." : ""}</p>

        <div className="mt-2 overflow-hidden rounded-md border border-[var(--line)]">
          {activeStage.tasks.map(task => {
            if (activeStage.previewOnly) return <article key={task.id} className="border-t border-[var(--line)] p-5 first:border-t-0"><h3 className="font-semibold">{task.label}</h3><p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{task.help}</p></article>;
            const expanded = task.id === activeTaskId;
            const panelId = `task-panel-${task.id.replace(/[^a-zA-Z0-9-]/g, "-")}`;
            return <article key={task.id} className={`border-t border-[var(--line)] first:border-t-0 ${expanded ? "bg-[#f0f6fa]" : "bg-[var(--surface)]"}`}>
              <h3>
                <button type="button" aria-expanded={expanded} aria-controls={panelId} disabled={saving} onClick={() => {
                  if (!mayLeave()) return;
                  dirty.current = false;
                  setExpandedTask(expanded ? "" : task.id);
                  setSaved(false);
                }} className="flex w-full items-center gap-3 px-4 py-5 text-left md:gap-4 md:px-6">
                  {task.complete ? <Check aria-hidden size={22} className="shrink-0 text-[var(--green)]" /> : <span aria-hidden className="size-5 shrink-0 rounded-full border-2 border-[var(--line-strong)]" />}
                  <span className="min-w-0 flex-1">
                    {expanded && !task.complete ? <span className="mb-1 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-[var(--blue)]">{activeStage.future ? "Cuando corresponda" : "Tu siguiente paso"}</span> : null}
                    <span className="block text-base font-semibold tracking-[-0.02em] text-[var(--navy)]">{task.label}</span>
                    {task.reused ? <span className="mt-1 block text-xs font-normal text-[var(--ink-muted)]">Respuesta reutilizada de tu ficha</span> : null}
                  </span>
                  <span className={`hidden text-xs font-normal sm:block ${task.complete ? "text-[var(--green)]" : "text-[var(--ink-muted)]"}`}>{task.item?.status === "not_applicable" ? "Excepción declarada" : task.complete ? "Preparado" : task.item?.status === "in_progress" ? "Borrador guardado" : "Pendiente"}</span>
                  <ChevronDown aria-hidden size={17} className={`shrink-0 text-[var(--ink-muted)] ${expanded ? "rotate-180" : ""}`} />
                </button>
              </h3>
              <div id={panelId} hidden={!expanded}>
                {expanded ? <div className="px-4 pb-6 md:pl-16 md:pr-6">
                  <p className="text-sm leading-6 text-[var(--ink-muted)]">{task.help}</p>
                  {task.response && responseAction ? <CallResponseEditor key={task.id} task={task} projectId={projectId} action={responseAction}
                    onDirty={() => { dirty.current = true; }} onSaving={setSaving} onSaved={ready => {
                      dirty.current = false;
                      rememberStage(activeStage.id);
                      setExpandedTask(ready ? null : task.id);
                      setSaved(true);
                      requestAnimationFrame(() => stageHeading.current?.focus());
                    }} /> : <PreparationTaskEditor key={`${task.id}-${task.antecedent?.updatedAt ?? task.item?.status ?? "empty"}`} task={task} projectId={projectId} future={activeStage.future}
                    antecedentAction={antecedentAction} checklistAction={checklistAction}
                    onDirty={() => { dirty.current = true; }} onSaving={setSaving} onSaved={() => {
                      dirty.current = false;
                      rememberStage(activeStage.id);
                      setExpandedTask(null);
                      setSaved(true);
                      requestAnimationFrame(() => stageHeading.current?.focus());
                    }} />}
                </div> : null}
              </div>
            </article>;
          })}
        </div>
        {stageComplete && !activeStage.future ? <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-l-2 border-[var(--green)] pl-4">
          <p className="text-sm text-[var(--green)]">Etapa preparada por ti. Puedes volver a editarla.</p>
          <button type="button" disabled={saving} onClick={() => changeStage(stages[activeIndex + 1].id)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--blue)] hover:underline">Continuar a la siguiente etapa <ArrowRight aria-hidden size={17} /></button>
        </div> : null}
        {activeStage.id === "submission" ? <p className="mt-5 text-sm leading-6 text-[var(--ink-muted)]">Antes de enviar, revisa también las tareas pendientes de las etapas anteriores. Este asistente no presenta solicitudes ni confirma su recepción.</p> : null}
        <footer className="mt-7 space-y-3 text-xs leading-5 text-[var(--ink-muted)]">
          <p className="flex gap-2"><Info aria-hidden size={16} className="mt-0.5 shrink-0" />Estas tareas te ayudan a preparar el formulario; no son requisitos adicionales.</p>
          <p className="border-t border-[var(--line)] pt-3">Preparado por ti no significa validado por la institución. <Link onClick={event => { if (!mayLeave()) event.preventDefault(); }} className="text-[var(--blue)] underline underline-offset-4" href={`/catalogo/${call.id}`}>Consultar condiciones y fuentes oficiales</Link>.</p>
        </footer>
      </div>
    </div>
  </section>;
}

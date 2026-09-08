"use client";

import { useActionState, useState } from "react";
import { getAnswerOptions, parseAntecedentValue } from "@/domain/antecedent-input";
import { getAntecedentDefinition } from "@/domain/antecedents";
import type { PreparationTask } from "@/domain/preparation-journey";

export type PreparationAction = (formData: FormData) => void | Promise<void>;

export function PreparationTaskEditor({ task, projectId, future, antecedentAction, checklistAction, onDirty, onSaving, onSaved }: {
  task: PreparationTask;
  projectId: string;
  future: boolean;
  antecedentAction: PreparationAction;
  checklistAction: PreparationAction;
  onDirty: () => void;
  onSaving: (saving: boolean) => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(task.item?.status ?? "pending");
  const [value, setValue] = useState(task.antecedent?.value == null ? "" : String(task.antecedent.value));
  const [note, setNote] = useState(task.item?.note ?? "");
  const [reason, setReason] = useState(task.item?.reason ?? "");
  const [error, formAction, pending] = useActionState(async (_previous: string | null, data: FormData) => {
    if (task.antecedentKey && parseAntecedentValue(task.antecedentKey, String(data.get("value") ?? "")) === null) {
      return "Escribe una respuesta válida antes de guardar. Puedes trabajar en otra tarea si todavía no la sabes.";
    }
    if (!task.antecedentKey && data.get("status") === "not_applicable" && !String(data.get("reason") ?? "").trim()) {
      return "Indica el motivo por el que este requisito no aplica.";
    }
    onSaving(true);
    try {
      await (task.antecedentKey ? antecedentAction(data) : checklistAction(data));
      onSaved();
      return null;
    } catch {
      return "No pudimos guardar. Tu respuesta sigue aquí; revisa la conexión e inténtalo nuevamente.";
    } finally {
      onSaving(false);
    }
  }, null);
  const controlClass = "mt-2 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 py-3 text-sm leading-6 text-[var(--ink)] disabled:opacity-60";
  const inputId = `journey-${task.id.replace(/[^a-zA-Z0-9-]/g, "-")}`;
  const definition = task.antecedentKey ? getAntecedentDefinition(task.antecedentKey) : null;
  const options = task.antecedentKey ? getAnswerOptions(task.antecedentKey) : [];

  return <form action={formAction} onChange={onDirty} className="mt-5" aria-label={`Preparar: ${task.label}`}>
    <input type="hidden" name="projectId" value={projectId} />
    {definition ? <>
      <input type="hidden" name="key" value={definition.key} />
      <input type="hidden" name="intent" value="confirm" />
      {task.antecedent?.confirmationStatus === "inferred" ? <p className="mb-3 text-xs leading-5 text-[var(--ink-muted)]">Borrador tomado de tu relato. Revísalo antes de confirmarlo.</p> : null}
      {task.antecedent?.confirmationStatus === "stale" ? <p className="mb-3 text-sm text-[#76551e]">Esta respuesta necesita revisión porque puede estar desactualizada.</p> : null}
      <label className="text-sm font-semibold" htmlFor={inputId}>Tu respuesta</label>
      {options.length ? <select className={controlClass} value={value} onChange={event => setValue(event.target.value)} id={inputId} name="value" disabled={pending}>
        <option value="">Selecciona una respuesta</option>
        {value && !options.some(option => option.value === value) ? <option value={value}>{value} (respuesta anterior)</option> : null}
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select> : definition.valueType === "long_text" ? <textarea className={`${controlClass} min-h-28 resize-y`} value={value} onChange={event => setValue(event.target.value)} id={inputId} name="value" disabled={pending} />
        : <input className={controlClass} value={value} onChange={event => setValue(event.target.value)} id={inputId} name="value" disabled={pending} inputMode={definition.valueType === "number" || definition.valueType === "money" ? "decimal" : "text"} autoComplete="off" />}
      <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">Se guarda en tu ficha y se reutiliza donde corresponda. No necesitas marcarlo de nuevo.</p>
    </> : <>
      <input type="hidden" name="itemKey" value={task.id} />
      <label className="text-sm font-semibold" htmlFor={inputId}>Estado de preparación</label>
      <select className={controlClass} value={status} onChange={event => setStatus(event.target.value as typeof status)} id={inputId} name="status" disabled={pending}>
        <option value="pending">Pendiente</option>
        <option value="in_progress">En preparación</option>
        <option value="user_completed_unvalidated">Preparado por mí, no validado</option>
        <option value="not_applicable">No aplica, con motivo</option>
        {future || status === "future_if_selected" ? <option value="future_if_selected">Solo si soy seleccionado</option> : null}
        {task.item?.responsibleParty === "institution" || status === "institution_verifies" ? <option value="institution_verifies">En espera de la institución</option> : null}
        {status === "stale" ? <option value="stale">Necesita revisión</option> : null}
      </select>
      <div className="mt-4">
        <label className="text-sm" htmlFor={`${inputId}-note`}>Nota opcional</label>
        <textarea className={`${controlClass} min-h-20`} id={`${inputId}-note`} name="note" value={note} onChange={event => setNote(event.target.value)} maxLength={1000} disabled={pending} />
      </div>
      {status === "not_applicable" ? <div className="mt-4">
        <label className="text-sm" htmlFor={`${inputId}-reason`}>Motivo por el que no aplica</label>
        <input className={controlClass} id={`${inputId}-reason`} name="reason" value={reason} onChange={event => setReason(event.target.value)} maxLength={1000} disabled={pending} />
        <p className="mt-2 text-xs text-[var(--ink-muted)]">Es una excepción declarada por ti; confírmala con la institución.</p>
      </div> : <input type="hidden" name="reason" value={reason} />}
    </>}
    {task.item ? <details className="mt-4 text-xs leading-5 text-[var(--ink-muted)]">
      <summary className="w-fit cursor-pointer underline underline-offset-4">Condiciones y respaldo del requisito</summary>
      <p className="mt-2">Verifica: {task.item.verifier}</p>
      {task.item.validity ? <p>Vigencia: {task.item.validity}</p> : null}
      {definition && task.item.note ? <p>Nota guardada: {task.item.note}</p> : null}
      {definition && task.item.reason ? <p>Motivo guardado: {task.item.reason}</p> : null}
    </details> : null}
    {error ? <p role="alert" className="mt-4 text-sm leading-6 text-red-800">{error}</p> : null}
    <div className="mt-5 flex justify-end">
      <button className="min-h-11 rounded-md bg-[var(--blue)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--navy)] disabled:cursor-wait disabled:opacity-60" disabled={pending} type="submit">
        {pending ? "Guardando…" : definition ? "Guardar y continuar" : "Guardar preparación"}
      </button>
    </div>
  </form>;
}

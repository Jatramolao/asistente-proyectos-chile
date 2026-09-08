"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { responseIsReady } from "@/domain/call-responses";
import type { PreparationTask } from "@/domain/preparation-journey";
import type { PreparationAction } from "./preparation-task";

export function CallResponseEditor({ task, projectId, action, onDirty, onSaving, onSaved }: { task: PreparationTask; projectId: string; action: PreparationAction; onDirty: () => void; onSaving: (saving: boolean) => void; onSaved: (ready: boolean) => void }) {
  const [value, setValue] = useState(task.draft ?? "");
  const errorMessage = useRef<HTMLParagraphElement>(null);
  const definition = task.response!;
  const ready = responseIsReady(definition, value);
  const [error, formAction, pending] = useActionState(async (_previous: string | null, data: FormData) => {
    onSaving(true);
    try { await action(data); onSaved(ready); return null; }
    catch { return "No pudimos guardar. Tu borrador sigue aquí; vuelve a intentarlo."; }
    finally { onSaving(false); }
  }, null);
  useEffect(() => {
    if (error) errorMessage.current?.focus();
  }, [error]);
  const inputId = `response-${task.id}`;
  const controlClass = "mt-2 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 py-3 text-sm leading-6 disabled:opacity-60";
  return <form action={formAction} onChange={onDirty} className="mt-5" aria-label={`Preparar: ${task.label}`}>
    <input type="hidden" name="projectId" value={projectId} /><input type="hidden" name="itemKey" value={task.id} />
    {task.draftSource ? <p className="mb-3 text-sm leading-6">{task.draftSource}</p> : null}
    {definition.example ? <details className="mb-4 text-sm leading-6 text-[var(--ink-muted)]"><summary className="cursor-pointer font-semibold text-[var(--blue)]">Una guía para empezar · informática</summary><p className="mt-2">{definition.example}</p><p className="mt-2 text-xs">Ejemplo orientativo, no una respuesta lista para postular.</p></details> : null}
    <label htmlFor={inputId} className="text-sm font-semibold">Tu respuesta</label>
    {definition.options ? <select id={inputId} name="value" value={value} onChange={event => setValue(event.target.value)} disabled={pending} autoComplete="off" className={`${controlClass} text-[var(--ink)]`}>
      <option value="">Selecciona una respuesta</option>{definition.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select> : <textarea id={inputId} name="value" value={value} onChange={event => setValue(event.target.value)} maxLength={10000} disabled={pending} rows={8} autoComplete="off" className={`${controlClass} resize-y`} aria-describedby={`${inputId}-count`} />}
    {!definition.options ? <p id={`${inputId}-count`} className="mt-2 text-xs leading-5" aria-live="polite">{value.trim().length} caracteres{definition.minimum > 1 ? ` · Mínimo requerido: ${definition.minimum} · Faltan ${Math.max(0, definition.minimum - value.trim().length)}` : " · Describe tu idea con tus palabras"}. Límite de guardado del asistente: 10.000.</p> : null}
    <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">{ready ? "Formato preparado por ti; no valida contenido ni admisibilidad." : "Puedes guardar y continuar más tarde. Esta tarea todavía no está preparada."} Solo se guarda para esta entrega de All In; no modifica tu ficha ni envía una postulación.</p>
    <a href="https://www.duoc.cl/allinchile2026/" target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-[var(--blue)] underline underline-offset-4 hover:text-[var(--navy)]">Consultar instrucciones y acceso oficial</a>
    {error ? <p ref={errorMessage} tabIndex={-1} role="alert" className="mt-3 text-sm text-red-700">{error}</p> : null}
    <button type="submit" disabled={pending} className="mt-5 block min-h-11 rounded-md bg-[var(--blue)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--navy)] disabled:opacity-60">{pending ? "Guardando…" : ready ? "Guardar y continuar" : "Guardar borrador"}</button>
  </form>;
}

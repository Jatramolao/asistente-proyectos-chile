import type { AntecedentDefinition, ProjectAntecedent } from "@/domain/types";

const STATUS_LABELS: Record<ProjectAntecedent["confirmationStatus"], string> = {
  inferred: "Inferido, pendiente de confirmación",
  confirmed: "Confirmado por el usuario, no validado",
  corrected: "Corregido por el usuario, no validado",
  missing: "Pendiente",
  stale: "Desactualizado",
};

type AntecedentFieldProps = {
  action: (formData: FormData) => void | Promise<void>;
  antecedent: ProjectAntecedent;
  definition: AntecedentDefinition;
};

export function AntecedentField({ action, antecedent, definition }: AntecedentFieldProps) {
  const value = antecedent.value === null ? "" : String(antecedent.value);

  return (
    <article className="rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_10px_30px_rgba(20,48,79,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold tracking-[-0.02em] text-[var(--navy)]">{definition.label}</h3>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{definition.help}</p>
        </div>
        <span className="rounded-full border border-[#b8d7ca] bg-[#edf8f3] px-3 py-1 text-xs font-semibold text-[#17634f]">
          {STATUS_LABELS[antecedent.confirmationStatus]}
        </span>
      </div>

      <blockquote className="mt-5 border-l-2 border-[var(--blue)] pl-4 text-sm leading-6 text-[var(--ink)]">
        {value || "Aún no hay una respuesta."}
      </blockquote>

      {antecedent.sourceExcerpt ? (
        <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">Origen: relato inicial · “{antecedent.sourceExcerpt}”</p>
      ) : null}

      <form action={action} className="mt-5 border-t border-[var(--line)] pt-4">
        <input name="projectId" type="hidden" value={antecedent.projectId} />
        <input name="key" type="hidden" value={antecedent.key} />
        <label className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]" htmlFor={`value-${antecedent.id}`}>
          Corrige el antecedente si es necesario
        </label>
        <textarea
          className="mt-2 min-h-24 w-full resize-y rounded-lg border border-[var(--line-strong)] bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-soft)]"
          defaultValue={value}
          id={`value-${antecedent.id}`}
          name="value"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-lg bg-[var(--navy)] px-3.5 py-2 text-xs font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#1c426b] active:scale-[0.97]" name="intent" type="submit" value="confirm">
            Confirmar
          </button>
          <button className="rounded-lg border border-[var(--line-strong)] bg-white px-3.5 py-2 text-xs font-semibold text-[var(--navy)] transition-[background-color,transform] duration-150 hover:bg-[var(--blue-soft)] active:scale-[0.97]" name="intent" type="submit" value="correct">
            Guardar corrección
          </button>
          <button className="rounded-lg px-3.5 py-2 text-xs font-semibold text-[var(--ink-muted)] underline underline-offset-4 transition-colors hover:text-[var(--navy)]" name="intent" type="submit" value="missing">
            Dejar pendiente
          </button>
        </div>
      </form>
    </article>
  );
}

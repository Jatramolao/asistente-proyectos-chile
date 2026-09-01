import Link from "next/link";
import type { CallChecklistGroup, ChecklistGroup } from "@/domain/checklist";
import type { ChecklistItem, FundingCall } from "@/domain/types";

type ChecklistViewProps = {
  action: (formData: FormData) => void | Promise<void>;
  activeView: "calls" | "transversal";
  byCall: CallChecklistGroup[];
  calls: FundingCall[];
  projectId: string;
  transversal: ChecklistGroup[];
};

function responsibleLabel(item: ChecklistItem): string {
  if (item.responsibleParty === "institution") return "Institución";
  if (item.responsibleParty === "selected_beneficiary") return "Beneficiario seleccionado";
  return "Persona postulante";
}

function ChecklistItemRow({
  action,
  callsById,
  item,
  projectId,
  scopeId,
  showReuse,
}: {
  action: ChecklistViewProps["action"];
  callsById: Map<string, string>;
  item: ChecklistItem;
  projectId: string;
  scopeId: string;
  showReuse: boolean;
}) {
  const controlId = `${scopeId}-${item.key}`.replace(/[^a-zA-Z0-9-_]/g, "-");

  return (
    <article className="grid gap-5 border-t border-[var(--line)] py-5 first:border-t-0 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <div className="min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h4 className="text-base font-semibold tracking-[-0.015em] text-[var(--navy)]">{item.label}</h4>
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--ink-muted)]">
            <span aria-hidden className="size-2 bg-[var(--green)]" />
            {item.statusLabel}
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">
          Responsable: {responsibleLabel(item)} · Verifica: {item.verifier}
        </p>
        {showReuse ? (
          <p className="mt-3 break-words text-xs leading-5 text-[var(--blue)]">
            Sirve para: {item.callIds.map((callId) => callsById.get(callId)).filter(Boolean).join(" · ")}
          </p>
        ) : item.callIds.length > 1 ? (
          <p className="mt-3 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-[var(--green)]">
            Antecedente compartido con {item.callIds.length} convocatorias
          </p>
        ) : null}
      </div>

      <form action={action} className="space-y-3">
        <input name="projectId" type="hidden" value={projectId} />
        <input name="itemKey" type="hidden" value={item.key} />
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div>
            <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--ink-muted)]" htmlFor={`status-${controlId}`}>
              Estado<span className="sr-only"> de {item.label}</span>
            </label>
            <select
              className="h-10 w-full rounded-md border border-[var(--line-strong)] bg-white px-3 text-xs text-[var(--ink)]"
              defaultValue={item.status}
              id={`status-${controlId}`}
              name="status"
            >
              <option value="pending">Pendiente</option>
              <option value="in_progress">En preparación</option>
              <option value="user_completed_unvalidated">Completado por mí, no validado</option>
              <option value="not_applicable">No aplica</option>
              <option value="institution_verifies">Verifica la institución</option>
              <option value="future_if_selected">Futuro, si soy seleccionado</option>
            </select>
          </div>
          <button className="mt-[1.15rem] h-10 rounded-md bg-[var(--navy)] px-3 text-xs font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#1c426b] active:scale-[0.98]" type="submit">
            Guardar
          </button>
        </div>

        <details className="group text-xs text-[var(--ink-muted)]">
          <summary className="w-fit cursor-pointer font-semibold underline decoration-[var(--line-strong)] underline-offset-4 hover:text-[var(--navy)]">
            Agregar nota o motivo
          </summary>
          <div className="mt-3 space-y-3 border-l border-[var(--line-strong)] pl-3">
            <div>
              <label className="mb-1 block font-semibold" htmlFor={`note-${controlId}`}>Nota opcional<span className="sr-only"> para {item.label}</span></label>
              <input autoComplete="off" className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-xs text-[var(--ink)]" defaultValue={item.note ?? ""} id={`note-${controlId}`} name="note" placeholder="Ejemplo: solicitar certificado…" />
            </div>
            <div>
              <label className="mb-1 block font-semibold" htmlFor={`reason-${controlId}`}>Motivo si no aplica<span className="sr-only"> para {item.label}</span></label>
              <input autoComplete="off" className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-xs text-[var(--ink)]" defaultValue={item.reason ?? ""} id={`reason-${controlId}`} name="reason" placeholder="Obligatorio al marcar No aplica…" />
            </div>
          </div>
        </details>
      </form>
    </article>
  );
}

function StageGroups({
  action,
  callsById,
  groups,
  projectId,
  scopeId,
  showReuse,
}: {
  action: ChecklistViewProps["action"];
  callsById: Map<string, string>;
  groups: ChecklistGroup[];
  projectId: string;
  scopeId: string;
  showReuse: boolean;
}) {
  return (
    <div className="space-y-7">
      {groups.map((group) => (
        <section key={group.stage}>
          <div className="flex items-baseline justify-between gap-4 border-b border-[var(--line-strong)] pb-2">
            <h3 className="text-sm font-semibold text-[var(--navy)]">{group.label}</h3>
            <span className="font-mono text-[0.68rem] tabular-nums text-[var(--ink-muted)]">{group.items.length} elementos</span>
          </div>
          <div>
            {group.items.map((item) => (
              <ChecklistItemRow action={action} callsById={callsById} item={item} key={item.key} projectId={projectId} scopeId={scopeId} showReuse={showReuse} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ChecklistView({ action, activeView, byCall, calls, projectId, transversal }: ChecklistViewProps) {
  const callsById = new Map(calls.map((call) => [call.id, call.name]));

  return (
    <>
      <nav aria-label="Vista del checklist" className="mt-7 flex w-fit border border-[var(--line-strong)] bg-[var(--surface)] p-1">
        <Link
          aria-current={activeView === "calls" ? "page" : undefined}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${activeView === "calls" ? "bg-[var(--navy)] text-white" : "text-[var(--ink-muted)] hover:bg-white hover:text-[var(--navy)]"}`}
          href="?checklist=convocatorias#checklist"
        >
          Por convocatoria
        </Link>
        <Link
          aria-current={activeView === "transversal" ? "page" : undefined}
          className={`px-4 py-2 text-sm font-semibold transition-colors ${activeView === "transversal" ? "bg-[var(--navy)] text-white" : "text-[var(--ink-muted)] hover:bg-white hover:text-[var(--navy)]"}`}
          href="?checklist=transversal#checklist"
        >
          Vista transversal
        </Link>
      </nav>

      {activeView === "calls" ? (
        <div className="mt-10 space-y-14">
          {byCall.map((callGroup, index) => (
            <section className="grid gap-6 border-t-2 border-[var(--navy)] pt-5 lg:grid-cols-[15rem_minmax(0,1fr)]" key={callGroup.callId}>
              <header>
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--blue)]">
                  {String(index + 1).padStart(2, "0")} · {callGroup.institutionId}
                </p>
                <h2 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-[var(--navy)] text-balance">{callGroup.callName}</h2>
                <p className="mt-3 text-xs leading-5 text-[var(--ink-muted)]">{callGroup.territory}</p>
              </header>
              <StageGroups action={action} callsById={callsById} groups={callGroup.groups} projectId={projectId} scopeId={callGroup.callId} showReuse={false} />
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <StageGroups action={action} callsById={callsById} groups={transversal} projectId={projectId} scopeId="transversal" showReuse />
        </div>
      )}
    </>
  );
}

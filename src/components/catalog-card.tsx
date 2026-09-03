import Link from "next/link";
import type { CatalogCall } from "@/catalog/current.schema";
import { AVAILABILITY_LABELS, benefitLabel, formatCatalogDate, getAvailability, supportLabel } from "@/domain/catalog";

export function CatalogCard({ call, now }: { call: CatalogCall; now: Date }) {
  const state = getAvailability(call, now);
  return <article className="grid gap-5 border-t border-[var(--line)] py-7 lg:grid-cols-[11rem_minmax(0,1fr)_14rem]">
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-[var(--blue)]">{call.institutionId} · {supportLabel(call)}</p>
      <p className={`mt-3 border-l-2 pl-3 text-xs font-semibold ${["open", "ongoing"].includes(state) ? "border-[var(--green)] text-[var(--green)]" : "border-[#b98a3d] text-[#76551e]"}`}>{AVAILABILITY_LABELS[state]}</p>
    </div>
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-[var(--navy)]"><Link className="hover:underline" href={`/catalogo/${call.id}`}>{call.name}</Link></h2>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{call.discovery.purpose}</p>
      <p className="mt-3 text-xs text-[var(--ink-muted)]">{call.territory}</p>
      <p className="mt-2 text-xs text-[var(--ink-muted)]">{call.closesAt ? `Cierre: ${formatCatalogDate(call.closesAt)} · hora de Chile continental` : call.scheduleMode === "ongoing" ? "Consulta disponibilidad y acceso en la institución." : "Fechas de postulación aún no publicadas."}</p>
    </div>
    <div className="flex flex-col items-start justify-between gap-4">
      <p className="text-sm font-semibold text-[var(--navy)]">{benefitLabel(call)}</p>
      <Link className="rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--blue)] hover:bg-[var(--surface)]" href={`/catalogo/${call.id}`}>{state === "closed" ? "Ver como referencia" : "Entender este apoyo"} →</Link>
    </div>
  </article>;
}

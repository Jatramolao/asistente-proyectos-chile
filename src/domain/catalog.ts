import type { FundingCall } from "./types";
import type { CatalogCall } from "@/catalog/current.schema";

export const REGIONS = {
  arica: "Arica y Parinacota", tarapaca: "Tarapacá", antofagasta: "Antofagasta",
  atacama: "Atacama", coquimbo: "Coquimbo", valparaiso: "Valparaíso",
  metropolitana: "Metropolitana", ohiggins: "O’Higgins", maule: "Maule", nuble: "Ñuble",
  biobio: "Biobío", araucania: "La Araucanía", los_rios: "Los Ríos", los_lagos: "Los Lagos",
  aysen: "Aysén", magallanes: "Magallanes",
} as const;
export const STAGES = { idea: "Tengo una idea", prototype: "Tengo una primera versión", operating: "Ya estoy vendiendo" } as const;
export const GOALS = { start: "Quiero empezar", validate: "Quiero probar mi solución", learn: "Quiero aprender y recibir orientación" } as const;
export const AVAILABILITY_LABELS = {
  open: "Postulación abierta", ongoing: "Servicio continuo", scheduled: "Próxima apertura",
  announced: "Anunciada sin fecha", closed: "Cerrada · referencia", verify: "Por verificar",
} as const;
export type Availability = keyof typeof AVAILABILITY_LABELS;

export function chileDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Santiago", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function getAvailability(call: FundingCall, now: Date): Availability {
  const today = chileDate(now);
  const before = call.opensAt && (call.opensAt.length === 10 ? today < call.opensAt : now.getTime() < Date.parse(call.opensAt));
  const after = call.closesAt && (call.closesAt.length === 10 ? today > call.closesAt : now.getTime() > Date.parse(call.closesAt));
  // Known closure remains useful even after its editorial review is due.
  if (call.status === "closed" || after) return "closed";
  if (call.status === "verify" || (call.editorial && today > call.editorial.nextReviewAt)) return "verify";
  if (call.status === "announced") return "announced";
  if (call.scheduleMode === "ongoing") return "ongoing";
  if (!call.opensAt || !call.closesAt) return "verify";
  if (before) return "scheduled";
  return "open";
}

export function reviewIsDue(call: CatalogCall, now: Date): boolean {
  return chileDate(now) > call.editorial.nextReviewAt;
}

export function formatCatalogDate(value: string | null): string {
  if (!value) return "Sin fecha publicada";
  const isDate = value.length === 10;
  const date = new Date(isDate ? `${value}T12:00:00Z` : value);
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "long", ...(isDate ? {} : { timeStyle: "short" as const, hourCycle: "h23" as const }), timeZone: "America/Santiago" }).format(date);
}

export function supportLabel(call: FundingCall): string {
  return call.supportType === "training" ? "Capacitación" : call.supportType === "technical_assistance" ? "Asesoría" : "Financiamiento";
}
export function benefitLabel(call: FundingCall): string {
  if (["training", "technical_assistance"].includes(call.supportType)) return "Servicio gratuito";
  return call.benefit.maximumAmountClp === null ? "Monto no informado" : `Hasta ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(call.benefit.maximumAmountClp)}`;
}

type Filters = { region?: string; stage?: string; goal?: string; availability?: string };
export function filterCatalog(calls: CatalogCall[], filters: Filters, now: Date): CatalogCall[] {
  const rank: Record<Availability, number> = { open: 0, ongoing: 1, scheduled: 2, announced: 3, verify: 4, closed: 5 };
  return calls.filter(call => {
    if (filters.region && filters.region in REGIONS && !call.discovery.national && !call.discovery.regions.includes(filters.region)) return false;
    if (filters.stage && filters.stage in STAGES && !call.discovery.stages.includes(filters.stage as keyof typeof STAGES)) return false;
    if (filters.goal && filters.goal in GOALS && !call.discovery.goals.includes(filters.goal as keyof typeof GOALS)) return false;
    const availability = getAvailability(call, now);
    if (filters.availability === "available" && !["open", "ongoing"].includes(availability)) return false;
    if (filters.availability === "closed" && availability !== "closed") return false;
    return true;
  }).sort((a, b) => rank[getAvailability(a, now)] - rank[getAvailability(b, now)] || a.name.localeCompare(b.name, "es"));
}

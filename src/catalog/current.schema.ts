import { z } from "zod";
import { PilotCatalogSchema } from "./pilot.schema";

const officialHosts = ["sercotec.cl", "corfo.cl", "corfo.gob.cl", "fosis.gob.cl", "startupchile.org"];
const officialUrl = z.string().url().refine(value => {
  const url = new URL(value);
  return url.protocol === "https:" && officialHosts.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
}, "La evidencia debe pertenecer a un dominio oficial autorizado");
const date = z.string().date();
const officialDate = z.union([date, z.string().datetime({ offset: true })]);
const CallSchema = PilotCatalogSchema.shape.calls.element.extend({
  opensAt: officialDate.nullable(), closesAt: officialDate.nullable(),
  status: z.enum(["open", "scheduled", "announced", "closed", "verify"]),
  scheduleMode: z.enum(["window", "ongoing"]),
  eligibilityCoverage: z.literal("partial"),
  discovery: z.object({
    national: z.boolean(), regions: z.array(z.string()),
    stages: z.array(z.enum(["idea", "prototype", "operating"])).min(1),
    goals: z.array(z.enum(["start", "validate", "learn"])).min(1),
    purpose: z.string().min(1), conditions: z.array(z.string().min(1)).min(1).max(5),
    contribution: z.string().min(1), nextStep: z.string().min(1),
  }).strict(),
  editorial: z.object({
    state: z.literal("published"), owner: z.string().min(1),
    reviewedAt: date, nextReviewAt: date, version: z.string().min(1),
    evidenceNote: z.string().min(1), history: z.array(z.object({ date, change: z.string().min(1) }).strict()).min(1),
  }).strict(),
}).superRefine((call, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  if (call.scheduleMode === "window" && ["open", "scheduled"].includes(call.status) && (!call.opensAt || !call.closesAt)) issue("Una convocatoria abierta/próxima exige ambas fechas");
  if (call.opensAt && call.closesAt && Date.parse(call.opensAt) > Date.parse(call.closesAt)) issue("El cierre debe ser posterior a la apertura");
  if (call.scheduleMode === "ongoing" && (call.opensAt || call.closesAt || !["training", "technical_assistance"].includes(call.supportType))) issue("El servicio continuo no debe inventar fechas ni representar un subsidio");
  if (call.isReference && call.status !== "closed") issue("Una referencia histórica debe estar cerrada");
  if (call.editorial.nextReviewAt < call.editorial.reviewedAt) issue("La siguiente revisión no puede ser anterior");
  if (!call.discovery.national && !call.discovery.regions.length) issue("Debe especificarse la cobertura regional");
});

export const CurrentCatalogSchema = PilotCatalogSchema.extend({
  version: z.string().min(1), reviewedAt: date, lastDiscoveryAt: date,
  discoveryScope: z.string().min(1),
  instruments: z.array(PilotCatalogSchema.shape.instruments.element),
  sources: z.array(PilotCatalogSchema.shape.sources.element.extend({ officialUrl, reviewedAt: date })),
  calls: z.array(CallSchema).min(1),
}).superRefine((catalog, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  for (const items of [catalog.calls, catalog.sources, catalog.instruments, catalog.institutions]) {
    if (new Set(items.map(item => item.id)).size !== items.length) issue("Los identificadores deben ser únicos");
  }
  const sources = new Map(catalog.sources.map(source => [source.id, source]));
  for (const call of catalog.calls) {
    if (!catalog.instruments.some(i => i.id === call.instrumentId && i.institutionId === call.institutionId)) issue(`Instrumento inexistente: ${call.id}`);
    for (const id of [...call.sourceIds, ...call.requirements.flatMap(r => r.sourceIds), ...call.rules.flatMap(r => r.sourceIds)]) {
      if (sources.get(id)?.institutionId !== call.institutionId) issue(`Evidencia inexistente o de otra institución: ${id}`);
    }
  }
});
export type CurrentCatalog = z.infer<typeof CurrentCatalogSchema>;
export type CatalogCall = CurrentCatalog["calls"][number];

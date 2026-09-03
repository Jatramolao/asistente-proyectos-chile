import { loadCatalog } from "../src/server/services/catalog";
import { AVAILABILITY_LABELS, getAvailability, reviewIsDue } from "../src/domain/catalog";

const catalog = loadCatalog();
const now = new Date();
console.info(`Catálogo válido: ${catalog.version} · ${catalog.calls.length} fichas`);
for (const call of catalog.calls) {
  console.info(`${call.id}: ${AVAILABILITY_LABELS[getAvailability(call, now)]} · próxima revisión ${call.editorial.nextReviewAt}${reviewIsDue(call, now) ? " · REVISIÓN PENDIENTE" : ""}`);
}

import currentCatalog from "@/catalog/current.json";
import { CurrentCatalogSchema, type CurrentCatalog } from "@/catalog/current.schema";
import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import rawCatalog from "@/catalog/pilot.json";
import { PilotCatalogSchema, type PilotCatalog } from "@/catalog/pilot.schema";
import { catalogRepository } from "@/server/db/repositories";

export function loadPilotCatalog(): PilotCatalog {
  return PilotCatalogSchema.parse(rawCatalog);
}

export function publishPilotCatalog(db: Database.Database): void {
  const catalog = loadPilotCatalog();
  catalogRepository(db).upsertSnapshot({
    id: randomUUID(),
    version: catalog.version,
    payloadJson: JSON.stringify(catalog),
    publishedAt: new Date().toISOString(),
  });
}

/** Published source of truth is the versioned editorial file; snapshots are audit copies. */
export function loadCatalog(): CurrentCatalog {
  const pilot = loadPilotCatalog();
  const { references, ...current } = currentCatalog;
  const historic = pilot.calls.map(call => ({ ...call, ...references[call.id as keyof typeof references] }));
  return CurrentCatalogSchema.parse({
    ...current,
    institutions: pilot.institutions,
    instruments: [...pilot.instruments, ...current.instruments],
    sources: [...pilot.sources, ...current.sources],
    calls: [...current.calls, ...historic],
  });
}

export function publishCurrentCatalog(db: Database.Database): void {
  const catalog = loadCatalog();
  const payloadJson = JSON.stringify(catalog);
  const previous = db.prepare("SELECT payload_json FROM app_catalog_snapshot WHERE version = ?").get(catalog.version) as { payload_json: string } | undefined;
  if (previous && previous.payload_json !== payloadJson) throw new Error("Esta versión ya existe con otro contenido. Incrementa la versión editorial.");
  if (previous) return;
  catalogRepository(db).upsertSnapshot({ id: randomUUID(), version: catalog.version, payloadJson, publishedAt: new Date().toISOString() });
}

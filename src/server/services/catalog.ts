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

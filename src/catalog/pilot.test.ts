// @vitest-environment node

import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import rawCatalog from "./pilot.json";
import { PilotCatalogSchema } from "./pilot.schema";
import { runMigrations } from "@/server/db/migrate";
import { loadPilotCatalog, publishPilotCatalog } from "@/server/services/catalog";

describe("pilot catalog", () => {
  const catalog = PilotCatalogSchema.parse(rawCatalog);

  it("contains exactly the declared pilot institutions", () => {
    expect(catalog.instruments.map((item) => item.institutionId).sort()).toEqual([
      "corfo",
      "fosis",
      "sercotec",
    ]);
  });

  it("backs every call and requirement with an official source", () => {
    const sourceIds = new Set(catalog.sources.map((source) => source.id));

    for (const call of catalog.calls) {
      expect(call.sourceIds.length).toBeGreaterThan(0);
      expect(call.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(
        call.requirements.every(
          (requirement) =>
            requirement.sourceIds.length > 0 && requirement.sourceIds.every((id) => sourceIds.has(id)),
        ),
      ).toBe(true);
    }
  });

  it("does not label closed calls as open", () => {
    expect(
      catalog.calls
        .filter((call) => call.closesAt < "2026-08-28T00:00:00-04:00")
        .every((call) => call.status === "closed"),
    ).toBe(true);
  });

  it("loads the validated editorial version", () => {
    expect(loadPilotCatalog().version).toBe("2026-08-28.pilot.1");
  });

  it("publishes the same catalog version idempotently", () => {
    const db = new Database(":memory:");
    runMigrations(db);

    publishPilotCatalog(db);
    publishPilotCatalog(db);

    expect((db.prepare("SELECT COUNT(*) AS count FROM app_catalog_snapshot").get() as { count: number }).count).toBe(1);
    db.close();
  });
});

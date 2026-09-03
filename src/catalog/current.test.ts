// @vitest-environment node
import { describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { runMigrations } from "@/server/db/migrate";
import { loadCatalog, publishCurrentCatalog } from "@/server/services/catalog";
import { CurrentCatalogSchema } from "./current.schema";

describe("current editorial catalogue", () => {
  it("includes reviewed additions and preserves historical review dates", () => {
    const catalog = loadCatalog();
    expect(catalog.calls).toHaveLength(7);
    expect(catalog.calls.filter(c => c.isReference)).toHaveLength(3);
    expect(catalog.calls.filter(c => c.isReference).every(c => c.editorial.reviewedAt === "2026-09-01")).toBe(true);
  });
  it("archives immutable published versions without overwriting a prior payload", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    publishCurrentCatalog(db);
    publishCurrentCatalog(db);
    expect((db.prepare("SELECT COUNT(*) AS n FROM app_catalog_snapshot").get() as { n: number }).n).toBe(1);
    db.prepare("UPDATE app_catalog_snapshot SET payload_json = '{}' WHERE version = ?").run(loadCatalog().version);
    expect(() => publishCurrentCatalog(db)).toThrow("Incrementa la versión editorial");
    db.close();
  });
  it("rejects unofficial hosts and unresolved evidence", () => {
    const catalog = structuredClone(loadCatalog());
    catalog.sources[0].officialUrl = "https://sercotec.cl.evil.example/";
    expect(CurrentCatalogSchema.safeParse(catalog).success).toBe(false);
    const unresolved = structuredClone(loadCatalog());
    unresolved.calls[0].sourceIds = ["non-existent"];
    expect(CurrentCatalogSchema.safeParse(unresolved).success).toBe(false);
  });
  it("rejects duplicate IDs, published drafts and missing open dates", () => {
    const catalog = structuredClone(loadCatalog());
    catalog.calls.push(catalog.calls[0]);
    expect(CurrentCatalogSchema.safeParse(catalog).success).toBe(false);
    const draft = structuredClone(loadCatalog()) as unknown as { calls: { editorial: { state: string } }[] };
    draft.calls[0].editorial.state = "draft";
    expect(CurrentCatalogSchema.safeParse(draft).success).toBe(false);
    const invalid = structuredClone(loadCatalog());
    invalid.calls[0].status = "open";
    invalid.calls[0].opensAt = null;
    expect(CurrentCatalogSchema.safeParse(invalid).success).toBe(false);
  });
});

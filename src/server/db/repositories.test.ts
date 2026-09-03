// @vitest-environment node

import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runMigrations } from "./migrate";
import { catalogRepository, projectRepository } from "./repositories";

describe("projectRepository", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    runMigrations(db);
  });

  afterEach(() => db.close());

  it("does not return a project owned by another user", () => {
    const projects = projectRepository(db);
    const created = projects.create({
      userId: "user-a",
      name: "Agua IA",
      narrative: "Detecta fugas en edificios usando sensores.",
    });

    expect(projects.getById("user-b", created.id)).toBeNull();
    expect(projects.getById("user-a", created.id)?.name).toBe("Agua IA");
  });

  it("lists only projects owned by the requesting user", () => {
    const projects = projectRepository(db);
    projects.create({ userId: "user-a", name: "Proyecto A", narrative: "Narrativa del proyecto A" });
    projects.create({ userId: "user-b", name: "Proyecto B", narrative: "Narrativa del proyecto B" });

    expect(projects.list("user-a").map((project) => project.name)).toEqual(["Proyecto A"]);
  });

  it("stores antecedent history and blocks changes from another user", () => {
    const projects = projectRepository(db);
    const project = projects.create({ userId: "user-a", name: "Agua IA", narrative: "Detecta fugas" });

    expect(projects.upsertAntecedent("user-b", project.id, {
      key: "essence.problem",
      value: "Pérdidas de agua",
      confirmationStatus: "confirmed",
      origin: "answer",
    })).toBeNull();

    projects.upsertAntecedent("user-a", project.id, {
      key: "essence.problem",
      value: "Pérdidas de agua en edificios",
      confirmationStatus: "corrected",
      origin: "answer",
    });

    expect(projects.listAntecedents("user-a", project.id)).toEqual([
      expect.objectContaining({
        key: "essence.problem",
        value: "Pérdidas de agua en edificios",
        confirmationStatus: "corrected",
      }),
    ]);
    expect((db.prepare("SELECT COUNT(*) AS count FROM app_antecedent_history").get() as { count: number }).count).toBe(1);
  });

  it("stores checklist progress only for the project owner", () => {
    const projects = projectRepository(db);
    const project = projects.create({ userId: "user-a", name: "Agua IA", narrative: "Detecta fugas" });

    expect(projects.setChecklistProgress("user-b", project.id, {
      itemKey: "antecedent:essence.problem",
      status: "user_completed_unvalidated",
    })).toBe(false);
    expect(projects.setChecklistProgress("user-a", project.id, {
      itemKey: "antecedent:essence.problem",
      status: "user_completed_unvalidated",
      note: "Preparado por la persona postulante",
    })).toBe(true);

    expect(projects.getChecklistProgress("user-a", project.id)).toEqual([
      expect.objectContaining({
        itemKey: "antecedent:essence.problem",
        status: "user_completed_unvalidated",
      }),
    ]);
    expect(projects.getChecklistProgress("user-b", project.id)).toEqual([]);
  });
});

describe("catalogRepository", () => {
  it("publishes a catalog version idempotently", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const catalog = catalogRepository(db);

    catalog.upsertSnapshot({ id: "snapshot-1", version: "pilot.1", payloadJson: "{\"revision\":1}", publishedAt: "2026-08-28T10:00:00Z" });
    catalog.upsertSnapshot({ id: "snapshot-2", version: "pilot.1", payloadJson: "{\"revision\":2}", publishedAt: "2026-08-28T11:00:00Z" });

    expect(catalog.getLatestSnapshot()).toEqual({
      version: "pilot.1",
      payloadJson: "{\"revision\":2}",
      publishedAt: "2026-08-28T11:00:00Z",
    });
    expect((db.prepare("SELECT COUNT(*) AS count FROM app_catalog_snapshot").get() as { count: number }).count).toBe(1);
    db.close();
  });
});

describe("project opportunity selection", () => {
  it("persists idempotently, isolates owners and preserves preparation when removed", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const projects = projectRepository(db);
    const project = projects.create({ userId: "a", name: "Idea", narrative: "Mi idea" });
    expect(projects.selectCall("b", project.id, "call-1")).toBe(false);
    expect(projects.selectCall("a", project.id, "call-1")).toBe(true);
    projects.selectCall("a", project.id, "call-1");
    expect(projects.listSelectedCalls("a", project.id)).toEqual(["call-1"]);
    expect(projects.listSelectedCalls("b", project.id)).toEqual([]);
    projects.setChecklistProgress("a", project.id, { itemKey: "shared", status: "in_progress" });
    expect(projects.removeSelectedCall("b", project.id, "call-1")).toBe(false);
    expect(projects.removeSelectedCall("a", project.id, "call-1")).toBe(true);
    expect(projects.listSelectedCalls("a", project.id)).toEqual([]);
    expect(projects.getChecklistProgress("a", project.id)).toHaveLength(1);
    db.close();
  });
});

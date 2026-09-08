// @vitest-environment node
import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runMigrations } from "@/server/db/migrate";
import { projectRepository } from "@/server/db/repositories";
import { saveCallResponse } from "./call-responses";

let db: Database.Database;
let projectId: string;
const callId = "duoc-allin-chile-2026";
const itemKey = `requirement:${callId}:assignment-problem`;
beforeEach(() => {
  db = new Database(":memory:");
  runMigrations(db);
  const repository = projectRepository(db);
  projectId = repository.create({ userId: "owner", name: "Mi proyecto", narrative: "Una idea" }).id;
  repository.selectCall("owner", projectId, callId);
});
afterEach(() => db.close());

describe("call-scoped response persistence", () => {
  it("saves short drafts and promotes only responses meeting the required format", () => {
    saveCallResponse(db, "owner", { projectId, itemKey, value: "Una idea breve" });
    expect(projectRepository(db).getChecklistProgress("owner", projectId)[0]).toMatchObject({ status: "in_progress", note: "Una idea breve" });
    saveCallResponse(db, "owner", { projectId, itemKey, value: "a".repeat(680) });
    expect(projectRepository(db).getChecklistProgress("owner", projectId)[0].status).toBe("user_completed_unvalidated");
  });
  it("rejects another user and unselected calls without modifying data", () => {
    expect(() => saveCallResponse(db, "other", { projectId, itemKey, value: "No permitido" })).toThrow();
    projectRepository(db).removeSelectedCall("owner", projectId, callId);
    expect(() => saveCallResponse(db, "owner", { projectId, itemKey, value: "No permitido" })).toThrow();
    expect(projectRepository(db).getChecklistProgress("owner", projectId)).toHaveLength(0);
  });
  it("rejects unknown fields, invalid options and excessive text", () => {
    expect(() => saveCallResponse(db, "owner", { projectId, itemKey: "requirement:other:task", value: "x" })).toThrow();
    expect(() => saveCallResponse(db, "owner", { projectId, itemKey: `requirement:${callId}:team`, value: "999" })).toThrow();
    expect(() => saveCallResponse(db, "owner", { projectId, itemKey, value: "a".repeat(10001) })).toThrow();
  });
  it("keeps each delivery independent and preserves shared antecedents", () => {
    saveCallResponse(db, "owner", { projectId, itemKey: `requirement:${callId}:intro-problem`, value: "Idea inicial" });
    saveCallResponse(db, "owner", { projectId, itemKey, value: "Encargo independiente" });
    const repository = projectRepository(db);
    expect(repository.getChecklistProgress("owner", projectId).map(item => item.note).sort()).toEqual(["Encargo independiente", "Idea inicial"]);
    expect(repository.listAntecedents("owner", projectId)).toHaveLength(0);
  });
});

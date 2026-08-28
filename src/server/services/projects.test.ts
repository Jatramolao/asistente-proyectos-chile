// @vitest-environment node

import Database from "better-sqlite3";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { runMigrations } from "@/server/db/migrate";
import { projectRepository } from "@/server/db/repositories";
import { createProjectFromNarrative } from "./projects";

describe("createProjectFromNarrative", () => {
  let db: Database.Database;

  beforeEach(() => {
    db = new Database(":memory:");
    runMigrations(db);
  });

  afterEach(() => db.close());

  it("keeps the original idea and stores extracted facts as unconfirmed", () => {
    const narrative = "Una plataforma con sensores permite detectar fugas de agua en edificios antes de que causen pérdidas.";
    const project = createProjectFromNarrative(db, "user-a", narrative);
    const antecedents = projectRepository(db).listAntecedents("user-a", project.id);

    expect(project.narrative).toBe(narrative);
    expect(antecedents).toEqual(expect.arrayContaining([
      expect.objectContaining({
        key: "technology.component",
        confirmationStatus: "inferred",
        origin: "narrative",
      }),
      expect.objectContaining({
        key: "essence.problem",
        confirmationStatus: "inferred",
        origin: "narrative",
      }),
    ]));
  });
});

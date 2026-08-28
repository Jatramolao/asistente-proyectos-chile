import Database from "better-sqlite3";
import { extractIdea } from "@/domain/extract-idea";
import { parseProjectNarrative } from "@/domain/project-input";
import { projectRepository, type ProjectRecord } from "@/server/db/repositories";

export function createProjectFromNarrative(
  db: Database.Database,
  userId: string,
  input: string,
): ProjectRecord {
  const { name, narrative } = parseProjectNarrative(input);
  const projects = projectRepository(db);
  const project = projects.create({ userId, name, narrative });

  for (const proposal of extractIdea(narrative)) {
    projects.upsertAntecedent(userId, project.id, proposal);
  }

  return project;
}

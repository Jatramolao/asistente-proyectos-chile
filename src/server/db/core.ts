import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";

type PragmaClient = {
  pragma(source: string): unknown;
};

export function configurePersistentJournalMode(db: PragmaClient): void {
  try {
    db.pragma("journal_mode = WAL");
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "SQLITE_BUSY")) {
      throw error;
    }
  }
}

export function createDb(path = process.env.DATABASE_PATH ?? "./data/asistente.sqlite"): Database.Database {
  if (path !== ":memory:") {
    mkdirSync(dirname(resolve(path)), { recursive: true });
  }

  const db = new Database(path);
  db.pragma("foreign_keys = ON");
  if (path !== ":memory:") {
    configurePersistentJournalMode(db);
  }
  return db;
}

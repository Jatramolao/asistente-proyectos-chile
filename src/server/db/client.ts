import "server-only";

import Database from "better-sqlite3";
import { createDb } from "./core";
import { runMigrations } from "./migrate";

export { createDb } from "./core";

let singleton: Database.Database | null = null;
let migrated = false;

export function getDb(): Database.Database {
  singleton ??= createDb();
  if (!migrated) {
    runMigrations(singleton);
    migrated = true;
  }
  return singleton;
}

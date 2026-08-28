import "server-only";

import Database from "better-sqlite3";
import { createDb } from "./core";

export { createDb } from "./core";

let singleton: Database.Database | null = null;

export function getDb(): Database.Database {
  singleton ??= createDb();
  return singleton;
}

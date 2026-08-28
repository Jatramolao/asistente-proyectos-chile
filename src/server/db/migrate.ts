import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Database from "better-sqlite3";

export function runMigrations(db: Database.Database): void {
  const schema = readFileSync(resolve(process.cwd(), "src/server/db/schema.sql"), "utf8");
  db.exec(schema);
}

import { readFileSync } from "node:fs";
import Database from "better-sqlite3";
import { createDb } from "./core";

export function runMigrations(db: Database.Database): void {
  const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
  db.exec(schema);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const db = createDb();
  try {
    runMigrations(db);
    console.info("Database migrations applied.");
  } finally {
    db.close();
  }
}

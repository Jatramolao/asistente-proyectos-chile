import { createDb } from "../src/server/db/core";
import { runMigrations } from "../src/server/db/migrate";

const db = createDb();
try {
  runMigrations(db);
  console.info("Database migrations applied.");
} finally {
  db.close();
}

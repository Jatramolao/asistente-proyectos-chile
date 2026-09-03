import { createDb } from "../src/server/db/core";
import { runMigrations } from "../src/server/db/migrate";
import { publishCurrentCatalog } from "../src/server/services/catalog";

const db = createDb();

try {
  runMigrations(db);
  publishCurrentCatalog(db);
  console.info("Current editorial catalog snapshot saved.");
} finally {
  db.close();
}

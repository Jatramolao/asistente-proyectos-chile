import { createDb } from "../src/server/db/core";
import { runMigrations } from "../src/server/db/migrate";
import { publishPilotCatalog } from "../src/server/services/catalog";

const db = createDb();

try {
  runMigrations(db);
  publishPilotCatalog(db);
  console.info("Pilot catalog published.");
} finally {
  db.close();
}

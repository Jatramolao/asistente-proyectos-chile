import { randomUUID } from "node:crypto";
import Database from "better-sqlite3";
import type {
  AntecedentKey,
  AntecedentOrigin,
  AntecedentValue,
  ChecklistStatus,
  ConfirmationStatus,
  ProjectAntecedent,
} from "@/domain/types";

type ProjectRow = {
  id: string;
  user_id: string;
  name: string;
  narrative: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ChecklistProgressRecord = {
  itemKey: string;
  status: ChecklistStatus;
  note: string | null;
  reason: string | null;
  updatedAt: string;
};

type AntecedentRow = {
  id: string;
  project_id: string;
  key: AntecedentKey;
  value_json: string | null;
  confirmation_status: ConfirmationStatus;
  origin: AntecedentOrigin;
  source_excerpt: string | null;
  updated_at: string;
};

export type ProjectRecord = {
  id: string;
  userId: string;
  name: string;
  narrative: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

function mapProject(row: ProjectRow): ProjectRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    narrative: row.narrative,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapAntecedent(row: AntecedentRow): ProjectAntecedent {
  return {
    id: row.id,
    projectId: row.project_id,
    key: row.key,
    value: row.value_json === null ? null : (JSON.parse(row.value_json) as AntecedentValue),
    confirmationStatus: row.confirmation_status,
    origin: row.origin,
    sourceExcerpt: row.source_excerpt,
    updatedAt: row.updated_at,
  };
}

export function projectRepository(db: Database.Database) {
  const createProject = db.prepare(
    `INSERT INTO app_project (id, user_id, name, narrative, status, created_at, updated_at)
     VALUES (@id, @userId, @name, @narrative, 'active', @now, @now)`,
  );
  const getProject = db.prepare("SELECT * FROM app_project WHERE id = ? AND user_id = ?");
  const listProjects = db.prepare("SELECT * FROM app_project WHERE user_id = ? ORDER BY updated_at DESC");
  const ownsProject = db.prepare("SELECT 1 FROM app_project WHERE id = ? AND user_id = ?");
  const findAntecedent = db.prepare("SELECT id FROM app_antecedent WHERE project_id = ? AND key = ?");
  const insertAntecedent = db.prepare(
    `INSERT INTO app_antecedent
      (id, project_id, key, value_json, confirmation_status, origin, source_excerpt, updated_at)
     VALUES (@id, @projectId, @key, @valueJson, @confirmationStatus, @origin, @sourceExcerpt, @now)`,
  );
  const updateAntecedent = db.prepare(
    `UPDATE app_antecedent
     SET value_json = @valueJson, confirmation_status = @confirmationStatus,
         origin = @origin, source_excerpt = @sourceExcerpt, updated_at = @now
     WHERE id = @id AND project_id = @projectId`,
  );
  const insertHistory = db.prepare(
    `INSERT INTO app_antecedent_history
      (id, antecedent_id, value_json, confirmation_status, changed_by, changed_at)
     VALUES (@id, @antecedentId, @valueJson, @confirmationStatus, @changedBy, @now)`,
  );
  const listAntecedents = db.prepare(
    `SELECT a.* FROM app_antecedent a
     INNER JOIN app_project p ON p.id = a.project_id
     WHERE a.project_id = ? AND p.user_id = ?
     ORDER BY a.key`,
  );
  const upsertProgress = db.prepare(
    `INSERT INTO app_checklist_progress (project_id, item_key, status, note, reason, updated_at)
     VALUES (@projectId, @itemKey, @status, @note, @reason, @now)
     ON CONFLICT(project_id, item_key) DO UPDATE SET
       status = excluded.status,
       note = excluded.note,
       reason = excluded.reason,
       updated_at = excluded.updated_at`,
  );
  const listProgress = db.prepare(
    `SELECT cp.* FROM app_checklist_progress cp
     INNER JOIN app_project p ON p.id = cp.project_id
     WHERE cp.project_id = ? AND p.user_id = ?
     ORDER BY cp.item_key`,
  );

  const upsertAntecedentTransaction = db.transaction(
    (userId: string, projectId: string, input: {
      key: AntecedentKey;
      value: AntecedentValue;
      confirmationStatus: ConfirmationStatus;
      origin: AntecedentOrigin;
      sourceExcerpt?: string | null;
    }) => {
      if (!ownsProject.get(projectId, userId)) return null;

      const existing = findAntecedent.get(projectId, input.key) as { id: string } | undefined;
      const antecedentId = existing?.id ?? randomUUID();
      const now = new Date().toISOString();
      const values = {
        id: antecedentId,
        projectId,
        key: input.key,
        valueJson: JSON.stringify(input.value),
        confirmationStatus: input.confirmationStatus,
        origin: input.origin,
        sourceExcerpt: input.sourceExcerpt ?? null,
        now,
      };

      if (existing) updateAntecedent.run(values);
      else insertAntecedent.run(values);

      insertHistory.run({
        id: randomUUID(),
        antecedentId,
        valueJson: values.valueJson,
        confirmationStatus: input.confirmationStatus,
        changedBy: userId,
        now,
      });

      return antecedentId;
    },
  );

  return {
    selectCall(userId: string, projectId: string, callId: string): boolean {
      if (!ownsProject.get(projectId, userId)) return false;
      db.prepare("INSERT OR IGNORE INTO app_project_call (project_id, call_id, selected_at) VALUES (?, ?, ?)").run(projectId, callId, new Date().toISOString());
      return true;
    },

    listSelectedCalls(userId: string, projectId: string): string[] {
      if (!ownsProject.get(projectId, userId)) return [];
      return (db.prepare("SELECT call_id FROM app_project_call WHERE project_id = ? ORDER BY selected_at, call_id").all(projectId) as { call_id: string }[]).map(row => row.call_id);
    },

    removeSelectedCall(userId: string, projectId: string, callId: string): boolean {
      if (!ownsProject.get(projectId, userId)) return false;
      db.prepare("DELETE FROM app_project_call WHERE project_id = ? AND call_id = ?").run(projectId, callId);
      return true;
    },

    create(input: { userId: string; name: string; narrative: string }): ProjectRecord {
      const now = new Date().toISOString();
      const id = randomUUID();
      createProject.run({ ...input, id, now });
      return { id, ...input, status: "active", createdAt: now, updatedAt: now };
    },

    getById(userId: string, projectId: string): ProjectRecord | null {
      const row = getProject.get(projectId, userId) as ProjectRow | undefined;
      return row ? mapProject(row) : null;
    },

    list(userId: string): ProjectRecord[] {
      return (listProjects.all(userId) as ProjectRow[]).map(mapProject);
    },

    upsertAntecedent(
      userId: string,
      projectId: string,
      input: {
        key: AntecedentKey;
        value: AntecedentValue;
        confirmationStatus: ConfirmationStatus;
        origin: AntecedentOrigin;
        sourceExcerpt?: string | null;
      },
    ): string | null {
      return upsertAntecedentTransaction(userId, projectId, input);
    },

    listAntecedents(userId: string, projectId: string): ProjectAntecedent[] {
      return (listAntecedents.all(projectId, userId) as AntecedentRow[]).map(mapAntecedent);
    },

    setChecklistProgress(
      userId: string,
      projectId: string,
      input: { itemKey: string; status: ChecklistStatus; note?: string | null; reason?: string | null },
    ): boolean {
      if (!ownsProject.get(projectId, userId)) return false;
      upsertProgress.run({
        projectId,
        itemKey: input.itemKey,
        status: input.status,
        note: input.note ?? null,
        reason: input.reason ?? null,
        now: new Date().toISOString(),
      });
      return true;
    },

    getChecklistProgress(userId: string, projectId: string): ChecklistProgressRecord[] {
      return (listProgress.all(projectId, userId) as Array<{
        item_key: string;
        status: ChecklistStatus;
        note: string | null;
        reason: string | null;
        updated_at: string;
      }>).map((row) => ({
        itemKey: row.item_key,
        status: row.status,
        note: row.note,
        reason: row.reason,
        updatedAt: row.updated_at,
      }));
    },
  };
}

export function catalogRepository(db: Database.Database) {
  const upsert = db.prepare(
    `INSERT INTO app_catalog_snapshot (id, version, payload_json, published_at)
     VALUES (@id, @version, @payloadJson, @publishedAt)
     ON CONFLICT(version) DO UPDATE SET
       payload_json = excluded.payload_json,
       published_at = excluded.published_at`,
  );
  const latest = db.prepare("SELECT * FROM app_catalog_snapshot ORDER BY published_at DESC LIMIT 1");

  return {
    upsertSnapshot(input: { id: string; version: string; payloadJson: string; publishedAt: string }): void {
      upsert.run(input);
    },

    getLatestSnapshot(): { version: string; payloadJson: string; publishedAt: string } | null {
      const row = latest.get() as { version: string; payload_json: string; published_at: string } | undefined;
      return row ? { version: row.version, payloadJson: row.payload_json, publishedAt: row.published_at } : null;
    },
  };
}

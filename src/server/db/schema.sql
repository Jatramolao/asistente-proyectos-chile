PRAGMA foreign_keys = ON;

-- Better Auth core tables. Kept in the same SQLite database so a fresh
-- installation can register users without a separate manual migration.
CREATE TABLE IF NOT EXISTS "user" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "emailVerified" INTEGER NOT NULL,
  "image" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "expiresAt" DATE NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");

CREATE TABLE IF NOT EXISTS "account" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "issuer" TEXT NOT NULL,
  "accountId" TEXT NOT NULL,
  "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken" TEXT,
  "refreshToken" TEXT,
  "idToken" TEXT,
  "accessTokenExpiresAt" DATE,
  "refreshTokenExpiresAt" DATE,
  "scope" TEXT,
  "password" TEXT,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "account_issuer_accountId_uidx" ON "account" ("issuer", "accountId");

CREATE TABLE IF NOT EXISTS "verification" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "identifier" TEXT NOT NULL,
  "value" TEXT NOT NULL,
  "expiresAt" DATE NOT NULL,
  "createdAt" DATE NOT NULL,
  "updatedAt" DATE NOT NULL
);

CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");

CREATE TABLE IF NOT EXISTS app_project (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  narrative TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS app_project_user_updated_idx
  ON app_project(user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS app_antecedent (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES app_project(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value_json TEXT,
  confirmation_status TEXT NOT NULL,
  origin TEXT NOT NULL,
  source_excerpt TEXT,
  updated_at TEXT NOT NULL,
  UNIQUE(project_id, key)
);

CREATE TABLE IF NOT EXISTS app_antecedent_history (
  id TEXT PRIMARY KEY,
  antecedent_id TEXT NOT NULL REFERENCES app_antecedent(id) ON DELETE CASCADE,
  value_json TEXT,
  confirmation_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_catalog_snapshot (
  id TEXT PRIMARY KEY,
  version TEXT NOT NULL UNIQUE,
  payload_json TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_checklist_progress (
  project_id TEXT NOT NULL REFERENCES app_project(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  reason TEXT,
  updated_at TEXT NOT NULL,
  PRIMARY KEY(project_id, item_key)
);

CREATE TABLE IF NOT EXISTS app_event (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  name TEXT NOT NULL,
  properties_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS app_project_call (
  project_id TEXT NOT NULL REFERENCES app_project(id) ON DELETE CASCADE,
  call_id TEXT NOT NULL,
  selected_at TEXT NOT NULL,
  PRIMARY KEY (project_id, call_id)
);

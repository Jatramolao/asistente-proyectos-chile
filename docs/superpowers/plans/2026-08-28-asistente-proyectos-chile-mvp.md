# Asistente de Proyectos Chile MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una aplicación web local y funcional que convierta una idea tecnológica en una ficha viva, la relacione con tres instrumentos públicos reales y genere checklists trazables sin preevaluar documentos.

**Architecture:** Aplicación monolítica modular con Next.js App Router. Las rutas y Server Actions consumen una capa de servicios de dominio; los servicios dependen de repositorios SQLite y de motores puros para extracción, reglas y checklist. El catálogo piloto se publica desde archivos versionados revisados manualmente, de modo que ninguna respuesta generativa pueda alterar requisitos oficiales.

**Tech Stack:** Node.js 24, npm, Next.js App Router, React, TypeScript estricto, Tailwind CSS, Better Auth, better-sqlite3, Zod, Vitest, React Testing Library y Playwright.

**Spec:** `docs/superpowers/specs/2026-08-27-asistente-proyectos-chile-design.md`

## Global Constraints

- La experiencia parte desde la idea y el proyecto, no desde un buscador de fondos.
- Los datos inferidos siempre se rotulan “Inferido, pendiente de confirmación”.
- Solo antecedentes confirmados por el usuario pueden provocar “No compatible actualmente”.
- “Compatible” siempre se presenta como “Compatible para revisar”.
- “Completado” siempre se presenta como “Completado por el usuario, no validado”.
- La aplicación no carga ni evalúa documentos en el MVP.
- Cada requisito, beneficio y explicación material debe enlazar una fuente oficial versionada.
- Región, año y versión pertenecen a una convocatoria; nunca se generalizan desde una convocatoria regional al instrumento nacional.
- El catálogo inicial declara explícitamente que cubre tres instrumentos piloto.
- La aplicación debe funcionar sin una clave de IA mediante extracción conservadora y edición manual.
- La interfaz debe operar desde 360 px, por teclado, con foco visible, contraste WCAG AA y estados que no dependan solo del color.
- Las fechas se muestran de forma absoluta en zona horaria `America/Santiago`.
- Node.js mínimo `24.0.0`; TypeScript debe usar `strict: true`.

---

## File Map

### Configuración y pruebas

- `package.json`: dependencias y comandos únicos de desarrollo, migración, seed, pruebas y verificación.
- `tsconfig.json`: TypeScript estricto y alias `@/*`.
- `next.config.ts`: configuración de Next.js y runtime Node.
- `postcss.config.mjs`: integración Tailwind.
- `vitest.config.mts`, `vitest.setup.ts`: pruebas unitarias y de componentes.
- `playwright.config.ts`: recorridos E2E en Chromium desktop y móvil.
- `.env.example`: rutas y secretos requeridos sin valores sensibles.
- `.github/workflows/ci.yml`: typecheck, lint, unitarias, build y E2E.

### Aplicación

- `src/app/layout.tsx`, `src/app/globals.css`: shell, tipografía, tokens y estilos accesibles.
- `src/app/page.tsx`: portada y cobertura declarada.
- `src/app/(auth)/ingresar/page.tsx`, `src/app/(auth)/registro/page.tsx`: acceso y registro.
- `src/app/api/auth/[...all]/route.ts`: endpoint de Better Auth.
- `src/app/(app)/layout.tsx`: navegación autenticada.
- `src/app/(app)/proyectos/page.tsx`: lista de proyectos.
- `src/app/(app)/proyectos/nuevo/page.tsx`: captura de idea y propuestas inferidas.
- `src/app/(app)/proyectos/[projectId]/page.tsx`: resumen y próxima acción.
- `src/app/(app)/proyectos/[projectId]/ficha/page.tsx`: ficha viva editable.
- `src/app/(app)/proyectos/[projectId]/oportunidades/page.tsx`: relaciones calculadas.
- `src/app/(app)/proyectos/[projectId]/oportunidades/[callId]/page.tsx`: detalle oficial.
- `src/app/(app)/proyectos/[projectId]/checklist/page.tsx`: checklist transversal.
- `src/app/(app)/proyectos/[projectId]/fuentes/page.tsx`: trazabilidad.
- `src/app/actions/*.ts`: mutaciones validadas y autorizadas.

### Dominio y datos

- `src/domain/types.ts`: contratos canónicos.
- `src/domain/antecedents.ts`: definiciones de la ficha viva.
- `src/domain/extract-idea.ts`: extractor conservador sin servicios externos.
- `src/domain/match.ts`: evaluación determinista de reglas.
- `src/domain/checklist.ts`: deduplicación y preservación de requisitos específicos.
- `src/domain/next-action.ts`: cálculo explicable de la siguiente acción.
- `src/server/db/client.ts`: conexión SQLite.
- `src/server/db/migrate.ts`: migraciones idempotentes.
- `src/server/db/schema.sql`: tablas e índices propios.
- `src/server/db/repositories.ts`: consultas parametrizadas y aislamiento por `userId`.
- `src/server/auth.ts`, `src/server/auth-client.ts`, `src/server/session.ts`: autenticación y autorización.
- `src/server/services/projects.ts`: orquestación de proyecto, ficha y resultados.
- `src/server/services/catalog.ts`: lectura de catálogo y control de frescura.
- `src/catalog/pilot.json`: tres instrumentos y convocatorias versionadas.
- `src/catalog/pilot.schema.ts`: validación Zod del archivo editorial.
- `scripts/seed.ts`: validación y publicación idempotente del catálogo.

### Componentes

- `src/components/app-shell.tsx`: navegación responsive.
- `src/components/status-badge.tsx`: estados con texto e icono.
- `src/components/source-link.tsx`: enlace oficial, ámbito y revisión.
- `src/components/antecedent-field.tsx`: edición y confirmación.
- `src/components/opportunity-card.tsx`: resumen de relación.
- `src/components/checklist-item.tsx`: progreso declarado.
- `src/components/assistant-panel.tsx`: ayuda contextual basada en catálogo.
- `src/components/coverage-notice.tsx`: alcance piloto visible.
- `src/components/empty-state.tsx`, `src/components/error-message.tsx`: estados consistentes.

### Pruebas

- `src/domain/*.test.ts`: reglas puras.
- `src/server/db/repositories.test.ts`: persistencia e aislamiento.
- `src/catalog/pilot.test.ts`: integridad y fuentes.
- `src/components/*.test.tsx`: semántica y accesibilidad básica.
- `e2e/project-flow.spec.ts`: creación, ficha, oportunidades y checklist.
- `e2e/account-isolation.spec.ts`: separación entre usuarios.
- `e2e/mobile-accessibility.spec.ts`: viewport móvil, teclado y etiquetas.

---

### Task 1: Scaffold ejecutable y contrato de calidad

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`
- Create: `playwright.config.ts`
- Create: `.env.example`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Test: `src/app/page.test.tsx`

**Interfaces:**
- Consumes: Node.js `>=24.0.0` and npm.
- Produces: commands `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:run`, `test:e2e`, `db:migrate`, `db:seed`, `verify`; alias `@/*`.

- [ ] **Step 1: Write the page smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("declares the pilot coverage and product limit", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /ordena tu idea/i })).toBeDefined();
    expect(screen.getByText(/catálogo piloto: 3 instrumentos/i)).toBeDefined();
    expect(screen.getByText(/no evalúa ni valida documentos/i)).toBeDefined();
  });
});
```

- [ ] **Step 2: Install the framework and test dependencies**

Run:

```bash
npm init -y
npm install next@latest react@latest react-dom@latest better-auth better-sqlite3 zod lucide-react
npm install -D typescript @types/node @types/react @types/react-dom @types/better-sqlite3 tailwindcss @tailwindcss/postcss eslint eslint-config-next vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths @playwright/test tsx
```

Expected: `package-lock.json` records resolved versions and `npm audit` reports no unhandled critical vulnerability.

- [ ] **Step 3: Configure scripts and strict TypeScript**

Set these scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:run": "vitest run",
    "test:e2e": "playwright test",
    "db:migrate": "tsx src/server/db/migrate.ts",
    "db:seed": "tsx scripts/seed.ts",
    "verify": "npm run lint && npm run typecheck && npm run test:run && npm run build"
  }
}
```

Use this compiler core in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Implement the minimal accessible shell**

```tsx
export default function HomePage() {
  return (
    <main id="contenido" className="mx-auto max-w-5xl px-5 py-16">
      <p>Asistente de Proyectos Chile</p>
      <h1>Ordena tu idea y descubre qué necesitas preparar</h1>
      <p>Catálogo piloto: 3 instrumentos públicos de Sercotec, Corfo y FOSIS.</p>
      <p>Esta herramienta informa y organiza; no evalúa ni valida documentos.</p>
      <a href="/registro">Crear mi proyecto</a>
    </main>
  );
}
```

- [ ] **Step 5: Run the first quality gate**

Run: `npm run test:run -- src/app/page.test.tsx && npm run typecheck && npm run build`  
Expected: one passing test, zero type errors and successful production build.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs vitest.config.mts vitest.setup.ts playwright.config.ts .env.example src/app
git commit -m "chore: scaffold project assistant application"
```

---

### Task 2: Contratos de dominio y ficha viva

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/antecedents.ts`
- Test: `src/domain/antecedents.test.ts`

**Interfaces:**
- Consumes: none.
- Produces: `AntecedentKey`, `AntecedentDefinition`, `ProjectAntecedent`, `Call`, `Requirement`, `Rule`, `MatchResult`, `ChecklistItem`; `ANTECEDENT_DEFINITIONS`; `getAntecedentDefinition(key)`.

- [ ] **Step 1: Write the failing definition tests**

```ts
import { describe, expect, it } from "vitest";
import { ANTECEDENT_DEFINITIONS, getAntecedentDefinition } from "./antecedents";

describe("antecedent definitions", () => {
  it("covers all six approved sections", () => {
    expect(new Set(ANTECEDENT_DEFINITIONS.map((item) => item.section))).toEqual(
      new Set(["essence", "market", "technology", "execution", "impact", "applicant"]),
    );
  });

  it("exposes region as a decisive applicant antecedent", () => {
    expect(getAntecedentDefinition("applicant.region")).toMatchObject({
      section: "applicant",
      valueType: "region",
      decisive: true,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test:run -- src/domain/antecedents.test.ts`  
Expected: FAIL because `antecedents.ts` does not exist.

- [ ] **Step 3: Define exact domain unions**

```ts
export type AntecedentSection =
  | "essence"
  | "market"
  | "technology"
  | "execution"
  | "impact"
  | "applicant";

export type ConfirmationStatus = "inferred" | "confirmed" | "corrected" | "missing" | "stale";
export type MatchStatus =
  | "compatible_to_review"
  | "requires_preparation"
  | "not_compatible_now"
  | "insufficient_information"
  | "call_not_current";
export type ChecklistStatus =
  | "pending"
  | "in_progress"
  | "user_completed_unvalidated"
  | "not_applicable"
  | "institution_verifies"
  | "future_if_selected"
  | "stale";
export type RuleOperator = "equals" | "not_equals" | "in" | "not_in" | "gte" | "lte" | "is_known";
export type RuleOutcome = "pass" | "contradiction" | "unknown";
export type AntecedentKey =
  | "essence.problem"
  | "essence.solution"
  | "essence.customer"
  | "essence.territory"
  | "market.revenue_status"
  | "technology.component"
  | "technology.novelty"
  | "technology.maturity"
  | "execution.team"
  | "execution.budget"
  | "execution.cofunding"
  | "impact.outcomes"
  | "applicant.age"
  | "applicant.region"
  | "applicant.formalization"
  | "applicant.sii_first_category"
  | "applicant.has_sales"
  | "applicant.rsh_percent"
  | "applicant.company_ownership_percent"
  | "applicant.labor_tax_debt"
  | "applicant.alimony_registry";

export type AntecedentValueType =
  | "short_text"
  | "long_text"
  | "number"
  | "money"
  | "boolean"
  | "region"
  | "maturity"
  | "status";

export type AntecedentDefinition = {
  key: AntecedentKey;
  section: AntecedentSection;
  label: string;
  valueType: AntecedentValueType;
  decisive: boolean;
};
```

- [ ] **Step 4: Implement the definition registry**

```ts
export const ANTECEDENT_DEFINITIONS = [
  { key: "essence.problem", section: "essence", label: "Problema u oportunidad", valueType: "long_text", decisive: false },
  { key: "essence.solution", section: "essence", label: "Solución propuesta", valueType: "long_text", decisive: false },
  { key: "essence.customer", section: "essence", label: "Cliente o beneficiario", valueType: "short_text", decisive: false },
  { key: "essence.territory", section: "essence", label: "Territorio de impacto", valueType: "region", decisive: true },
  { key: "market.revenue_status", section: "market", label: "Estado de ingresos o ventas", valueType: "status", decisive: true },
  { key: "technology.component", section: "technology", label: "Componente tecnológico", valueType: "long_text", decisive: true },
  { key: "technology.novelty", section: "technology", label: "Novedad frente a alternativas", valueType: "long_text", decisive: true },
  { key: "technology.maturity", section: "technology", label: "Madurez de la solución", valueType: "maturity", decisive: true },
  { key: "execution.team", section: "execution", label: "Equipo y capacidades", valueType: "long_text", decisive: false },
  { key: "execution.budget", section: "execution", label: "Presupuesto estimado", valueType: "money", decisive: false },
  { key: "execution.cofunding", section: "execution", label: "Cofinanciamiento disponible", valueType: "money", decisive: true },
  { key: "impact.outcomes", section: "impact", label: "Resultados e impacto esperado", valueType: "long_text", decisive: false },
  { key: "applicant.age", section: "applicant", label: "Edad", valueType: "number", decisive: true },
  { key: "applicant.region", section: "applicant", label: "Región de residencia", valueType: "region", decisive: true },
  { key: "applicant.formalization", section: "applicant", label: "Situación de formalización", valueType: "status", decisive: true },
  { key: "applicant.sii_first_category", section: "applicant", label: "Inicio de actividades en primera categoría", valueType: "boolean", decisive: true },
  { key: "applicant.has_sales", section: "applicant", label: "Ventas formales", valueType: "boolean", decisive: true },
  { key: "applicant.rsh_percent", section: "applicant", label: "Tramo del Registro Social de Hogares", valueType: "number", decisive: true },
  { key: "applicant.company_ownership_percent", section: "applicant", label: "Mayor participación en sociedades existentes", valueType: "number", decisive: true },
  { key: "applicant.labor_tax_debt", section: "applicant", label: "Deudas laborales, previsionales o tributarias", valueType: "boolean", decisive: true },
  { key: "applicant.alimony_registry", section: "applicant", label: "Registro de deudores de pensiones de alimentos", valueType: "boolean", decisive: true }
] as const satisfies readonly AntecedentDefinition[];

export function getAntecedentDefinition(key: AntecedentKey): AntecedentDefinition {
  const definition = ANTECEDENT_DEFINITIONS.find((item) => item.key === key);
  if (!definition) throw new Error(`Unknown antecedent key: ${key}`);
  return definition;
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npm run test:run -- src/domain/antecedents.test.ts && npm run typecheck`  
Expected: both tests pass and TypeScript reports no errors.

- [ ] **Step 6: Commit**

```bash
git add src/domain
git commit -m "feat: define project and funding domain contracts"
```

---

### Task 3: SQLite, migraciones y repositorios aislados

**Files:**
- Create: `src/server/db/client.ts`
- Create: `src/server/db/schema.sql`
- Create: `src/server/db/migrate.ts`
- Create: `src/server/db/repositories.ts`
- Test: `src/server/db/repositories.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: `ProjectAntecedent`, `MatchResult`, `ChecklistStatus` from `src/domain/types.ts`.
- Produces: `createDb(path)`, `runMigrations(db)`, `projectRepository(db)`, `catalogRepository(db)`; every project method requires `userId`.

- [ ] **Step 1: Write the isolation test**

```ts
import Database from "better-sqlite3";
import { describe, expect, it } from "vitest";
import { runMigrations } from "./migrate";
import { projectRepository } from "./repositories";

describe("projectRepository", () => {
  it("never returns a project owned by another user", () => {
    const db = new Database(":memory:");
    runMigrations(db);
    const projects = projectRepository(db);
    const created = projects.create({ userId: "user-a", name: "Agua IA", narrative: "Detecta fugas" });

    expect(projects.getById("user-b", created.id)).toBeNull();
    expect(projects.getById("user-a", created.id)?.name).toBe("Agua IA");
  });
});
```

- [ ] **Step 2: Run the test to verify failure**

Run: `npm run test:run -- src/server/db/repositories.test.ts`  
Expected: FAIL because migrations and repository are missing.

- [ ] **Step 3: Create the application schema**

`src/server/db/schema.sql` must create these own tables with foreign keys enabled:

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_project (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  narrative TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS app_project_user_updated_idx ON app_project(user_id, updated_at DESC);

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
```

- [ ] **Step 4: Implement parameterized repositories**

The ownership predicate must be inside every query, not checked after fetching:

```ts
getById(userId: string, projectId: string): ProjectRecord | null {
  const row = db.prepare(
    "SELECT * FROM app_project WHERE id = ? AND user_id = ?",
  ).get(projectId, userId) as ProjectRow | undefined;
  return row ? mapProject(row) : null;
}
```

Use `crypto.randomUUID()`, ISO timestamps and transactions for antecedent plus history updates. Add `list(userId)`, `create(input)`, `upsertAntecedent(userId, projectId, input)`, `listAntecedents(userId, projectId)`, `setChecklistProgress(userId, projectId, input)` and `getChecklistProgress(userId, projectId)`.

- [ ] **Step 5: Verify migrations and ownership**

Run: `npm run test:run -- src/server/db/repositories.test.ts && DATABASE_PATH=/tmp/asistente-proyectos-plan.sqlite npm run db:migrate`  
Expected: isolation test passes and a second migration run exits successfully without duplicate-table errors.

- [ ] **Step 6: Ignore local database files and commit**

Append `*.sqlite`, `*.sqlite-shm` and `*.sqlite-wal` to `.gitignore`, then run:

```bash
git add .gitignore src/server/db
git commit -m "feat: add isolated SQLite project persistence"
```

---

### Task 4: Autenticación y autorización centralizada

**Files:**
- Create: `src/server/auth.ts`
- Create: `src/server/auth-client.ts`
- Create: `src/server/session.ts`
- Create: `src/app/api/auth/[...all]/route.ts`
- Create: `src/app/(auth)/ingresar/page.tsx`
- Create: `src/app/(auth)/registro/page.tsx`
- Create: `src/components/auth-form.tsx`
- Test: `src/server/session.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: shared SQLite path from `DATABASE_PATH`.
- Produces: `auth`, `authClient`, `requireUserId(sessionLike): Promise<string>`, `requireSession(): Promise<{ userId: string }>`.

- [ ] **Step 1: Write the authorization contract test**

```ts
import { describe, expect, it } from "vitest";
import { requireUserId } from "./session";

describe("requireUserId", () => {
  it("rejects an absent session", async () => {
    await expect(requireUserId(null)).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("returns only the authenticated identifier", async () => {
    await expect(requireUserId({ user: { id: "user-1" } })).resolves.toBe("user-1");
  });
});
```

- [ ] **Step 2: Configure Better Auth against the same database**

```ts
import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const databasePath = process.env.DATABASE_PATH ?? "./data/asistente.sqlite";

export const auth = betterAuth({
  database: new Database(databasePath),
  emailAndPassword: { enabled: true, minPasswordLength: 10, maxPasswordLength: 128 },
  plugins: [nextCookies()],
  trustedOrigins: [process.env.BETTER_AUTH_URL ?? "http://localhost:3000"],
});
```

`requireSession()` obtains the current request headers, calls `auth.api.getSession({ headers })`, passes the result through `requireUserId`, and redirects absent sessions to `/ingresar`. Server Actions use only the returned `userId` when calling repositories.

Set `.env.example` to:

```dotenv
DATABASE_PATH=./data/asistente.sqlite
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-at-least-32-random-characters
```

- [ ] **Step 3: Mount the handler and client**

```ts
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/server/auth";

export const { GET, POST } = toNextJsHandler(auth);
```

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
```

- [ ] **Step 4: Implement registration and login forms**

`AuthForm` accepts `mode: "sign-in" | "sign-up"`, submits through `authClient`, renders errors in `role="alert"`, disables the submit button while pending, and redirects successful sessions to `/proyectos`. Labels must be explicit: `Nombre`, `Correo electrónico`, `Contraseña`.

- [ ] **Step 5: Run auth tests and migrate Better Auth**

Run:

```bash
npm run test:run -- src/server/session.test.ts
npx auth@latest migrate --config src/server/auth.ts --yes
```

Expected: session tests pass and Better Auth creates its user, session, account and verification tables in the configured database.

- [ ] **Step 6: Commit**

```bash
git add .env.example src/server/auth.ts src/server/auth-client.ts src/server/session.ts src/app/api/auth src/app/'(auth)' src/components/auth-form.tsx
git commit -m "feat: add authenticated user sessions"
```

---

### Task 5: Catálogo editorial piloto y fuentes oficiales

**Files:**
- Create: `src/catalog/pilot.schema.ts`
- Create: `src/catalog/pilot.json`
- Create: `src/catalog/pilot.test.ts`
- Create: `scripts/seed.ts`
- Create: `src/server/services/catalog.ts`

**Interfaces:**
- Consumes: `Call`, `Requirement`, `Rule` domain contracts and `catalogRepository(db)`.
- Produces: `PilotCatalogSchema`, `loadPilotCatalog()`, `getCatalogSnapshot()`, version `2026-08-28.pilot.1`.

- [ ] **Step 1: Write catalog integrity tests**

```ts
import { describe, expect, it } from "vitest";
import rawCatalog from "./pilot.json";
import { PilotCatalogSchema } from "./pilot.schema";

describe("pilot catalog", () => {
  const catalog = PilotCatalogSchema.parse(rawCatalog);

  it("contains exactly the declared pilot institutions", () => {
    expect(catalog.instruments.map((item) => item.institutionId).sort()).toEqual(["corfo", "fosis", "sercotec"]);
  });

  it("backs every material fact with an official source", () => {
    const sourceIds = new Set(catalog.sources.map((source) => source.id));
    for (const call of catalog.calls) {
      expect(call.sourceIds.length).toBeGreaterThan(0);
      expect(call.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(call.requirements.every((item) => item.sourceIds.every((id) => sourceIds.has(id)))).toBe(true);
    }
  });

  it("does not label closed reference calls as open", () => {
    expect(catalog.calls.filter((call) => call.closesAt < "2026-08-28T00:00:00-04:00").every((call) => call.status !== "open")).toBe(true);
  });
});
```

- [ ] **Step 2: Define strict editorial validation**

The Zod schema must reject unknown keys and require:

```ts
const SourceSchema = z.object({
  id: z.string().min(1),
  institutionId: z.enum(["sercotec", "corfo", "fosis"]),
  title: z.string().min(1),
  officialUrl: z.string().url().refine((url) => /sercotec\.cl|corfo\.cl|fosis\.gob\.cl/.test(url)),
  sourceType: z.enum(["official_page", "bases", "faq", "official_notice"]),
  scope: z.string().min(1),
  reviewedAt: z.literal("2026-08-28"),
  status: z.enum(["current", "closed", "replaced", "verify"]),
}).strict();
```

Calls require ISO opening/closing timestamps, `America/Santiago`, territory, status, benefit, requirements, deterministic rules and source IDs.

- [ ] **Step 3: Encode the three real pilot records**

Use these official records and labels:

1. **Sercotec / Capital Semilla Emprende / RM 2026:** status `closed`; $3.500.000 subsidy; $200.000–$500.000 management; $3.000.000–$3.300.000 investment; 3% beneficiary contribution; taxes paid by beneficiary; person aged 18+, without first-category start, plus the published debt, alimony-registry and ownership conditions. Sources:
   - `https://www.sercotec.cl/convocatoria/capital-semilla-emprende-region-metropolitana-de-santiago-2026/`
   - `https://www.sercotec.cl/wp-content/uploads/2026/04/Bases-Semilla-EMPRENDE-2026-Metropolitana-VB%C2%B0.pdf`
2. **Corfo / Semilla Inicia Mujeres / convocatoria nacional 2026:** status `closed` and `isReference: true`; territory `Todo Chile`; opened 12 May 2026 and closed 15 June 2026; person natural de género femenino, 18+ and resident in Chile, or eligible company led by women; idea or developed solution without sales; up to $17.000.000 covering up to 85%, with 15% beneficiary contribution. Keep `Semilla Inicia` as the parent instrument and preserve the gender-specific call name. Sources:
   - `https://www.corfo.gob.cl/sites/cpp/programa/semilla-inicia-mujer/`
   - `https://corfo.cl/sites/cpp/wp-content/uploads/2025/05/preguntasfrecuentessemillainicia2022-1.pdf`
3. **FOSIS / Emprendamos Semilla 2026:** status `closed`; idea or early-stage business; application closed 30 April 2026; availability and extra requirements depend on commune; personal conditions must remain `unknown` unless the national official page states them for Semilla. Sources:
   - `https://www.fosis.gob.cl/es/postulaciones/`
   - `https://www.fosis.gob.cl/es/noticias/FOSIS-abre-28-mil-cupos-para-emprender-con-una-inversi%C3%B3n-de-%2429-mil-millones-ID%3D650818/`
   - `https://www.fosis.gob.cl/es/noticias/FOSIS-extiende-postulaciones-al-programa-%E2%80%9CEmprendamos%E2%80%9D-hasta-el-8-de-mayo-ID%3D260657/`

Do not copy the requirements displayed for FOSIS `Emprendamos` into `Emprendamos Semilla`; encode a requirement only when its source explicitly applies to the Semilla line.

- [ ] **Step 4: Implement idempotent publication**

```ts
export function loadPilotCatalog(): PilotCatalog {
  return PilotCatalogSchema.parse(rawCatalog);
}

export function publishPilotCatalog(db: Database.Database): void {
  const catalog = loadPilotCatalog();
  catalogRepository(db).upsertSnapshot({
    id: crypto.randomUUID(),
    version: catalog.version,
    payloadJson: JSON.stringify(catalog),
    publishedAt: new Date().toISOString(),
  });
}
```

- [ ] **Step 5: Validate and seed**

Run: `npm run test:run -- src/catalog/pilot.test.ts && npm run db:seed && npm run db:seed`  
Expected: all integrity tests pass, both seed runs succeed and only one row exists for version `2026-08-28.pilot.1`.

- [ ] **Step 6: Commit**

```bash
git add src/catalog src/server/services/catalog.ts scripts/seed.ts
git commit -m "feat: publish sourced pilot funding catalog"
```

---

### Task 6: Extracción conservadora y edición de antecedentes

**Files:**
- Create: `src/domain/extract-idea.ts`
- Test: `src/domain/extract-idea.test.ts`
- Create: `src/app/actions/projects.ts`
- Create: `src/app/(app)/proyectos/nuevo/page.tsx`
- Create: `src/components/antecedent-field.tsx`
- Create: `src/components/error-message.tsx`
- Test: `src/components/antecedent-field.test.tsx`

**Interfaces:**
- Consumes: `AntecedentKey`, `ProjectAntecedent`, `projectRepository`, `requireSession`.
- Produces: `extractIdea(narrative): InferredAntecedent[]`, `createProjectAction`, `confirmAntecedentAction`.

- [ ] **Step 1: Write conservative extraction tests**

```ts
import { describe, expect, it } from "vitest";
import { extractIdea } from "./extract-idea";

describe("extractIdea", () => {
  it("keeps proposals unconfirmed and cites the narrative excerpt", () => {
    const result = extractIdea("Una plataforma usa sensores para detectar fugas de agua en edificios.");
    expect(result).toContainEqual(expect.objectContaining({
      key: "technology.component",
      confirmationStatus: "inferred",
      sourceExcerpt: expect.stringContaining("sensores"),
    }));
  });

  it("does not invent applicant facts", () => {
    const result = extractIdea("Quiero crear software para agricultores.");
    expect(result.some((item) => item.key.startsWith("applicant."))).toBe(false);
  });
});
```

- [ ] **Step 2: Implement the no-key fallback extractor**

Use sentence fragments only when explicit markers exist. Technology keywords map to `technology.component`; phrases beginning with `para`, `dirigido a` or `ayuda a` can propose `essence.customer`; no applicant, debt, sales, formalization or regional fact is inferred without an exact statement. Every proposal returns:

```ts
type InferredAntecedent = {
  key: AntecedentKey;
  value: string | number | boolean;
  confirmationStatus: "inferred";
  origin: "narrative";
  sourceExcerpt: string;
};
```

- [ ] **Step 3: Write authorized Server Actions**

Validate inputs with Zod. `createProjectAction` requires a narrative between 40 and 5,000 characters, derives a name of at most 80 characters, saves the original narrative, persists proposals and redirects to `/proyectos/{id}`. `confirmAntecedentAction` accepts only registered keys, verifies ownership in the query and records history.

- [ ] **Step 4: Build the guided creation screen**

Render one large textarea, plain-language examples, privacy warning, character count, submit state and the product limit. After creation, inferred fields display `Inferido, pendiente de confirmación` with actions `Confirmar`, `Corregir` and `Dejar pendiente`.

- [ ] **Step 5: Run unit and component checks**

Run: `npm run test:run -- src/domain/extract-idea.test.ts src/components/antecedent-field.test.tsx && npm run typecheck`  
Expected: inference labels and no-invention tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/domain/extract-idea.ts src/domain/extract-idea.test.ts src/app/actions/projects.ts src/app/'(app)'/proyectos/nuevo src/components/antecedent-field.tsx src/components/antecedent-field.test.tsx src/components/error-message.tsx
git commit -m "feat: guide project creation from a free narrative"
```

---

### Task 7: Motor determinista de relación y próxima acción

**Files:**
- Create: `src/domain/match.ts`
- Create: `src/domain/next-action.ts`
- Test: `src/domain/match.test.ts`
- Test: `src/domain/next-action.test.ts`

**Interfaces:**
- Consumes: `Call`, `Rule`, `ProjectAntecedent`, `MatchResult`.
- Produces: `evaluateRule(rule, antecedents): RuleEvaluation`, `matchCall(call, antecedents, now): MatchResult`, `chooseNextAction(context): NextAction`.

- [ ] **Step 1: Write the five-state precedence tests**

```ts
it.each([
  ["closed call", closedCall, confirmedEligible, "call_not_current"],
  ["confirmed contradiction", openCall, confirmedContradiction, "not_compatible_now"],
  ["decisive unknown", openCall, missingDecisive, "insufficient_information"],
  ["preparable gap", openCall, missingPreparable, "requires_preparation"],
  ["no blockers", openCall, confirmedEligible, "compatible_to_review"],
])("classifies %s", (_label, call, antecedents, expected) => {
  expect(matchCall(call, antecedents, NOW).status).toBe(expected);
});
```

Add a dedicated test proving that an `inferred` contradictory value produces `unknown`, never `contradiction`.

- [ ] **Step 2: Run the matcher test to verify failure**

Run: `npm run test:run -- src/domain/match.test.ts`  
Expected: FAIL because `matchCall` is missing.

- [ ] **Step 3: Implement three-valued rule evaluation**

```ts
export function evaluateRule(rule: Rule, antecedents: readonly ProjectAntecedent[]): RuleEvaluation {
  const item = antecedents.find((candidate) => candidate.key === rule.antecedentKey);
  if (!item || !["confirmed", "corrected"].includes(item.confirmationStatus)) {
    return { ruleId: rule.id, outcome: "unknown", reason: rule.unknownReason };
  }
  const passes = compare(item.value, rule.operator, rule.expectedValue);
  return {
    ruleId: rule.id,
    outcome: passes ? "pass" : "contradiction",
    reason: passes ? rule.passReason : rule.contradictionReason,
    antecedentKey: item.key,
    sourceIds: rule.sourceIds,
  };
}
```

- [ ] **Step 4: Implement exact status precedence**

Status precedence is: not current → confirmed contradiction → decisive unknown → preparable missing → compatible to review. Return `reasons`, `blockingRuleIds`, `missingAntecedentKeys`, `sourceIds` and `catalogVersion`; never return a percentage score.

- [ ] **Step 5: Implement next-action priority**

`chooseNextAction` returns the earliest of: confirm a decisive inferred antecedent; answer a decisive missing antecedent; prepare the nearest open-call requirement; review a compatible opportunity; update a stale antecedent; otherwise review sources. Include a human-readable reason and target URL.

- [ ] **Step 6: Run and commit**

Run: `npm run test:run -- src/domain/match.test.ts src/domain/next-action.test.ts && npm run typecheck`  
Expected: all five statuses, inference guard and next-action priorities pass.

```bash
git add src/domain/match.ts src/domain/match.test.ts src/domain/next-action.ts src/domain/next-action.test.ts
git commit -m "feat: classify funding relationships with explicit rules"
```

---

### Task 8: Generación de checklist transversal

**Files:**
- Create: `src/domain/checklist.ts`
- Test: `src/domain/checklist.test.ts`
- Create: `src/app/actions/checklist.ts`

**Interfaces:**
- Consumes: call requirements, mappings, matches and saved progress.
- Produces: `buildChecklist(input): ChecklistGroup[]`, `updateChecklistItemAction`.

- [ ] **Step 1: Write reuse and specificity tests**

```ts
it("reuses canonical antecedents but preserves call-specific formats", () => {
  const groups = buildChecklist(fixture);
  expect(findItems(groups, "essence.problem")).toHaveLength(1);
  expect(findItems(groups, "sercotec.rm2026.pitch_video")).toHaveLength(1);
  expect(findItems(groups, "corfo.inicia.application_form")).toHaveLength(1);
});

it("never promotes user completion to validation", () => {
  const item = buildChecklist(completedFixture).flatMap((group) => group.items)[0];
  expect(item.status).toBe("user_completed_unvalidated");
  expect(item.statusLabel).toBe("Completado por el usuario, no validado");
});
```

- [ ] **Step 2: Implement stable item keys**

Canonical requirements use `antecedent:{antecedentKey}`. Call-specific requirements use `requirement:{callId}:{requirementId}`. Group by `application`, `evaluation`, `selection` and `formalization`; attach responsible party, verifier, validity, due date, source IDs and reused call IDs.

- [ ] **Step 3: Merge manual progress safely**

Apply saved progress only when the stable key still exists. If a source version changes the requirement, retain the note but set status `stale`. `not_applicable` requires a non-empty reason. `user_completed_unvalidated` must never be produced automatically.

- [ ] **Step 4: Create the authorized progress action**

The action validates the status union, requires `reason` for `not_applicable`, verifies project ownership and redirects back with `?actualizado=1`.

- [ ] **Step 5: Run and commit**

Run: `npm run test:run -- src/domain/checklist.test.ts && npm run typecheck`  
Expected: reuse, specific-format, stale-version and unvalidated-copy tests pass.

```bash
git add src/domain/checklist.ts src/domain/checklist.test.ts src/app/actions/checklist.ts
git commit -m "feat: generate reusable unvalidated checklists"
```

---

### Task 9: Servicios y espacio central del proyecto

**Files:**
- Create: `src/server/services/projects.ts`
- Create: `src/app/(app)/layout.tsx`
- Create: `src/app/(app)/proyectos/page.tsx`
- Create: `src/app/(app)/proyectos/[projectId]/page.tsx`
- Create: `src/app/(app)/proyectos/[projectId]/ficha/page.tsx`
- Create: `src/components/app-shell.tsx`
- Create: `src/components/status-badge.tsx`
- Create: `src/components/assistant-panel.tsx`
- Create: `src/components/coverage-notice.tsx`
- Create: `src/components/empty-state.tsx`
- Test: `src/server/services/projects.test.ts`

**Interfaces:**
- Consumes: repositories, catalog service, matcher, checklist and next-action functions.
- Produces: `getProjectWorkspace(userId, projectId): ProjectWorkspaceDto`, `listProjects(userId)`.

- [ ] **Step 1: Write the workspace orchestration test**

```ts
it("returns one coherent snapshot using one catalog version", () => {
  const workspace = service.getProjectWorkspace("user-1", "project-1", NOW);
  expect(workspace.catalogVersion).toBe("2026-08-28.pilot.1");
  expect(workspace.matches.every((match) => match.catalogVersion === workspace.catalogVersion)).toBe(true);
  expect(workspace.nextAction.targetHref).toMatch(/^\/proyectos\/project-1\//);
});
```

- [ ] **Step 2: Implement the DTO boundary**

`ProjectWorkspaceDto` returns only the authenticated project, antecedent definitions and values, match summaries, checklist totals, next action, coverage notice and catalog metadata. It does not expose email, password data, raw SQL rows or internal confidence scores.

- [ ] **Step 3: Build the authenticated shell**

Desktop navigation appears at left; mobile navigation uses a labeled menu button. Include skip link, visible focus, project name and sign-out. Routes are `Resumen`, `Ficha viva`, `Oportunidades`, `Checklist` and `Fuentes`.

- [ ] **Step 4: Build project list, summary and ficha pages**

The summary shows narrative, next action, counts by relationship state and the disclaimer. The ficha renders the six approved sections and uses `AntecedentField` for all defined keys. Progress text is “antecedentes confirmados”, never “porcentaje de éxito”.

- [ ] **Step 5: Add contextual assistant without free-form claims**

`AssistantPanel` receives `title`, `explanation`, `nextQuestion`, `sourceIds` and `targetHref`. It explains terms from the current DTO and links to the relevant action; it does not generate new requirements or accept document uploads.

- [ ] **Step 6: Test responsive semantics and commit**

Run: `npm run test:run -- src/server/services/projects.test.ts src/components && npm run typecheck`  
Expected: DTO consistency, navigation labels, status text and coverage notice pass.

```bash
git add src/server/services/projects.ts src/app/'(app)' src/components
git commit -m "feat: add the project-centered guided workspace"
```

---

### Task 10: Oportunidades, detalle, checklist y fuentes

**Files:**
- Create: `src/app/(app)/proyectos/[projectId]/oportunidades/page.tsx`
- Create: `src/app/(app)/proyectos/[projectId]/oportunidades/[callId]/page.tsx`
- Create: `src/app/(app)/proyectos/[projectId]/checklist/page.tsx`
- Create: `src/app/(app)/proyectos/[projectId]/fuentes/page.tsx`
- Create: `src/components/opportunity-card.tsx`
- Create: `src/components/checklist-item.tsx`
- Create: `src/components/source-link.tsx`
- Test: `src/components/opportunity-card.test.tsx`
- Test: `src/components/checklist-item.test.tsx`

**Interfaces:**
- Consumes: `ProjectWorkspaceDto` and authorized checklist action.
- Produces: four complete user-facing views for results and traceability.

- [ ] **Step 1: Write copy-safety component tests**

```tsx
it("shows compatibility as review guidance", () => {
  render(<OpportunityCard opportunity={compatibleFixture} />);
  expect(screen.getByText("Compatible para revisar")).toBeDefined();
  expect(screen.queryByText(/^Elegible$/)).toBeNull();
});

it("shows the source beside a blocking condition", () => {
  render(<OpportunityCard opportunity={blockedFixture} />);
  expect(screen.getByText(/inicio de actividades/i)).toBeDefined();
  expect(screen.getByRole("link", { name: /ver fuente oficial/i })).toBeDefined();
});
```

- [ ] **Step 2: Build the opportunity list**

Order open/current calls first, then status precedence `compatible_to_review`, `requires_preparation`, `insufficient_information`, `not_compatible_now`, `call_not_current`. Each card includes institution, type, status, reasons, missing data, benefit, contribution, territory, absolute dates, reviewed date and official source.

- [ ] **Step 3: Build opportunity detail**

Sections: `Qué entrega`, `A quién se dirige`, `Condiciones`, `Qué debes aportar`, `Gastos`, `Etapas`, `Checklist` and `Fuentes oficiales`. Closed calls render a persistent `Convocatoria no vigente` notice above all content.

- [ ] **Step 4: Build checklist filters and updates**

Filters use URL search params: `estado`, `convocatoria`, `etapa`, `responsable`. The update form offers the seven approved statuses. “No aplica” reveals a required reason. Each row shows reuse count, verifier, stage, validity and sources.

- [ ] **Step 5: Build the source audit view**

Group sources by institution. Display title, type, scope, call, status, reviewed date and external link. Add `La fuente oficial y la institución convocante prevalecen` at the top.

- [ ] **Step 6: Test and commit**

Run: `npm run test:run -- src/components/opportunity-card.test.tsx src/components/checklist-item.test.tsx && npm run typecheck`  
Expected: safe status copy, source links, non-applicable reason and closed-call notice tests pass.

```bash
git add src/app/'(app)'/proyectos/'[projectId]'/oportunidades src/app/'(app)'/proyectos/'[projectId]'/checklist src/app/'(app)'/proyectos/'[projectId]'/fuentes src/components
git commit -m "feat: present sourced opportunities and checklists"
```

---

### Task 11: Analítica privada, E2E y accesibilidad

**Files:**
- Create: `src/server/services/events.ts`
- Create: `src/app/actions/events.ts`
- Create: `e2e/project-flow.spec.ts`
- Create: `e2e/account-isolation.spec.ts`
- Create: `e2e/mobile-accessibility.spec.ts`
- Modify: `playwright.config.ts`

**Interfaces:**
- Consumes: event repository, auth pages and all product routes.
- Produces: `recordEvent(userId, name, properties)` and executable acceptance coverage.

- [ ] **Step 1: Restrict analytics payloads**

Allow only these event names: `project_created`, `antecedent_confirmed`, `opportunities_viewed`, `official_source_opened`, `checklist_status_changed`. Reject property keys containing `narrative`, `value`, `email`, `name`, `note` or `document`; accepted properties are counts, IDs of catalog objects and elapsed milliseconds.

- [ ] **Step 2: Write the complete guided-flow E2E test**

```ts
test("creates a project and tracks an unvalidated checklist", async ({ page }) => {
  await register(page, "persona1@example.test");
  await page.getByRole("link", { name: "Crear mi proyecto" }).click();
  await page.getByLabel("Cuéntanos tu idea de proyecto").fill(
    "Quiero crear una plataforma con sensores para detectar fugas de agua en edificios y ayudar a administradores a reducir pérdidas.",
  );
  await page.getByRole("button", { name: "Ordenar mi idea" }).click();
  await expect(page.getByText("Inferido, pendiente de confirmación").first()).toBeVisible();
  await page.getByRole("link", { name: "Oportunidades" }).click();
  await expect(page.getByText("Capital Semilla Emprende")).toBeVisible();
  await page.getByRole("link", { name: "Checklist" }).click();
  await page.getByLabel("Estado").first().selectOption("user_completed_unvalidated");
  await expect(page.getByText("Completado por el usuario, no validado")).toBeVisible();
});
```

- [ ] **Step 3: Write account isolation E2E**

Create a project as user A, capture its URL, sign out, register user B, navigate directly to A's URL and assert a 404-style `Proyecto no encontrado` response without revealing the project name or narrative.

- [ ] **Step 4: Write mobile and keyboard E2E**

At viewport `360x800`, assert no horizontal body overflow, open navigation by its accessible name, traverse the creation form with `Tab`, confirm visible focus, and verify every status badge includes text in addition to color.

- [ ] **Step 5: Run E2E suite**

Run:

```bash
npx playwright install chromium
npm run db:migrate
npm run db:seed
npm run test:e2e
```

Expected: guided flow, direct-URL isolation and mobile keyboard scenarios all pass in Chromium.

- [ ] **Step 6: Commit**

```bash
git add src/server/services/events.ts src/app/actions/events.ts e2e playwright.config.ts
git commit -m "test: cover guided flow privacy and accessibility"
```

---

### Task 12: CI, documentación operativa y verificación final

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `README.md`
- Create: `docs/catalog-maintenance.md`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: all commands produced by Tasks 1–11.
- Produces: reproducible setup, editorial update procedure and CI gate.

- [ ] **Step 1: Add CI with an explicit database lifecycle**

```yaml
name: ci
on:
  push:
  pull_request:
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: cp .env.example .env
      - run: npm run db:migrate
      - run: npm run db:seed
      - run: npm run verify
      - run: npm run test:e2e
```

- [ ] **Step 2: Document local operation**

`README.md` must include exact commands:

```bash
cp .env.example .env
openssl rand -base64 32
npm ci
npm run db:migrate
npm run db:seed
npm run dev
```

Explain how to place the generated secret in `BETTER_AUTH_SECRET`, open `http://localhost:3000`, run `npm run verify`, and reset only the local development database by moving `data/asistente.sqlite` to a backup filename.

- [ ] **Step 3: Document the editorial freshness workflow**

`docs/catalog-maintenance.md` must require: official domain; source type and hierarchy; territory; opening/closing timestamps; source section/page; reviewer date; rule-to-source mapping; catalog version bump; schema test; seed; UI review. It must explicitly prohibit copying a requirement between regional calls or between FOSIS program lines without a source that names the target line.

- [ ] **Step 4: Run the complete local gate**

Run:

```bash
npm run db:migrate
npm run db:seed
npm run lint
npm run typecheck
npm run test:run
npm run build
npm run test:e2e
git status --short
```

Expected: every command exits 0; unit, component and E2E tests pass; build succeeds; only intentional documentation changes remain before commit.

- [ ] **Step 5: Perform a browser acceptance pass**

Check desktop and 360 px views for: project-first entry, visible pilot coverage, six ficha sections, five opportunity states, seven checklist states, source links, absolute Chilean dates, closed-call warnings, keyboard focus and the no-validation disclaimer. Record any failure as a test before fixing it.

- [ ] **Step 6: Commit the release-ready MVP**

```bash
git add .github README.md docs/catalog-maintenance.md .gitignore
git commit -m "docs: add reproducible MVP operations"
git status --short
```

Expected: clean working tree and a runnable first MVP on `main`.

---

## Spec Coverage Review

- Project-first guided creation: Tasks 6 and 9.
- Six-block ficha viva, confirmation and origin: Tasks 2, 3, 6 and 9.
- Three real instruments with official provenance and regional versioning: Task 5.
- Deterministic five-state relationship model: Task 7.
- Benefits, cofinancing, stages and specific opportunity detail: Tasks 5 and 10.
- Transversal checklist with seven states and no validation: Tasks 8 and 10.
- Sources, freshness and editorial control: Tasks 5, 10 and 12.
- Authentication, privacy and account isolation: Tasks 3, 4 and 11.
- Graceful operation without AI: Task 6.
- Responsive accessibility and clear language: Tasks 1, 9, 10 and 11.
- Metrics without sensitive content or eligibility claims: Task 11.
- All ten acceptance scenarios from the design spec: Tasks 5–11.

## Execution Checkpoints

1. After Task 4: framework, persistence and authenticated accounts are reviewable.
2. After Task 7: a project can be created and related deterministically to the sourced pilot catalog.
3. After Task 10: the full user-visible MVP flow is reviewable.
4. After Task 12: automated verification and operational handoff are complete.

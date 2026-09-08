# Guided Preparation Implementation Plan

**Goal:** Implement the approved stage rail and focused task workspace for Capital Semilla Modo Empleo Atacama, preserving existing data.

**Architecture:** A pure domain adapter maps the pilot's actual requirements to six preparation stages, separately from institutional stages. A client workspace edits existing antecedents and checklist progress through authenticated server actions. The project page uses this workspace for the selected pilot and retains the full record as a secondary view.

**Tech Stack:** Existing Next.js 16.3, React 19, TypeScript, SQLite, Vitest, Playwright, Manrope, IBM Plex Mono and Lucide. No new dependencies or migrations.

**Spec:** Approved conversation mockup, `exec-2bc8cb65-cfb5-4515-a578-1fba17a2bbbf.png`: visible six-stage rail, one expanded task, contextual progress, reusable answers, independent navigation, no eligibility guarantees.

## Global Constraints

- Only the explicitly selected pilot receives the new journey. Other calls retain their existing checklist.
- No selected calls means no preparation checklist, not the entire catalog.
- Confirmed/corrected nonempty answers are reusable; inferred, empty and stale answers are not complete.
- Preparing narrative or budget does not complete the official submission package.
- Future formalization and institutional checks do not count as current applicant obligations.
- Keep source descriptions, validity, saved notes and exception reasons accessible.
- Resume stage per project and call in this browser; actual answers remain in the existing database.
- Never overwrite existing saved answers merely by navigating. No commits or deployment.

## Task 1: Domain adapter and regression tests

Files: `src/domain/preparation-journey.ts`, `src/domain/preparation-journey.test.ts`, `src/domain/checklist.ts`, `src/domain/checklist.test.ts`.

- [x] Write tests for six stages, complete requirement coverage, answer reuse, false/zero values, stale/inferred values, manual document completion and unsupported calls.
- [x] Run `npm run test:run -- src/domain/preparation-journey.test.ts src/domain/checklist.test.ts` and verify failure on missing journey behavior.
- [x] Implement `buildPreparationJourney({ call, antecedents, progress })`, returning stages and tasks or null for unsupported calls. Expose pilot ID and task types for the UI.
- [x] Extend checklist input with optional antecedents. Reuse confirmed applicant answers without marking institutional/future obligations complete; preserve manual progress when no canonical answer exists.
- [x] Run the domain tests again.

## Task 2: Focused interactive workspace

Files: `src/components/preparation-journey.tsx`, `src/components/preparation-task.tsx`, `src/components/preparation-journey.test.tsx`.

- [x] Test stage switching, only one active editor, saved state isolation, error handling, next-stage navigation and links to full requirements.
- [x] Run component tests and verify missing behavior fails.
- [x] Implement responsive rail/workspace with actual domain tasks and existing save actions. Use browser storage only for validated stage IDs, never for answers.
- [x] Preserve drafts on failed saves; confirm before changing edited tasks. Distinguish completed preparation from actual external submission.
- [x] Run component tests and type checking.

## Task 3: Integrate and verify end to end

Files: `src/app/(app)/proyectos/[projectId]/page.tsx`, `src/app/actions/projects.ts`, `e2e/project-flow.spec.ts`, `e2e/preparation-journey.spec.ts`, `playwright.config.ts`.

- [x] Test unselected empty checklist, pilot routing and preservation of legacy selected calls.
- [x] Route the selected pilot to its journey; expose full record through `view=record`, and focus via validated selected `call` query parameter.
- [x] After selecting a call, redirect to its focused project URL. Keep other calls accessible through the record/catalog.
- [x] Allow an isolated E2E port so another local project on port 3000 is not reused.
- [x] Run full unit tests, lint, typecheck and production build. Run E2E on a dedicated database and port.
- [x] Inspect desktop and mobile screenshots against the approved mockup and verify saving, resuming, document preparation and navigation.

## Verification result

- 85 unit/component tests passed across 23 files.
- All 8 E2E cases passed in desktop and mobile Chromium. Tests run serially against their shared SQLite database to avoid registration lock contention.
- ESLint, TypeScript and production build passed. The build was repeated with an ephemeral test authentication secret and a separate temporary SQLite database; no production secret or user data was modified.
- Existing Next.js smooth-scroll and runner color warnings remain outside this feature's scope.

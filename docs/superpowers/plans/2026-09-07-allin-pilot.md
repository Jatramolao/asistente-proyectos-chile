# All In Chile student pilot

**Goal:** Add All In Chile as a second limited journey for inexperienced Duoc UC students, preserving the approved interface and Capital Semilla behavior.

**Scope:** Participation, initial registration and Encargo 1 are editable. Bootcamp, semifinal and final are informational conditional previews, not current obligations. No automatic classification, external submission or collection of members' RUTs/emails.

**Architecture:** Versioned Duoc catalog entry and explicit journey adapter. Call-specific responses use existing checklist notes under unique project/call/requirement keys; no migration. Shared response policy derives prepared/draft state in server saves and checklist views. Canonical answers seed drafts without completing deliveries.

**Sources:** User PDF and https://www.duoc.cl/allinchile2026/, reviewed 2026-09-07. Sections 3–5 define participation, deadlines and deliverables. Encargo 1 minimums: 680/550/680/550 characters. Duplicate guidance differs between the page and bases: advise one registration and consultation, not an automated conflict rule.

## Execution
- [x] Test and add Duoc catalog, prizes, exact dates and authorized sources.
- [x] Test and implement six stages, independent responses, minimums, drafts and preview-only stages.
- [x] Test server authorization, selected-call scope and persistence with the real repository.
- [x] Implement response editor with counters, informática examples, choices and conditional previews.
- [x] Verify unit tests, lint, types, build, desktop/mobile E2E and screenshots.

## Verification · 2026-09-07
- ESLint, TypeScript, 102 unit/component tests and production build passed.
- Full browser suite: 10 passed across desktop/mobile; final All In rerun: 2 passed.
- Desktop/mobile screenshots inspected: stage rail, single response editor and independent registration draft visible without horizontal overflow.
- Catalog validation: 8 entries, All In open with next editorial review on September 14. Other calls retain their individual review status.
- Existing non-blocking Next development warning about smooth scrolling remains outside this change.

## Acceptance
- No budget stage or subsidy terminology for this tournament.
- Each task explains what to write; examples are illustrative, not invented user answers.
- Registration, admission and Encargo 1 delivery are distinct from preparation.
- Short responses save as drafts; length readiness is not quality or admissibility.
- Future courses, attendance, pitches and travel costs are visible but not counted as current tasks.

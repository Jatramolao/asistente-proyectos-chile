# Orientación contextual Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir orientación contextual accesible para `intro-problem`, `profile` y `receipt` de All In Chile 2026, preservando intactos los borradores y el flujo de guardado.

**Architecture:** Un resolvedor puro valida la convocatoria, el requisito y `call.editorial.version`, y compone datos serializables con las fuentes oficiales ya cargadas por la página servidor. `PreparationJourney` conserva un único requisito de ayuda activo y renderiza un diálogo cliente fuera del formulario, de modo que `CallResponseEditor` permanece montado.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Lucide, Vitest/Testing Library y Playwright.

**Spec:** `docs/superpowers/specs/2026-09-10-orientacion-contextual-design.md`

## Global Constraints

- El piloto solo cubre `duoc-allin-chile-2026` y los requisitos `intro-problem`, `profile` y `receipt`.
- La compatibilidad se compara con `call.editorial.version`, cuyo valor esperado es `2026-09-07.allin.1`; no se usa la versión global del catálogo.
- Las fuentes se resuelven en el límite servidor de la página y solo se envían datos serializables al componente cliente.
- No se modifican API, autenticación, base de datos, persistencia, rutas, telemetría, mínimos ni valores de opciones.
- El contenido usa párrafos, listas y pasos tipados; no se renderiza HTML arbitrario.
- Una entrada ausente, inválida o desactualizada conserva la descripción original y no muestra el disparador.
- El panel usa `dialog` nativo, mantiene montado el editor y respeta teclado, foco, zoom y movimiento reducido.

---

### Task 1: Resolvedor editorial seguro

**Files:**
- Create: `src/domain/requirement-guidance.ts`
- Create: `src/domain/requirement-guidance.test.ts`

**Interfaces:**
- Consumes: `Requirement` y `OfficialSource` de `src/domain/types.ts`.
- Produces: `resolveRequirementGuidance(input): ResolvedRequirementGuidance | null`, `ResolvedRequirementGuidance`, `RequirementGuidanceMap` y `buildRequirementGuidanceMap(input)`.

- [x] **Step 1: Write the failing resolver tests**

```ts
it("resolves the reviewed intro guidance and official evidence", () => {
  const result = resolveRequirementGuidance({ callId, editorialVersion, requirement, sources });
  expect(result?.instruction).toBe("Describe qué problema u oportunidad observaste, a quién afecta y en qué situación ocurre.");
  expect(result?.evidence.description).toBe(requirement.description);
  expect(result?.evidence.sources).toEqual([{ id: "duoc-allin-2026-bases", title: "Bases", officialUrl: "https://www.duoc.cl/bases.pdf" }]);
});

it.each(["otra-version", undefined])("rejects an unreviewed version %s", version => {
  expect(resolveRequirementGuidance({ callId, editorialVersion: version, requirement, sources })).toBeNull();
});

it("omits unresolved links and reports missing evidence", () => {
  const result = resolveRequirementGuidance({ callId, editorialVersion, requirement, sources: [] });
  expect(result?.evidence.sources).toEqual([]);
  expect(result?.evidence.hasUnavailableSources).toBe(true);
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/domain/requirement-guidance.test.ts`

Expected: FAIL because `requirement-guidance.ts` does not exist.

- [x] **Step 3: Implement typed content, validation and source resolution**

```ts
export type GuidanceBlock =
  | { type: "paragraph"; title: string; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "steps"; title: string; items: string[] };

export function resolveRequirementGuidance(input: ResolveGuidanceInput): ResolvedRequirementGuidance | null {
  const entry = GUIDANCE[`${input.callId}:${input.requirement.id}`];
  if (!entry || entry.editorialVersion !== input.editorialVersion || !validEntry(entry)) return null;
  return composeResolvedGuidance(entry, input.requirement, input.sources);
}
```

Implementar las tres entradas textuales exactas de la sección 5 de la especificación, deduplicar fuentes por URL oficial y marcar referencias ausentes sin inventar enlaces.

- [x] **Step 4: Run resolver tests**

Run: `npm run test:run -- src/domain/requirement-guidance.test.ts`

Expected: PASS.

- [x] **Step 5: Commit**

```bash
git add src/domain/requirement-guidance.ts src/domain/requirement-guidance.test.ts
git commit -m "feat: resolve contextual requirement guidance"
```

### Task 2: Diálogo accesible y responsive

**Files:**
- Create: `src/components/requirement-guidance.tsx`
- Create: `src/components/requirement-guidance.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Consumes: `ResolvedRequirementGuidance`, `open`, `disabled`, `onOpen` y `onClose`.
- Produces: `RequirementGuidance`, un disparador de 44 px y un diálogo modal cuyo estado es controlado por el recorrido.

- [x] **Step 1: Write failing interaction tests**

```tsx
it("opens explicitly, focuses the title and closes through every supported control", async () => {
  render(<GuidanceHarness />);
  const trigger = screen.getByRole("button", { name: "Ver orientación: Explica el problema inicial" });
  fireEvent.click(trigger);
  expect(screen.getByRole("dialog", { name: "Explica el problema inicial" })).toBeVisible();
  await waitFor(() => expect(screen.getByRole("heading", { name: "Explica el problema inicial" })).toHaveFocus());
  fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }));
  expect(trigger).toHaveFocus();
});

it("shows complete evidence and never renders an empty source link", () => {
  render(<GuidanceHarness unavailableSource />);
  fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));
  fireEvent.click(screen.getByText("Requisito completo y fuentes"));
  expect(screen.getByText("Fuente no disponible en esta ficha")).toBeVisible();
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
```

Añadir casos para X, Escape, fondo, restauración de foco, ampliación móvil, reinicio al reabrir y enlace con `target="_blank"`.

- [x] **Step 2: Run component test to verify it fails**

Run: `npm run test:run -- src/components/requirement-guidance.test.tsx`

Expected: FAIL because `RequirementGuidance` does not exist.

- [x] **Step 3: Implement the native dialog and focus lifecycle**

```tsx
<button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={dialogId} disabled={disabled} onClick={onOpen}>
  <Lightbulb aria-hidden /> Ver orientación
</button>
<dialog ref={dialogRef} aria-labelledby={titleId} onCancel={closeFromDialog} onClick={closeFromBackdrop}>
  <h4 id={titleId} ref={titleRef} tabIndex={-1}>{guidance.title}</h4>
  {guidance.blocks.map(block => <GuidanceBlockContent key={block.title} block={block} />)}
  <EvidenceDetails evidence={guidance.evidence} />
</dialog>
```

Usar `showModal()`/`close()` cuando existan y una compatibilidad por atributo `open` en JSDOM. Restaurar el foco al disparador, reiniciar scroll, `<details>` y altura móvil al reabrir.

- [x] **Step 4: Add responsive CSS**

```css
.requirement-guidance-dialog { margin: 0 0 0 auto; width: min(30rem, 100%); height: 100dvh; }
@media (max-width: 767px) {
  .requirement-guidance-dialog { margin: auto 0 0; width: 100%; height: min(85dvh, 100%); }
  .requirement-guidance-dialog[data-expanded="true"] { height: 100dvh; }
}
.requirement-guidance-dialog::backdrop { background: rgb(20 33 50 / 0.48); }
```

- [x] **Step 5: Run component tests**

Run: `npm run test:run -- src/components/requirement-guidance.test.tsx`

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add src/components/requirement-guidance.tsx src/components/requirement-guidance.test.tsx src/app/globals.css
git commit -m "feat: add accessible guidance dialog"
```

### Task 3: Integración sin desmontar el editor

**Files:**
- Modify: `src/app/(app)/proyectos/[projectId]/page.tsx`
- Modify: `src/components/preparation-journey.tsx`
- Modify: `src/components/preparation-journey.test.tsx`

**Interfaces:**
- Consumes: `buildRequirementGuidanceMap`, `RequirementGuidanceMap` y `RequirementGuidance`.
- Produces: prop serializable `guidanceByRequirementId` resuelta en servidor y un solo `activeGuidanceId` por recorrido.

- [x] **Step 1: Write failing journey integration tests**

```tsx
it("keeps an unsaved pilot draft while guidance opens and closes", () => {
  render(<PreparationJourney {...allInProps} guidanceByRequirementId={guidanceMap} />);
  const editor = screen.getByRole("textbox", { name: "Tu respuesta" });
  fireEvent.change(editor, { target: { value: "Borrador sin guardar" } });
  fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));
  fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }));
  expect(editor).toHaveValue("Borrador sin guardar");
  expect(responseAction).not.toHaveBeenCalled();
});

it("uses the original help when guidance is absent", () => {
  render(<PreparationJourney {...props} guidanceByRequirementId={{}} />);
  expect(screen.getByText(activeTask.help)).toBeVisible();
  expect(screen.queryByRole("button", { name: /Ver orientación/ })).not.toBeInTheDocument();
});
```

Añadir cobertura para los tres requisitos, apertura deshabilitada durante guardado y conservación del error de guardado.

- [x] **Step 2: Run journey tests to verify they fail**

Run: `npm run test:run -- src/components/preparation-journey.test.tsx`

Expected: FAIL because the journey does not accept or render guidance.

- [x] **Step 3: Resolve guidance at the server boundary**

```ts
const guidanceByRequirementId = focusedCall
  ? buildRequirementGuidanceMap({
      callId: focusedCall.id,
      editorialVersion: focusedCall.editorial.version,
      requirements: focusedCall.requirements,
      sources: catalog.sources,
    })
  : {};
```

Pasar el mapa a `PreparationJourney`; no pasar el catálogo completo al cliente.

- [x] **Step 4: Integrate the controlled panel outside the response form**

```tsx
const [activeGuidanceId, setActiveGuidanceId] = useState<string | null>(null);
const guidance = task.requirementIds.map(id => guidanceByRequirementId[id]).find(Boolean);

{guidance ? <>
  <p>{guidance.instruction}</p>
  <RequirementGuidance guidance={guidance} open={activeGuidanceId === guidance.requirementId} onOpen={() => setActiveGuidanceId(guidance.requirementId)} onClose={() => setActiveGuidanceId(null)} />
</> : <p>{task.help}</p>}
```

Cerrar la orientación antes de cambiar tarea o etapa. No cambiar la `key` ni la posición de `CallResponseEditor`.

- [x] **Step 5: Run all unit/component tests**

Run: `npm run test:run`

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add 'src/app/(app)/proyectos/[projectId]/page.tsx' src/components/preparation-journey.tsx src/components/preparation-journey.test.tsx
git commit -m "feat: guide reviewed All In requirements"
```

### Task 4: Flujo real y verificación final

**Files:**
- Modify: `e2e/allin-journey.spec.ts`

**Interfaces:**
- Consumes: recorrido All In completo en navegador real.
- Produces: cobertura del contrato visible en escritorio y móvil.

- [x] **Step 1: Add the failing browser flow**

```ts
await page.getByRole("textbox", { name: "Tu respuesta" }).fill("Borrador sin guardar");
await page.getByRole("button", { name: "Ver orientación: Explica el problema inicial" }).click();
await expect(page.getByRole("dialog", { name: "Explica el problema inicial" })).toBeVisible();
await page.getByRole("button", { name: "Volver a mi respuesta" }).click();
await expect(page.getByRole("textbox", { name: "Tu respuesta" })).toHaveValue("Borrador sin guardar");
```

Verificar además el respaldo y fuente oficial, cierre por Escape, perfil, recepción, ausencia de overflow horizontal y ampliación móvil cuando `test.info().project.name === "mobile-chromium"`.

- [x] **Step 2: Run the focused E2E test**

Run: `npm run test:e2e -- e2e/allin-journey.spec.ts`

Expected: PASS in desktop Chromium and mobile Chromium.

- [x] **Step 3: Run catalog and full verification**

Run: `npm run catalog:check`

Expected: PASS.

Run: `npm run verify`

Expected: lint, typecheck, all Vitest tests and production build PASS.

Run: `npm run test:e2e`

Expected: all Playwright projects PASS.

- [x] **Step 4: Review the spec acceptance criteria**

Confirmar AC-01 a AC-16 contra las pruebas y anotar cualquier verificación manual pendiente; comprobar que `profile` conserva `other`/`pending` y que no existe cambio de esquema, autenticación o acción servidor.

- [x] **Step 5: Commit**

```bash
git add e2e/allin-journey.spec.ts docs/superpowers/plans/2026-09-10-orientacion-contextual.md
git commit -m "test: verify contextual guidance journey"
```

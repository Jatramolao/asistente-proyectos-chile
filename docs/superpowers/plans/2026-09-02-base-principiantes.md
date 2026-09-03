# Base para principiantes — plan de implementación

> **For agentic workers:** ejecutar por tareas con comprobación de regresiones. La solicitud del usuario autoriza corregir los problemas actuales y después preparar la definición del catálogo.

**Goal:** corregir la atribución de requisitos y facilitar la primera sesión antes de ampliar el catálogo.

**Architecture:** mantener Server Components, acciones autenticadas y progreso persistente existente. Separar el contexto institucional de cada requisito del progreso reutilizable; derivar la orientación inicial de los antecedentes guardados.

**Tech Stack:** Next.js 16.3.3, React 19, TypeScript, SQLite, Vitest y Playwright existentes.

**Spec:** benchmark de `docs/research/2026-09-02-benchmark-plataformas-financiamiento.md`, prioridades P0 y recorrido inicial P1. Definición del siguiente catálogo en `docs/superpowers/specs/2026-09-02-catalogo-principiantes-design.md` al finalizar las correcciones.

## Restricciones

- Mantener proyectos y progreso existentes; no cambiar claves persistidas.
- Ninguna respuesta vacía cuenta como confirmada. No inferir elegibilidad.
- Conservar fuentes, fechas, responsables y contexto por convocatoria.
- No añadir dependencias ni modificar la autenticación en esta entrega.
- Conservar el catálogo piloto y declarar su cobertura real hasta publicar contenido verificado.

## Tarea 1 — Contextos del checklist

Archivos: `src/domain/types.ts`, `src/domain/checklist.ts`, `src/domain/checklist.test.ts`, `src/components/checklist-view.tsx`.

Interfaz: `ChecklistItem.contexts` conserva `callId`, `requirementId`, `stage`, `responsibleParty`, `verifier`, `validity` y `sourceIds`. `buildChecklistByCall` mantiene su firma y produce metadatos locales; `item.key` sigue representando progreso compartido.

- [x] Reproducir que el requisito de edad de FOSIS recibe el verificador de Sercotec:

```ts
expect(fosisAge?.verifier).toBe("FOSIS");
expect(fosisAge?.validity).toBe("A la fecha de postulación");
```

- [x] Añadir caso sintético con un mismo antecedente en etapas diferentes y progreso guardado.
- [x] Ejecutar `npm run test:run -- src/domain/checklist.test.ts` y comprobar los fallos.
- [x] Construir cada vista por convocatoria desde sus propios requisitos; agrupar contextos en la vista transversal. Mostrar dichos contextos y nombres accesibles para los botones.
- [x] Repetir pruebas de dominio y componente.

## Tarea 2 — Respuestas iniciales válidas y progresivas

Archivos: nuevos `src/domain/beginner-guide.ts`, `src/domain/antecedent-input.ts` y pruebas; modificar `src/components/antecedent-field.tsx`, `src/app/actions/projects.ts`, `src/domain/match.ts`, `src/domain/project-input.ts` y sus pruebas.

Interfaces: `hasConfirmedValue(antecedent)` excluye nulos y texto vacío, conserva `false` y `0`; `parseAntecedentValue(key, rawValue)` produce valores tipados o `null`; `BEGINNER_GROUPS` define preguntas iniciales por etapa.

- [x] Comprobar regresiones significativas:

```ts
expect(parseAntecedentValue("applicant.age", "")).toBeNull();
expect(parseAntecedentValue("applicant.has_sales", "false")).toBe(false);
expect(evaluateRule(rule, [emptyConfirmed])).toMatchObject({ outcome: "unknown" });
```

- [x] Implementar preguntas con selecciones comprensibles para booleanos, formalización y madurez; permitir dejar pendiente sin bloquear formularios.
- [x] Guardar vacíos como pendientes en la acción y tratar vacíos históricos como desconocidos en el motor.
- [x] Generar títulos por palabras completas en proyectos nuevos.
- [x] Ejecutar las pruebas focalizadas y comprobar persistencia con el recorrido E2E.

## Tarea 3 — Orientación y explicación de oportunidades

Archivos: nuevos `src/components/project-guide.tsx` y pruebas; modificar `src/app/(app)/proyectos/[projectId]/page.tsx` y `e2e/project-flow.spec.ts`.

- [x] Probar que se ofrecen tres siguientes preguntas, que `false` cuenta como respuesta y que una ausencia de convocatorias vigentes no se expresa como incompatibilidad del proyecto.
- [x] Organizar nueve antecedentes iniciales en tres grupos; abrir el primero incompleto y dejar el resto bajo divulgación progresiva. Mostrar los otros antecedentes en una sección opcional.
- [x] Mostrar motivos completos y datos faltantes por oportunidad; exponer cobertura y preparar una salida útil para catálogo cerrado.
- [x] Comprobar registro, creación, confirmación, progresión y checklist en escritorio y móvil.

## Tarea 4 — Definición del catálogo siguiente y cierre

- [x] Documentar usuario, cobertura propuesta, tarjetas, estados, preguntas, flujo editorial y criterios de aceptación.
- [x] Identificar explícitamente lo implementado y lo pendiente: expansión editorial, alertas, acceso sin cuenta y herramientas de preparación no se presentan como terminados.
- [x] Ejecutar `npm run verify` y `npm run test:e2e` con base de pruebas aislada; inspeccionar el resultado visual.
- [x] Revisar `git diff --check` y entregar cambios locales más documento, sin desplegar ni modificar datos de producción.

## Resultado de la ejecución

- 54 pruebas de Vitest aprobadas; lint y comprobación de tipos aprobados.
- Build de producción aprobado con secreto efímero de verificación; sin cambiar credenciales locales.
- 2 recorridos E2E aprobados (escritorio y móvil), incluyendo persistencia, vacíos pendientes, contexto de FOSIS y enlaces a secciones plegadas.
- Capturas de primera sesión inspeccionadas; definición del catálogo guardada.
- Cambios locales en la rama `codex/principiantes-base-catalogo`; sin despliegue.

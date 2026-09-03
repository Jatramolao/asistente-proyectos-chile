# Catálogo público para principiantes — Implementation Plan

> Ejecución en esta sesión, por tareas y con verificación antes de dar por terminado.

**Goal:** explorar apoyos oficiales sin cuenta y preparar una selección dentro de un proyecto.
**Architecture:** catálogo editorial versionado en JSON, validado con Zod y unido a las referencias históricas. Reglas puras de vigencia y filtros compartidas por las vistas públicas y privadas. Selecciones persistidas en SQLite con control de propietario.
**Tech Stack:** Next.js 16, React 19, TypeScript, Zod, SQLite, Vitest y Playwright.
**Spec:** `docs/superpowers/specs/2026-09-02-catalogo-principiantes-design.md`.

## Restricciones

Fechas desconocidas nulas; horarios America/Santiago. Filtros opcionales sin equivaler a elegibilidad. Fuentes oficiales específicas y revisión por ficha. Históricos conservan fechas originales. No activar alertas ni prometer actualización automática. Sin dependencias nuevas ni despliegue en este alcance.

## 1. Datos y vigencia

Archivos: `src/catalog/current.json`, `current.schema.ts`, `current.test.ts`, `src/domain/catalog.ts`, `catalog.test.ts`, `src/server/services/catalog.ts` y tipos/match existentes.

- [x] Probar antes de implementar: cierre con cambio horario, fecha sin hora, revisión vencida, fuente impostora, referencia inexistente, filtro regional que conserva apoyos nacionales.
- [x] Incorporar cuatro fichas revisadas: Modo Empleo Atacama, Centros de Negocios, Portal de Capacitación y Build sin fecha. Mantener tres referencias históricas.
- [x] Validar campos editoriales, referencias e identidad; exportar `loadCatalog()`, `getAvailability(call, now)` y `filterCatalog(calls, filters, now)`.
- [x] Ejecutar `npm run test:run -- src/catalog/current.test.ts src/domain/catalog.test.ts`.

## 2. Exploración pública

Archivos: `src/app/catalogo/layout.tsx`, `page.tsx`, `[callId]/page.tsx`, `src/components/catalog-card.tsx`, página de inicio.

- [x] Filtros GET por región, etapa, objetivo y disponibilidad; vacíos significan no filtrar. Vacío ofrece limpiar filtros y preparar proyecto.
- [x] Ficha con beneficio, aporte/impuestos, condiciones, requisitos por etapa, fuentes, fechas y revisión. La fuente completa prevalece sobre el resumen.
- [x] Cobertura e historial visibles. Estado calculado en cada petición para no congelar aperturas y cierres.

## 3. Continuidad y preparación

Archivos: ruta pública `[callId]/preparar`, formulario de acceso, páginas ingresar/registro/nuevo, acciones, repositorio y esquema SQLite, página del proyecto.

- [x] Prueba de aislamiento: otro usuario no puede leer, añadir ni quitar selecciones.
- [x] Conservar ID validado de la oportunidad durante registro/acceso. Al ingresar, elegir proyecto existente o crear uno.
- [x] Guardar selección idempotente; enfocar checklist en oportunidades elegidas y permitir quitarlas sin borrar avances.
- [x] Mantener el motor conservador cuando la revisión de condiciones solo sea parcial.

## 4. Verificación y operación editorial

- [x] Registrar cómo editar, validar y versionar fichas, sin inventar revisión humana ni automatización.
- [x] `BETTER_AUTH_SECRET=local-build-verification-only-2026-09-02 npm run verify`.
- [x] Playwright escritorio/móvil: navegación pública, filtro, ficha, registro conservando selección, proyecto y recarga.
- [x] Inspeccionar capturas, registrar resultados y limitaciones reales en documentación.


## Resultado verificado — 2 de septiembre de 2026

- `npm run catalog:check`: catálogo válido, siete fichas; al ejecutar, un fondo abierto, dos servicios continuos, un programa anunciado y tres referencias cerradas.
- `npm run verify` con secreto efímero de compilación: lint, TypeScript, 64 pruebas unitarias y compilación de producción correctos.
- Playwright: dos recorridos de proyecto existentes aprobados (escritorio/móvil). Los cuatro casos del catálogo aprobaron tras separar las etiquetas de los controles: filtros regionales, objetivos, estado vacío, fuentes y fecha exacta, 404, registro conservando selección, creación y uso de proyecto existente, persistencia y retiro de selección.
- Capturas del catálogo y ficha revisadas en escritorio y móvil; sin desbordamiento visible. La hora se presenta explícitamente en formato de 24 horas.
- La copia de auditoría se probó en SQLite en memoria: versión idempotente e inmutable. No se resembró la base real ni se borró información del usuario.
- `git diff --check` correcto. Sin nuevas dependencias.

Implementación local terminada. No se desplegó. La actualización editorial requiere operación manual; no se activaron monitores ni alertas. No se realizó una revisión humana independiente de las bases ni sesiones de usabilidad con principiantes.

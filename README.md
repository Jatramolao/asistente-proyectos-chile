# Impulsa Proyectos

Primera versión funcional de un asistente guiado para personas en Chile que tienen una idea de proyecto tecnológico, pero no experiencia previa buscando financiamiento público.

La aplicación parte desde un relato libre, propone antecedentes que la persona debe confirmar, centraliza requisitos reutilizables y muestra oportunidades con sus beneficios, vigencia y fuentes oficiales. No preevalúa documentos ni predice adjudicaciones.

## Funcionalidades incluidas

- Registro e inicio de sesión con correo y contraseña.
- Creación de proyectos desde una descripción libre de 40 a 5.000 caracteres.
- Extracción conservadora de antecedentes explícitos, siempre marcados como pendientes de confirmación.
- Recorrido para principiantes con nueve respuestas iniciales en tres grupos, preguntas simples y próximos pasos.
- Respuestas «Sí», «No» y «Aún no lo sé»; los campos vacíos se guardan como pendientes.
- Ficha transversal con estados confirmado, corregido y pendiente.
- Motor determinista de correspondencia sin puntajes opacos.
- Catálogo público sin cuenta, con filtros opcionales de región, etapa, objetivo y disponibilidad.
- Siete fichas versionadas de Sercotec, Corfo y FOSIS: financiamiento, servicios y referencias.
- Selección de apoyos vinculada al proyecto, conservada durante registro e ingreso.
- Beneficios, aportes, territorio, fechas y enlaces oficiales por instrumento.
- Checklist por convocatoria como vista principal y vista transversal para reconocer antecedentes reutilizables; ambas conservan el mismo progreso.
- Verificadores, etapas y vigencia conservados por convocatoria, incluso al reutilizar antecedentes.
- Motivos de correspondencia completos, enlaces a preguntas pendientes y orientación cuando no hay convocatorias abiertas en el catálogo.
- Revisión por ficha: la disponibilidad se recalcula en cada petición y se retira cuando vence la revisión prevista.
- Estados manuales: pendiente, en preparación, completado por el usuario sin validar y no aplica con motivo.

## Puesta en marcha

Requiere Node.js 24 o superior.

```bash
npm install
cp .env.example .env.local
npm run db:migrate
npm run db:seed
npm run dev
```

En `.env.local`, define un `BETTER_AUTH_SECRET` aleatorio de alta entropía y confirma que `BETTER_AUTH_URL` coincida con el origen local o de producción.

## Verificación

```bash
npm run verify
npm run test:e2e
```

La suite E2E recorre exploración pública, filtros, fuentes, selección conservada durante registro, proyectos existentes, confirmación de antecedentes y checklist en escritorio y móvil.

## Cobertura del catálogo y límites

Al 2 de septiembre de 2026 se incorporaron cuatro fichas:

- Capital Semilla Modo Empleo Atacama 2026: postulación del 25 de agosto al 8 de septiembre, cierre a las 15:00 de Chile continental; revisión siguiente prevista para el 3 de septiembre.
- Centros de Desarrollo de Negocios Sercotec: asesoría gratuita; consultar atención local.
- Portal de Capacitación Sercotec: cursos gratuitos; requisitos, cupos y plazos dependen del curso.
- Build de Start-Up Chile: programa anunciado sin fechas de próxima postulación. El beneficio descrito corresponde a la página del programa y debe contrastarse con las próximas bases.

Se conservan las tres referencias cerradas del piloto: Capital Semilla Emprende RM, Semilla Inicia para empresas lideradas por mujeres y Emprendamos Semilla. Mantienen su revisión original del 1 de septiembre. La selección no representa cobertura completa de Chile ni de cada institución.

`src/catalog/current.json` y las referencias en `pilot.json` son la fuente editorial utilizada por la aplicación. `npm run catalog:check` valida la versión y muestra estados; `npm run db:seed` guarda una copia de auditoría sin reemplazar una versión con contenido distinto. Las selecciones se añaden a SQLite mediante una tabla nueva, sin borrar proyectos ni avances.

Cada ficha registra fuentes, revisión, próxima revisión e historial. El estado abierto se suspende si vence la revisión. No existe un monitor automático ni alertas activadas: el mantenimiento es editorial, documentado en [Operación del catálogo](docs/operations/catalogo.md).

La plataforma:

- no valida autenticidad, vigencia o calidad de documentos;
- no reemplaza la revisión legal, tributaria o técnica;
- no entrega porcentajes de éxito ni garantiza admisibilidad;
- no envía postulaciones a las instituciones;
- no almacena documentos en esta primera versión.

## Documentación de producto

- [Definición del catálogo para principiantes](docs/superpowers/specs/2026-09-02-catalogo-principiantes-design.md)
- [Correcciones del recorrido inicial y verificación](docs/superpowers/plans/2026-09-02-base-principiantes.md)
- [Benchmark de plataformas](docs/research/2026-09-02-benchmark-plataformas-financiamiento.md)

- [Operación, persistencia y respaldos en Railway](docs/operations/railway.md)

- [Especificación de diseño](docs/superpowers/specs/2026-08-27-asistente-proyectos-chile-design.md)
- [Plan de implementación](docs/superpowers/plans/2026-08-28-asistente-proyectos-chile-mvp.md)

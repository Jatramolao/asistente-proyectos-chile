# Impulsa Proyectos

Primera versión funcional de un asistente guiado para personas en Chile que tienen una idea de proyecto tecnológico, pero no experiencia previa buscando financiamiento público.

La aplicación parte desde un relato libre, propone antecedentes que la persona debe confirmar, centraliza requisitos reutilizables y muestra oportunidades con sus beneficios, vigencia y fuentes oficiales. No preevalúa documentos ni predice adjudicaciones.

## Funcionalidades incluidas

- Registro e inicio de sesión con correo y contraseña.
- Creación de proyectos desde una descripción libre de 40 a 5.000 caracteres.
- Extracción conservadora de antecedentes explícitos, siempre marcados como pendientes de confirmación.
- Ficha transversal con estados confirmado, corregido y pendiente.
- Motor determinista de correspondencia sin puntajes opacos.
- Catálogo piloto versionado con convocatorias 2026 de Sercotec, Corfo y FOSIS.
- Beneficios, aportes, territorio, fechas y enlaces oficiales por instrumento.
- Checklist transversal que reutiliza antecedentes comunes y conserva formatos específicos por convocatoria.
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

La suite E2E recorre registro, creación del proyecto, confirmación de antecedentes, visualización de oportunidades y actualización del checklist en escritorio y móvil.

## Cobertura piloto y límites

El catálogo inicial no pretende cubrir todos los instrumentos nacionales. Incluye como referencias verificadas al 28 de agosto de 2026:

- Capital Semilla Emprende Región Metropolitana de Santiago 2026, Sercotec.
- Semilla Inicia para empresas lideradas por mujeres 2026, Corfo.
- Emprendamos Semilla 2026, FOSIS.

Estas convocatorias están cerradas y se muestran con valor referencial. Una nueva apertura puede cambiar montos, requisitos, formatos, territorio y plazos. Antes de postular, siempre prevalecen las bases y el portal oficial de la institución.

La plataforma:

- no valida autenticidad, vigencia o calidad de documentos;
- no reemplaza la revisión legal, tributaria o técnica;
- no entrega porcentajes de éxito ni garantiza admisibilidad;
- no envía postulaciones a las instituciones;
- no almacena documentos en esta primera versión.

## Documentación de producto

- [Especificación de diseño](docs/superpowers/specs/2026-08-27-asistente-proyectos-chile-design.md)
- [Plan de implementación](docs/superpowers/plans/2026-08-28-asistente-proyectos-chile-mvp.md)

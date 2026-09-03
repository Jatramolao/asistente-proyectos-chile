# Operación del catálogo para principiantes

## Fuente de verdad y alcance

La app lee `src/catalog/current.json` y conserva las tres referencias de `src/catalog/pilot.json`. `loadCatalog()` une y valida los datos antes de utilizarlos. Las copias en `app_catalog_snapshot` son auditoría, no un segundo catálogo editable. Los IDs estables permiten conservar selecciones y avances entre versiones.

La actualización del 2 de septiembre incorpora Modo Empleo Atacama, Centros de Negocios, Capacitación Sercotec y Build. Se consultó también el portal FOSIS: Semilla aparece cerrado; los eventuales cupos comunales no se presentan como una apertura nacional. La revisión fue asistida, sin revisión humana independiente ni sesiones de usabilidad con principiantes.

## Procedimiento editorial

1. Guardar hallazgos y fuentes en un borrador fuera de `current.json`; no se sirven borradores al público.
2. Contrastar beneficio, condiciones, territorio y fechas con la ficha oficial, las bases específicas y las modificaciones publicadas. Si no hay evidencia, usar valores nulos y estado `verify`; un anuncio sin calendario puede usar `announced`.
3. Completar `discovery`, requisitos, fuentes y metadatos editoriales. Las condiciones resumidas son hasta cinco; el detalle completo permanece enlazado. Registrar explícitamente aporte, base de cálculo e impuestos; desconocido no significa cero.
4. Verificar fechas dos veces: fuente y conversión a `America/Santiago`. Los plazos con hora contienen su offset real para cada fecha; los que solo tienen día no inventan una hora. Los servicios continuos no tienen fechas de convocatoria. Registrar alcance y autoría de la revisión sin atribuirla a la institución ni inventar un segundo revisor.
5. Incrementar `version`, actualizar la versión y el historial de las fichas cambiadas y conservar los IDs. `reviewedAt` global no reemplaza la revisión por ficha. Actualizar `lastDiscoveryAt` únicamente si se realizó un nuevo barrido, describiendo su alcance real.
6. Ejecutar `npm run catalog:check`, las pruebas de catálogo y `npm run verify`. Revisar las fichas renderizadas y sus enlaces. Registrar una copia con `npm run db:seed`; se rechaza reutilizar una versión con contenido diferente.
7. Publicar mediante el proceso habitual de despliegue del proyecto. Editar el archivo o guardar una copia SQLite por sí solos no actualiza un despliegue remoto.

## Revisión y disponibilidad

La fecha de próxima revisión es inclusiva: al día siguiente, en hora de Chile continental, se muestra «Por verificar» y se excluye del filtro «Disponibles ahora». Un cierre conocido permanece cerrado incluso si vence la revisión; la ficha avisa que su revisión está pendiente.

Cadencia de trabajo propuesta: semanal para programas y servicios, diaria durante los siete días anteriores al cierre de un llamado, mensual para referencias históricas. La fecha se fija por ficha. No hay scraping, tarea programada, envío de alertas ni promesa de revisión automática.

Al 2 de septiembre la comprobación puntual arroja un fondo abierto, dos servicios continuos, un programa anunciado y tres referencias cerradas. Esos contadores cambian al vencer plazos o revisiones.

## Selecciones y preparación

`app_project_call` vincula proyectos con apoyos. Todas las operaciones verifican la propiedad del proyecto; seleccionar es idempotente. Quitar un apoyo no borra antecedentes ni progreso de checklist. Al existir selecciones, la página concentra el checklist en ellas; sin selecciones permite explorar la cobertura completa.

Las reglas automáticas cubren solo algunas condiciones: todas las fichas actuales declaran cobertura parcial. No se concluye admisibilidad aunque las respuestas conocidas sean favorables; las demás condiciones se revisan en la ficha y sus fuentes.

## Verificación de esta entrega

Resultados finales consignados en `docs/superpowers/plans/2026-09-02-catalogo-principiantes.md`. Las pruebas usan usuarios ficticios y SQLite temporal; no se enviaron postulaciones ni se activaron servicios externos.

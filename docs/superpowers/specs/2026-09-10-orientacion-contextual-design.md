# Orientación contextual para requisitos

Fecha: 10 de septiembre de 2026. Estado: especificación propuesta para revisión. La dirección visual fue aprobada; este documento concreta su alcance y comportamiento antes de planificar la implementación.

## 1. Propósito

Reducir la lectura obligatoria en la preparación de un proyecto, conservando el acceso explícito a explicaciones, ejemplos y respaldo oficial. La persona debe entender qué responder sin abrir una ayuda; al abrirla, debe resolver una duda sobre ese requisito y regresar sin perder lo escrito.

El patrón consiste en una instrucción breve y un botón con ampolleta y texto «Ver orientación». El botón abre un panel contextual. La ayuda no es una tarea, no modifica respuestas y no acredita cumplimiento.

## 2. Contexto y decisiones de alcance

El recorrido actual ya presenta una etapa y una tarea activa. `PreparationJourney` organiza ese recorrido; `CallResponseEditor` maneja las respuestas específicas de All In; `PreparationTaskEditor` maneja antecedentes y estados de preparación de otros recorridos. La información de All In proviene de `src/catalog/allin.json` y sus validaciones de respuesta de `src/domain/call-responses.ts`.

La imagen conceptual aprobada representa dos estados del mismo patrón, no dos páginas nuevas. Es una referencia de jerarquía e interacción: no autoriza cambios de logo, identidad, encabezados comerciales o navegación. Se conservan Manrope, IBM Plex Mono, colores y componentes del producto; la ampolleta se obtiene de Lucide.

### Piloto incluido

Solo en la ruta guiada de un proyecto asociado a `duoc-allin-chile-2026`, para estos tres requisitos:

| Requisito | Etapa | Caso que prueba |
| --- | --- | --- |
| `intro-problem` | Idea e inscripción | Orientar una respuesta narrativa |
| `profile` | Tú y tu equipo | Explicar una condición de participación |
| `receipt` | Idea e inscripción | Guiar una confirmación de una acción externa |

La propuesta anterior mencionaba un documento solicitado como tercer caso. La inspección del código muestra que All In utiliza respuestas y confirmaciones incluso en registros clasificados como `specific_document`. Por eso el tercer caso será `receipt`: no se inventará un requisito documental ni una carga de archivos.

### Fuera del piloto

No se modifica inicio, catálogo público, ficha pública, checklist completo, ficha transversal, Capital Semilla ni otros requisitos de All In. No se incorporan chat, IA generativa, búsqueda de ayuda, subida de documentos, envío de postulaciones, guardado automático, analítica remota, nuevas rutas o migraciones de base de datos. La simplificación general de páginas queda para una fase posterior.

## 3. Principios editoriales

Cada fragmento se clasifica por función, no solo por longitud.

| Nivel | Contenido | Presentación |
| --- | --- | --- |
| Acción | Qué hacer y qué debe contener la respuesta | Siempre visible junto al campo |
| Condición esencial | Elegibilidad, restricciones, plazos, mínimos, límites de guardado, advertencias relevantes | Siempre visible en tarea o encabezado de etapa correspondiente |
| Orientación | Explicaciones, pasos, ejemplos y confusiones frecuentes | Panel solicitado por la persona |
| Respaldo | Descripción completa del catálogo, verificador, vigencia y fuentes | Sección de consulta dentro del panel |

La instrucción breve se redacta editorialmente. No se recorta automáticamente con puntos suspensivos ni se oculta información solo por exceder una longitud. Objetivo orientativo: una o dos frases y hasta 35 palabras; las condiciones esenciales pueden excederlo.

El contenido ampliado conserva todos los hechos de la descripción original que se retira de la tarea. Los ejemplos se identifican como orientativos y nunca se insertan automáticamente en la respuesta. «Qué incluir» ofrece orientación, no crea criterios de admisibilidad nuevos.

Los datos normativos de esta especificación se toman del catálogo local existente; no constituyen una nueva verificación de las bases. Antes de publicar el piloto se comprueba su coherencia con la versión editorial vigente. Una revisión vencida no debe desaparecer al simplificar el contenido.

## 4. Presentación y comportamiento

### Tarea con ayuda cerrada

Se conservan título, estado, instrucción breve, condiciones esenciales, campo, contador cuando exista, origen del borrador, errores y acción de guardado. El botón «Ver orientación» queda después de la instrucción y antes del campo. En pantallas estrechas pasa a una línea propia.

El botón tiene icono y texto, área de interacción mínima de 44 × 44 CSS px y `type="button"`. No se coloca dentro del botón que expande el requisito. No hay ampolleta global flotante ni apertura al pasar el cursor. Solo aparece si existe contenido de orientación válido.

### Panel abierto

El panel identifica el requisito mediante su título. Contiene las secciones editoriales que correspondan, seguidas de «Requisito completo y fuentes», cerrada inicialmente. Esta última permite consultar la descripción original íntegra del catálogo, verificador, vigencia y enlaces oficiales deduplicados.

Los enlaces oficiales abren otra pestaña, indican ese comportamiento de forma accesible y mantienen la tarea y su borrador. No se incrustan sitios externos. Los enlaces para realizar trámites siguen disponibles directamente en la tarea cuando son necesarios para actuar.

No se muestran bloques vacíos. El panel no contiene campos editables, acciones para guardar, controles para marcar la tarea ni botones para copiar el ejemplo a la respuesta.

### Escritorio y móvil

| Tamaño | Comportamiento |
| --- | --- |
| Desde 768 CSS px | Panel modal anclado a la derecha, ancho de hasta 480 px, alto disponible de la ventana |
| Menos de 768 CSS px | Hoja modal desde abajo, ancho completo, alto inicial de hasta 85dvh; botón «Ampliar orientación» alterna entre 85dvh y 100dvh |

Ambas presentaciones usan el mismo contenido y estado. El fondo se atenúa y queda inactivo; el editor sigue montado. El encabezado con «Cerrar» permanece accesible y el cuerpo tiene desplazamiento propio. La hoja respeta áreas seguras y no exige arrastrar para abrir, ampliar o cerrar. A 320 px y con zoom no debe aparecer desplazamiento horizontal.

El panel se abre solo mediante activación explícita. Se cierra mediante «Cerrar», «Volver a mi respuesta», Escape o pulsación en el fondo. Al cerrar, el foco regresa al botón que lo abrió, conservando la posición de la página. Si ese botón ya no existe, se dirige al encabezado de la tarea o etapa actual.

### Estados y transiciones

| Estado/evento | Resultado |
| --- | --- |
| Tarea cargada | Ayuda cerrada |
| Activar «Ver orientación» | Abrir ayuda de esa tarea; enfocar su título |
| Cerrar ayuda | Restaurar foco; preservar borrador, error y estado de guardado |
| Volver a abrir | Reiniciar desplazamiento del panel; respaldo cerrado; tamaño móvil inicial |
| Redimensionar con ayuda abierta | Adaptar presentación sin cerrar ni cambiar requisito; conservar posición de lectura en lo posible |
| Guardado en curso | Apertura de ayuda deshabilitada mientras dure el guardado |
| Cambio de tarea o etapa | Mantener las protecciones existentes de cambios sin guardar; nueva tarea con ayuda cerrada |
| Navegación o recarga | La ayuda no persiste; se conserva el comportamiento actual de guardado y advertencias |

Con el modal abierto no se puede cambiar de etapa ni guardar desde el fondo. El estado de ayuda es independiente del estado de edición: abrir/cerrar no invoca `onDirty`, `onSaving`, `onSaved`, acciones de servidor ni cálculos de preparación.

«Conservar el borrador» significa que consultar la ayuda no borra el contenido presente en el editor. No significa recuperarlo tras recargar, cerrar la pestaña o navegar sin guardar.

## 5. Contenido inicial del piloto

### A. `intro-problem`: Explica el problema inicial

**Instrucción visible:** «Describe qué problema u oportunidad observaste, a quién afecta y en qué situación ocurre.»

**Qué incluir:**

- Quién experimenta la dificultad.
- En qué situación aparece.
- Qué consecuencias observaste.

**Un ejemplo:** «Los pequeños comercios del barrio pierden ventas porque sus clientes no saben qué productos tienen disponibles.»

Junto al ejemplo: «Ejemplo orientativo; describe tu propia situación.»

**Ten presente:** «No necesitas un proyecto terminado. Describe primero la dificultad; la solución se trabaja en la siguiente tarea.»

**Respaldo:** descripción original de `intro-problem` y sus fuentes. Se conserva el contador y el límite actual de 10.000 caracteres del asistente. No se introduce un mínimo oficial para esta respuesta inicial ni se trasladan los 680 caracteres de Encargo 1 a esta tarea.

### B. `profile`: Confirma quién representará al equipo

**Instrucción visible:** «Indica si serás titular como estudiante regular matriculado de Duoc UC o como titulado de una carrera técnica o profesional de Duoc UC.»

Las opciones actuales se conservan, incluidas «No cumplo estas condiciones como titular» y «Todavía no». La condición institucional se mantiene visible; abrir la ayuda no es necesario para descubrirla.

**Qué significa:** «El titular es la persona que representa al equipo. La condición de pertenecer a Duoc UC corresponde al titular; los demás integrantes pueden ser externos.»

**Ten presente:** «Selecciona la opción que describe tu situación actual. Esta respuesta no confirma la admisibilidad del equipo.»

**Respaldo:** descripción original de `profile` y sus fuentes. No se agrega un ejemplo innecesario ni se piden nombres, RUT, correos o comprobantes.

### C. `receipt`: Registra la recepción de tu inscripción

**Instrucción visible:** «Confirma solo si recibiste el correo de recepción de la inscripción enviada por el titular en Santander X.»

**Condiciones visibles junto a la tarea:**

- «La inscripción se realiza en el sitio oficial; guardar aquí no la envía.»
- «Presenta una sola inscripción. Si necesitas corregirla, consulta a Ruta IE.»
- «No ingreses aquí credenciales ni datos personales del equipo.»

El plazo permanece visible en el encabezado de la etapa, obtenido del recorrido actual. El enlace de acceso oficial permanece junto a la tarea.

**Cómo comprobarlo:**

1. Accede a la inscripción desde el sitio oficial con la cuenta del titular.
2. Completa y envía el formulario en Santander X.
3. Comprueba el correo de recepción antes de confirmar esta tarea.

**Ten presente:** «Las bases y la página difieren en el tratamiento de inscripciones duplicadas. Si necesitas corregir una inscripción, consulta a Ruta IE.»

**Respaldo:** descripción original íntegra de `receipt`, incluidas las instrucciones sobre identificación y correo en la plataforma externa, con sus fuentes. La ayuda no resuelve por cuenta propia discrepancias editoriales.

## 6. Accesibilidad

El panel funciona como diálogo modal con nombre accesible igual al título del requisito. Al abrir se enfoca el título con `tabIndex=-1`; Tab y Shift+Tab recorren sus controles sin acceder al fondo. Escape cierra. El fondo no recibe foco ni interacción mientras el modal está abierto.

El disparador expone `aria-haspopup="dialog"`, estado expandido y relación con el panel. Su nombre accesible incluye el requisito: «Ver orientación: Explica el problema inicial». El icono es decorativo para lectores de pantalla.

El texto usa al menos 16 px en el cuerpo de ayuda, interlineado cómodo y foco visible. Se comprobarán contraste AA, teclado, lector de pantalla y zoom; la imagen conceptual no constituye verificación de accesibilidad. La animación de apertura será breve, sin rebotes, y se elimina con preferencia de movimiento reducido.

## 7. Diseño técnico previsto

No requiere cambios de API, autenticación, persistencia, tablas ni reglas de preparación.

### Contenido y resolución

Crear un módulo editorial `src/domain/requirement-guidance.ts` que resuelva por `callId` y `requirementId`, nunca por título o índice de la lista. Contendrá únicamente las tres entradas del piloto.

Cada entrada tiene instrucción breve, lista opcional de condiciones esenciales, bloques opcionales de orientación y una versión editorial de referencia. Los bloques admiten párrafos, listas o pasos, con títulos y texto plano; no HTML arbitrario. Las fuentes, descripción íntegra, verificador y vigencia se resuelven desde el requisito actual del catálogo. Los mínimos y opciones siguen proviniendo de `CallResponseDefinition`; no se duplican en el módulo editorial.

La entrada se asocia a la versión del catálogo revisada. Si no hay entrada o la versión no coincide, se presenta la ayuda original completa de la tarea, sin ampolleta. Las comprobaciones de catálogo deben detectar la desincronización para que la simplificación no oculte requisitos nuevos.

Los ejemplos existentes en `CallResponseDefinition.example` de Encargo 1 no se trasladan ni duplican en este piloto. Cuando se amplíe la cobertura, cada tarea deberá tener un único origen para su ejemplo.

### Componentes y responsabilidades

| Pieza | Responsabilidad |
| --- | --- |
| `requirement-guidance.ts` nuevo | Contenido editorial y selección segura de las tres ayudas |
| `RequirementGuidance` nuevo | Disparador, panel, respaldo, foco, cierre y adaptación de tamaño |
| `PreparationJourney` existente | Elegir instrucción breve o ayuda original e integrar el patrón en la tarea activa |
| `CallResponseEditor` existente | Conservar edición y guardado; permitir retirar únicamente explicaciones redundantes de tareas cubiertas |

El panel tendrá un único estado activo por recorrido, identificado por requisito. Se renderizará fuera del formulario y del encabezado interactivo de la tarea. Abrir/cerrar no cambia la clave del editor ni desmonta el formulario. Se prefiere un diálogo nativo con adaptación responsive y comprobación explícita de comportamiento; la implementación verificará soporte antes de introducir otra dependencia.

El contenido se entrega con la página, sin peticiones adicionales al abrir. Una fuente ausente omite el enlace inválido, conserva el texto y muestra «Fuente no disponible en esta ficha». No se inventa una URL. Una ayuda inválida usa la presentación original completa. Errores de guardado siguen perteneciendo al editor y permanecen tras abrir/cerrar el panel.

### Límites de integración

El cambio es de presentación. No modifica identificadores, valores de opciones, estados aceptados, mínimos, reutilización de antecedentes, envío externo o progresos calculados. La vista completa de consulta sigue disponible. Las etapas futuras no se convierten en tareas obligatorias.

Antes de escribir código se leerán las guías relevantes de la versión local de Next.js en `node_modules/next/dist/docs/`, según `AGENTS.md`.

## 8. Criterios de aceptación

| ID | Escenario | Resultado verificable |
| --- | --- | --- |
| AC-01 | Abrir una de las tres tareas piloto | Instrucción breve y botón de orientación; condiciones esenciales visibles |
| AC-02 | Abrir una tarea fuera del piloto | Presentación y comportamiento originales |
| AC-03 | Escribir sin guardar y abrir/cerrar ayuda | Texto idéntico, sin petición de guardado ni cambio de progreso |
| AC-04 | Consultar las tres ayudas sucesivamente | Título, contenido y respaldo corresponden siempre al requisito seleccionado |
| AC-05 | Cerrar con X, botón de retorno, Escape o fondo | Panel cerrado, foco restaurado, posición y borrador conservados |
| AC-06 | Recorrer el modal con teclado | Foco contenido, controles accesibles, fondo inactivo |
| AC-07 | Consultar en móvil a 320 y 390 px | Hoja legible, sin desbordamiento horizontal; ampliar/restaurar y cerrar funcionan |
| AC-08 | Redimensionar con panel abierto | No se pierde el contenido ni cambia el requisito |
| AC-09 | Guardar después de consultar | Se ejecuta la acción original; recargar recupera lo efectivamente guardado |
| AC-10 | Intentar cambiar de etapa con borrador | Se mantiene la advertencia de cambios sin guardar existente |
| AC-11 | Consultar tras error de guardado | Error y respuesta permanecen al cerrar |
| AC-12 | Ver requisito completo | Descripción íntegra, metadatos y fuentes actuales; sin enlaces vacíos |
| AC-13 | Entrada ausente, inválida o versión desactualizada | Ayuda original visible; ningún requisito desaparece |
| AC-14 | Responder «other» o «pending» en `profile` | Se conserva la lógica de preparación actual; abrir ayuda no altera elegibilidad |
| AC-15 | Abrir fuente oficial | Nueva pestaña anunciada; editor conservado en la original |
| AC-16 | Usar movimiento reducido y zoom 200% | Contenido y controles accesibles, sin animación innecesaria |

## 9. Validación y salida del piloto

Pruebas unitarias: resolución por convocatoria/requisito, versión editorial, fallback y fuentes. Pruebas de componentes: apertura/cierre, foco, editor montado, conservación de respuesta y ausencia de guardados al consultar. Pruebas E2E: flujo de texto sin guardar → ayuda → cierre → guardado → recarga; condiciones y confirmación de inscripción; escritorio y móvil. Ejecutar `npm run verify` y `npm run test:e2e` al implementar.

Revisión editorial: comparar cada descripción original con la instrucción, condiciones visibles y respaldo; todo dato que afecte una decisión debe conservarse en el nivel apropiado. Comprobar especialmente el titular Duoc, la confirmación por correo, duplicados y plazos.

Evaluación formativa propuesta: cinco personas sin experiencia previa con estas postulaciones, usando las tres tareas. Se acepta la dirección si al menos cuatro identifican qué hacer sin ayuda del moderador, encuentran la orientación cuando se les plantea una duda y vuelven a la respuesta sin perderla. Ninguna debe interpretar consultar ayuda o guardar como inscripción oficial. Esta muestra identifica fricciones; no demuestra una mejora estadística.

Registrar manualmente palabras visibles de interfaz antes de responder, tiempo para encontrar la ayuda y dificultades de comprensión; separar texto escrito por usuarios y contenido expandido. No se fija un porcentaje uniforme de recorte ni se agrega telemetría remota al piloto.

La ampliación a otras tareas y páginas se decide después de revisar estas pruebas y la comprensión observada. Para habilitar cada requisito adicional debe existir contenido editorial revisado, correspondencia con su fuente y cobertura de sus condiciones esenciales.

## 10. Resultado esperado y siguiente paso

La persona puede concentrarse en una tarea breve, consultar el contexto por decisión propia y continuar con su respuesta intacta. La implementación estará lista para revisión cuando cumpla AC-01 a AC-16 y la comprobación editorial, sin cambios a la lógica de preparación.

Este documento no ejecuta cambios de producto ni despliegues. Tras revisar y aprobar estas specs, el siguiente entregable será el plan de implementación con tareas y verificaciones.

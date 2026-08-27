# Diseño del MVP: Asistente de proyectos y financiamiento público en Chile

**Fecha:** 27 de agosto de 2026  
**Estado:** propuesta consolidada para revisión final  
**Nombre de trabajo:** Asistente de Proyectos Chile

## 1. Resultado esperado

Construir una aplicación web guiada para personas que tienen una idea de proyecto tecnológico, pero no conocen los procesos de financiamiento público en Chile. La aplicación transforma una descripción inicial de la idea en una ficha viva de antecedentes, relaciona esos antecedentes con instrumentos y convocatorias reales y presenta un checklist progresivo de condiciones, requisitos y documentos.

La aplicación centraliza, ordena y explica información oficial. No revisa la calidad de los documentos, no certifica el cumplimiento de requisitos, no realiza una preevaluación institucional y no promete admisibilidad ni adjudicación.

## 2. Decisión de alcance

La arquitectura y el modelo de datos se diseñan para incorporar el catálogo completo de instrumentos públicos nacionales. La primera versión funcional utilizará un catálogo piloto, acotado y trazable, compuesto por:

1. Sercotec — Capital Semilla Emprende, incluida una convocatoria regional vigente o la última disponible como referencia claramente rotulada.
2. Corfo — Semilla Inicia, incluida una convocatoria nacional vigente o la última disponible.
3. FOSIS — Emprendamos Semilla, incluida su disponibilidad y forma de postulación oficial.

Esta cobertura piloto permite probar tres patrones distintos de apoyo, requisitos y etapas. La interfaz nunca presentará el piloto como si fuera la totalidad de la oferta pública. Mostrará de forma visible la cobertura del catálogo, la fecha de revisión y las instituciones incluidas.

La expansión posterior incorporará instrumentos públicos nacionales de subsidio, crédito, garantía estatal, incentivo tributario, incubación, capacitación y asistencia técnica.

## 3. Usuario principal

**Perfil 1:** persona natural en Chile con una idea de proyecto tecnológico, sin experiencia previa en fondos públicos y que puede no tener empresa constituida, inicio de actividades, modelo de negocio formalizado ni documentación ordenada.

El concepto de tecnología es amplio: soluciones digitales, hardware, biotecnología, energía, minería, salud, agro, manufactura, robótica e I+D aplicada.

Necesidades principales:

- Entender qué antecedentes necesita levantar antes de postular.
- Saber qué instrumentos vale la pena revisar y por qué.
- Distinguir condiciones de entrada, documentos de postulación y obligaciones posteriores.
- Reutilizar antecedentes comunes entre distintas oportunidades.
- Conocer qué podría recibir, qué debe aportar y qué gastos son financiables.
- Acceder a la fuente oficial y saber qué versión de la información está viendo.

## 4. Principios del producto

1. **El proyecto es el centro.** Los fondos aparecen como destinos posibles de los antecedentes del proyecto, no como el punto de partida obligatorio.
2. **Conversación con estructura.** El usuario describe libremente su idea; el sistema organiza lo comprendido y pregunta únicamente por vacíos que cambian el resultado o el siguiente paso.
3. **Una base, múltiples usos.** Los antecedentes se capturan una vez y se relacionan con los instrumentos y formatos que los requieren.
4. **Reglas explícitas.** La clasificación semántica puede apoyarse en IA, pero las condiciones oficiales se aplican mediante reglas deterministas y trazables.
5. **Fuente antes que opinión.** Cada condición relevante debe enlazar una fuente oficial, su ámbito, versión y fecha de revisión.
6. **Incertidumbre visible.** El sistema distingue entre información confirmada por el usuario, inferida, faltante y desactualizada.
7. **Acompañar sin evaluar.** La herramienta ayuda a comprender y organizar; la evaluación sigue correspondiendo a la institución convocante.

## 5. Objetivos y exclusiones

### Objetivos del MVP

- Crear y guardar un proyecto desde una descripción inicial libre.
- Construir una ficha viva con antecedentes inferidos, confirmados y pendientes.
- Mostrar oportunidades piloto relacionadas y explicar la relación.
- Aplicar reglas oficiales de compatibilidad y preparación.
- Generar un checklist transversal y vistas específicas por convocatoria.
- Registrar el estado que el usuario asigna a cada antecedente o requisito.
- Mostrar beneficios, montos, cofinanciamiento, plazos y gastos permitidos cuando la fuente oficial los defina.
- Mantener trazabilidad hacia las fuentes oficiales.

### Fuera del MVP

- Evaluar la calidad, veracidad o suficiencia de archivos o respuestas.
- Asignar puntajes equivalentes a los de la institución.
- Predecir probabilidades de adjudicación.
- Completar o enviar formularios en portales públicos.
- Firmar documentos, realizar trámites ante SII o constituir empresas.
- Redactar postulaciones finales de manera automática.
- Almacenar archivos sensibles; el MVP registra antecedentes y estados, pero no recibe documentos adjuntos.
- Cubrir desde el lanzamiento todos los instrumentos nacionales, regionales y municipales.
- Enviar alertas automáticas por correo o mensajería.

## 6. Flujo principal

1. El usuario crea un proyecto y relata su idea en lenguaje natural.
2. El sistema propone una primera estructura: problema, solución, beneficiario o cliente, tecnología, etapa y territorio.
3. Cada dato propuesto queda marcado como **inferido, pendiente de confirmación**.
4. El usuario confirma, corrige o deja pendiente cada antecedente.
5. El sistema formula una pregunta prioritaria cuando la respuesta puede cambiar la compatibilidad, el orden de oportunidades o el checklist.
6. El motor compara los antecedentes confirmados con las reglas versionadas del catálogo.
7. El usuario recibe oportunidades agrupadas por estado, con explicación, beneficio y fuente.
8. Al abrir una oportunidad ve sus condiciones, etapas y checklist específico.
9. El checklist transversal agrupa antecedentes reutilizables y muestra en qué instrumentos se ocupan.
10. El usuario actualiza el progreso y regresa al proyecto mediante una siguiente acción recomendada.

El sistema nunca obliga a completar un cuestionario largo antes de entregar valor. Con información parcial puede mostrar oportunidades como **Información insuficiente** y explicar qué dato falta.

## 7. Arquitectura de información y pantallas

### 7.1 Inicio / Mis proyectos

- Lista de proyectos, estado de avance y última actividad.
- Acción principal: “Crear proyecto”.
- Cobertura visible del catálogo piloto y fecha de actualización.

### 7.2 Creación guiada

- Campo amplio: “Cuéntanos tu idea de proyecto”.
- Ejemplos de antecedentes útiles, sin convertirlos en formulario obligatorio.
- Resumen estructurado propuesto por el asistente.
- Controles para confirmar, corregir o dejar pendiente.
- Primera pregunta contextual y opción de continuar al espacio del proyecto.

### 7.3 Espacio del proyecto

Es la pantalla central. Incluye:

- Resumen del proyecto y próxima acción recomendada.
- Indicador de avance informativo, nunca equivalente a una probabilidad de adjudicación.
- Navegación a Ficha viva, Oportunidades, Checklist, Antecedentes y Fuentes.
- Panel contextual del asistente, limitado a explicar términos, fuentes y próximos pasos.

### 7.4 Ficha viva

Se organiza en seis bloques:

1. **Esencia:** problema, evidencia, solución, propuesta de valor, clientes o beneficiarios y territorio.
2. **Modelo y mercado:** competencia, canales, relaciones, ingresos, costos, mercado y alianzas.
3. **Tecnología e innovación:** componente tecnológico, novedad, tecnología propia o existente, madurez, propiedad intelectual y validación técnica.
4. **Ejecución y recursos:** equipo, capacidades, actividades, hitos, plazo, presupuesto, cofinanciamiento, infraestructura y proveedores.
5. **Impacto y sostenibilidad:** resultados, empleo, impacto social y ambiental, indicadores y riesgos.
6. **Postulante y habilitación:** identidad, región, formalización, actividad SII, sociedades relacionadas, experiencia, deudas y declaraciones.

Cada antecedente presenta valor, estado de confirmación, origen, última actualización y oportunidades o formularios donde se reutiliza.

### 7.5 Oportunidades relacionadas

Cada tarjeta muestra:

- Institución, instrumento y convocatoria.
- Tipo de apoyo.
- Estado de relación con el proyecto.
- Razones principales y datos faltantes.
- Beneficio potencial, aporte requerido y ámbito territorial.
- Vigencia y fecha de revisión.
- Enlace a detalle y fuente oficial.

No se usa un ranking numérico opaco. El orden prioriza convocatorias vigentes, compatibilidad explícita y menor cantidad de bloqueos, e informa el criterio.

### 7.6 Detalle de oportunidad

- Qué financia y qué podría obtener el beneficiario.
- A quién está dirigida.
- Condiciones de entrada y causales de incompatibilidad conocidas.
- Cofinanciamiento, impuestos y gastos financiables/no financiables.
- Fechas y ámbito de la convocatoria.
- Etapas: postulación, evaluación o terreno, selección y formalización.
- Checklist específico por etapa.
- Fuentes oficiales y aviso de verificación final en el sitio de la institución.

### 7.7 Checklist transversal

- Agrupa requisitos equivalentes o antecedentes reutilizables.
- Permite filtrar por estado, oportunidad, etapa, responsable y vencimiento.
- Explica para qué oportunidades sirve cada elemento.
- Mantiene diferencias específicas: un Canvas, video, presupuesto o declaración no se consideran intercambiables si sus formatos oficiales difieren.

### 7.8 Fuentes y trazabilidad

- Institución y URL oficial.
- Tipo de documento: bases, resolución, preguntas frecuentes, ficha web o formulario.
- Convocatoria, territorio y versión aplicable.
- Fecha de publicación, cuando exista.
- Fecha de última revisión interna.
- Estado: vigente, cerrada, reemplazada o por verificar.

## 8. Estados y lenguaje

### 8.1 Estado de relación con una convocatoria

- **Compatible para revisar:** no existe una incompatibilidad conocida con los datos confirmados; requiere verificación oficial.
- **Requiere preparación:** puede ser pertinente, pero faltan habilitantes o antecedentes que el usuario podría preparar.
- **No compatible actualmente:** una regla oficial contradice un antecedente confirmado. Se muestra regla, dato y fuente.
- **Información insuficiente:** faltan datos decisivos y no corresponde inferir compatibilidad.
- **Convocatoria no vigente:** la convocatoria está cerrada, reemplazada o fuera de plazo; puede conservar valor referencial claramente indicado.

### 8.2 Estado de un antecedente

- Inferido, pendiente de confirmación.
- Confirmado por el usuario, no validado.
- Corregido por el usuario.
- Faltante.
- Desactualizado.

### 8.3 Estado de checklist

- Pendiente.
- En preparación.
- Completado por el usuario, no validado.
- No aplica, con motivo registrado.
- Verificación automática de la institución.
- Futuro o condicional si resulta seleccionado.
- Próximo a vencer o desactualizado.

Las etiquetas “compatible” y “completado” siempre incluyen el límite “para revisar” o “no validado” cuando corresponda.

## 9. Modelo conceptual de datos

### Entidades principales

- **Usuario:** identidad mínima de acceso y preferencias.
- **Proyecto:** nombre, relato original, estado, territorio y fechas.
- **Definición de antecedente:** concepto canónico, bloque, tipo de dato y ayuda contextual.
- **Antecedente del proyecto:** valor, estado de confirmación, origen, vigencia y responsable.
- **Historial de antecedente:** cambios, fecha y autor del cambio.
- **Institución:** organismo responsable y canales oficiales.
- **Instrumento:** programa estable, objetivo y tipo de apoyo.
- **Convocatoria:** edición concreta por fecha, territorio y versión.
- **Beneficio:** monto, rangos, cofinanciamiento, impuestos y categorías de gasto.
- **Requisito:** condición oficial, etapa, obligatoriedad, responsable y forma de verificación.
- **Mapeo de requisito:** relación entre un requisito y uno o más antecedentes canónicos.
- **Regla:** operador determinista, dato requerido, resultado y explicación.
- **Fuente oficial:** URL, documento, versión, fecha, territorio, estado y fecha de revisión.
- **Resultado de relación:** estado calculado, razones, bloqueos, faltantes y versión de reglas.
- **Ítem de checklist:** requisito asociado, estado del usuario, nota, vencimiento y evidencia textual opcional.

### Restricciones clave

- Una convocatoria pertenece a un instrumento, pero puede variar por región y año.
- Un requisito puede usar varios antecedentes; un antecedente puede servir a varios requisitos.
- Todo requisito o beneficio publicado debe estar respaldado por al menos una fuente oficial.
- Los resultados calculados conservan la versión de reglas usada para poder explicar cambios posteriores.
- Los estados declarados por el usuario no se convierten en validaciones del sistema.

## 10. Componentes lógicos

1. **Gestor de proyectos y ficha viva:** persiste relato, antecedentes, confirmaciones e historial.
2. **Catálogo versionado:** administra instituciones, instrumentos, convocatorias, requisitos, beneficios y fuentes.
3. **Extractor asistido:** propone antecedentes desde el relato, con confianza interna no expuesta como certeza.
4. **Motor de reglas:** aplica únicamente condiciones codificadas y produce razones reproducibles.
5. **Motor de relación:** combina reglas, vigencia y vacíos para asignar uno de los cinco estados.
6. **Generador de checklist:** deduplica antecedentes canónicos, preserva formatos específicos y agrupa por etapa.
7. **Asistente explicativo:** responde usando los datos del proyecto y el catálogo citado; no inventa requisitos ausentes.
8. **Módulo de trazabilidad:** muestra fuentes, versión y fecha de revisión en toda afirmación material.

## 11. Flujo de datos y cálculo

1. El relato original se guarda sin alteraciones.
2. El extractor genera propuestas estructuradas con fragmento de origen.
3. El usuario confirma o corrige; solo los datos confirmados pueden provocar un resultado de incompatibilidad.
4. El catálogo entrega convocatorias dentro de la cobertura declarada.
5. El motor de reglas evalúa condiciones con tres salidas por regla: cumple, contradice o desconocido.
6. El motor de relación calcula el estado general:
   - convocatoria cerrada: Convocatoria no vigente;
   - contradicción confirmada: No compatible actualmente;
   - datos decisivos desconocidos: Información insuficiente;
   - habilitantes preparables pendientes: Requiere preparación;
   - sin contradicciones ni vacíos decisivos: Compatible para revisar.
7. El generador crea o actualiza checklist sin sobrescribir el progreso manual del usuario.
8. Cada explicación enlaza reglas, antecedentes y fuentes involucradas.

## 12. Fuentes, actualización y control editorial

El MVP usa únicamente dominios y documentos oficiales de las instituciones responsables. Los registros se cargan mediante una consola o archivos de administración controlados; no se publican automáticamente a partir de scraping o respuestas generativas.

Cada convocatoria debe pasar por este ciclo:

1. Registrar ficha oficial, bases y anexos relevantes.
2. Identificar territorio, fechas, versión y documento prevalente.
3. Extraer requisitos y beneficios con referencia a sección o página cuando sea posible.
4. Codificar reglas verificables y revisar su correspondencia con la fuente.
5. Publicar con fecha de revisión y responsable editorial.
6. Marcar como cerrada, reemplazada o por verificar cuando cambie la vigencia.

Si una fuente deja de estar disponible o supera el periodo interno de revisión, la aplicación conserva la información con advertencia y evita presentarla como vigente. Los plazos regionales nunca se generalizan al país.

## 13. Manejo de incertidumbre y errores

- Si el asistente no puede estructurar el relato, conserva el texto y ofrece edición manual.
- Si falta un dato decisivo, pregunta o muestra Información insuficiente; no completa el dato por presunción.
- Si dos documentos oficiales se contradicen, prevalece el documento normativo de mayor jerarquía cuando sea claro; de lo contrario la convocatoria queda “por verificar”.
- Si una regla cambia, se recalculan resultados y se informa al usuario qué cambió.
- Si el servicio de IA falla, el proyecto y la edición manual siguen disponibles.
- Si una fuente oficial no responde, se muestra el enlace y la última fecha de revisión, sin ocultar la contingencia.
- Las acciones del usuario se guardan de forma idempotente para evitar duplicar checklist o historial.

## 14. Privacidad, seguridad y límites legales

- El MVP solicita la menor cantidad posible de datos personales.
- No almacena claves, certificados, documentos tributarios ni archivos de identidad.
- Las notas del usuario se consideran privadas dentro de su cuenta.
- El texto de la idea puede contener información sensible; la interfaz advierte que no se incluyan secretos industriales innecesarios.
- El acceso a proyectos requiere autenticación y separación por usuario.
- Los registros editoriales del catálogo requieren un rol administrativo.
- Se incluye un aviso permanente: la fuente oficial y la institución convocante prevalecen.
- Se registra consentimiento y versión de política de privacidad aplicable.

## 15. Accesibilidad y experiencia adaptable

- Diseño responsive desde 360 px hasta escritorio.
- Navegación completa por teclado, foco visible y orden semántico.
- Contraste mínimo WCAG AA y estados que no dependan solo del color.
- Lenguaje claro, definiciones de términos técnicos y montos en formato chileno.
- Fechas absolutas con zona horaria de Chile; no usar únicamente expresiones como “mañana”.
- Tablas extensas se convierten en tarjetas o paneles accesibles en móvil.
- El panel asistente no bloquea el contenido principal y puede contraerse.

## 16. Métricas del piloto

- Porcentaje de usuarios que crean un proyecto y confirman al menos cinco antecedentes.
- Tiempo hasta obtener la primera lista explicada de oportunidades.
- Porcentaje que abre una fuente oficial.
- Antecedentes reutilizados en más de una oportunidad.
- Porcentaje de checklist con estado actualizado por el usuario.
- Preguntas abandonadas o marcadas como difíciles.
- Errores editoriales detectados y tiempo de corrección.

No se usará como métrica de éxito una supuesta tasa de “elegibilidad” o adjudicación inferida por la aplicación.

## 17. Criterios de aceptación del MVP

### Escenario A: idea inicial incompleta

Dada una descripción breve de una solución tecnológica, el sistema crea el proyecto, propone antecedentes como inferidos y muestra al menos una pregunta decisiva. Ningún dato inferido aparece como confirmado.

### Escenario B: incompatibilidad demostrable

Dado un antecedente confirmado que contradice una condición oficial codificada, la oportunidad aparece como No compatible actualmente e indica el dato, la regla y la fuente.

### Escenario C: información insuficiente

Si falta región, estado de formalización u otro dato decisivo, el sistema no presume la respuesta y explica qué falta.

### Escenario D: reutilización

Al confirmar un antecedente canónico, todos los requisitos mapeados reflejan el dato sin duplicarlo; los formatos específicos permanecen separados.

### Escenario E: checklist seguro

Al marcar un ítem como completado, la interfaz muestra “Completado por el usuario, no validado”. El sistema no cambia ese estado a validado.

### Escenario F: convocatoria cerrada

Una convocatoria fuera de plazo se rotula No vigente, conserva utilidad referencial y no se presenta como postulable.

### Escenario G: variación regional

Una cifra o plazo de Capital Semilla asociado a una región y año no se muestra como regla nacional.

### Escenario H: trazabilidad

Cada requisito, beneficio y razón material permite abrir su fuente oficial y ver fecha de revisión y ámbito.

### Escenario I: falla de IA

Si el extractor no está disponible, el usuario puede completar manualmente la ficha, consultar el catálogo y utilizar el checklist.

### Escenario J: aislamiento de cuentas

Un usuario autenticado no puede leer ni modificar proyectos de otro usuario.

## 18. Datos iniciales del piloto

La carga inicial incluirá, para cada uno de los tres instrumentos:

- Descripción y tipo de apoyo.
- Convocatoria concreta y estado de vigencia.
- Beneficio general y variaciones documentadas.
- Requisitos de postulante y proyecto.
- Antecedentes y documentos por etapa.
- Cofinanciamiento, impuestos y gastos cuando estén definidos.
- Reglas deterministas mínimas de compatibilidad.
- Enlaces oficiales, documentos normativos y fecha de revisión.

Para Capital Semilla Emprende se tomará como caso de referencia la información oficial de Sercotec y una convocatoria regional versionada; la ficha general no heredará automáticamente cifras, porcentajes o fechas regionales.

## 19. Secuencia de entrega propuesta

1. Base técnica, autenticación y modelo de proyecto.
2. Creación guiada y ficha viva editable.
3. Catálogo editorial con los tres instrumentos piloto.
4. Motor de reglas, estados y explicaciones.
5. Checklist transversal y específico.
6. Trazabilidad de fuentes y avisos de vigencia.
7. Accesibilidad, pruebas integrales y carga editorial verificada.

La planificación de implementación definirá tecnología, esquema físico, rutas, componentes, migraciones y pruebas solo después de aprobar este diseño funcional.

## 20. Evolución posterior

- Incorporar el catálogo nacional por lotes institucionales y tipos de financiamiento.
- Añadir convocatorias regionales sin mezclar sus condiciones.
- Permitir carga de archivos únicamente para organización, manteniendo la prohibición de preevaluación salvo una decisión futura explícita.
- Generar borradores editables a partir de antecedentes maestros, claramente separados de formularios oficiales.
- Agregar alertas de apertura, cierre y actualización.
- Incorporar colaboración con socios o asesores y control de permisos.
- Medir cobertura del catálogo y frescura editorial como indicadores públicos de confianza.

## 21. Decisiones que este diseño deja cerradas

- La experiencia parte desde la idea y no desde un buscador de fondos.
- El proyecto y sus antecedentes son la fuente maestra.
- La IA estructura y explica; las reglas oficiales determinan los estados.
- El checklist registra progreso declarado, no validación documental.
- Las variaciones por región, año y versión se modelan como convocatorias separadas.
- La primera versión prueba el modelo con tres instrumentos reales y declara su cobertura limitada.
- La arquitectura queda preparada para ampliar el catálogo sin rediseñar el núcleo del producto.

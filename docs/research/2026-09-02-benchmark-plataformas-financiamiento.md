# Benchmark de plataformas de financiamiento y preparación de proyectos

Fecha de consulta: **2 de septiembre de 2026**. Producto analizado: **Impulsa Proyectos**.

## Decisión que busca apoyar

Identificar qué incorporar en las próximas versiones para que una persona en Chile transforme su idea tecnológica en un proyecto preparado para explorar financiamiento público.

**Recomendación:** concentrar la siguiente versión en una ruta de preparación que conecte antecedentes confirmados, oportunidades vigentes, próximos pasos y materiales reutilizables. El buscador, las alertas y el asistente con IA ya aparecen en otras ofertas; nuestra hipótesis de diferenciación debe ser la continuidad y trazabilidad de ese recorrido.

Se compararon **nueve plataformas: cuatro de Chile y cinco internacionales**, incluyendo referentes públicos, un competidor local cercano y software especializado. No todos atienden al mismo cliente: Instrumentl, por ejemplo, se orienta a organizaciones sin fines de lucro. Se estudian sus patrones de producto, no la aplicabilidad de sus fondos a Chile.

## Método y alcance de la evidencia

- **Nuestro producto:** revisión del código, catálogo, README y auditoría existente. Se describe el estado del repositorio; no se certifica que cada función esté desplegada en producción.
- **Otros productos:** páginas oficiales, documentación de ayuda y contenido público. En TramIA también se inspeccionó la portada renderizada en navegador.
- **Observado** significa visible en la página pública. **Documentado/anunciado** significa descrito por el proveedor; no equivale a una prueba funcional autenticada.
- No se crearon cuentas, contrataron servicios ni probaron sus motores con proyectos reales. Calidad de recomendaciones, precisión de IA, satisfacción, cobertura exhaustiva y resultados de adjudicación quedan sin validar.
- La falta de evidencia pública sobre una función se trata como desconocida, no como prueba de ausencia.
- Prioridad, esfuerzo y posicionamiento son juicios de producto. No son resultados estadísticos ni estimaciones comerciales validadas.

## 1. Punto de partida real

| Capacidad | Estado actual | Implicación para el benchmark |
|---|---|---|
| Creación desde relato libre | Implementada, con cuenta | Buen punto de entrada para principiantes; el valor principal aparece después del registro. |
| Interpretación del relato | Parcial: reglas de texto para componente tecnológico y problema | No hay todavía una entrevista adaptativa ni extracción general de todos los antecedentes. |
| Ficha reutilizable | Implementada, con confirmación/corrección del usuario | Base útil para construir materiales consistentes entre postulaciones. |
| Correspondencia con convocatorias | Reglas deterministas, estados, motivos y datos faltantes | La interfaz muestra solo el primer motivo; se puede aprovechar mejor el trabajo ya hecho. |
| Catálogo | Tres convocatorias de Sercotec, Corfo y FOSIS, cerradas; versión 2026-09-01.pilot.2 | La amplitud y utilidad inmediata son limitadas. |
| Fuentes y frescura | Enlaces oficiales, revisión y próxima revisión | La fecha de revisión no demuestra cobertura del universo de oportunidades. |
| Checklist por fondo y transversal | Implementados con progreso compartido | Conviene conservarlo y corregir la conservación de reglas propias de cada convocatoria. |
| Alertas y seguimiento de postulaciones | No aparecen implementados en el alcance revisado | No existe un ciclo completo para volver, preparar y registrar el resultado. |
| Canvas, pitch y presupuesto editables | No aparecen implementados como herramientas | Son una extensión posible de la ficha; hoy no se generan esos entregables. |
| Colaboración y documentos | Sin espacio de asesores ni almacenamiento de archivos en el MVP | Requieren un alcance adicional de permisos, versiones y operación. |

La agrupación transversal conserva el primer verificador, etapa y vigencia cuando encuentra un antecedente compartido. Esto respalda el problema descrito en la auditoría: **reutilizar un dato no debería sustituir las condiciones específicas de cada fondo**.

Evidencia local: [README](../../README.md), [extractor](../../src/domain/extract-idea.ts), [motor de correspondencia](../../src/domain/match.ts), [checklist](../../src/domain/checklist.ts), [catálogo](../../src/catalog/pilot.json), [pantalla del proyecto](../../src/app/(app)/proyectos/[projectId]/page.tsx) y [auditoría previa](../../audit/financiamiento-primeras-apps/informe.md).

## 2. Comparación de plataformas

| Plataforma / mercado | Qué ofrece según la evidencia | Qué incorporar en Impulsa | Cercanía y límite de comparación |
|---|---|---|---|
| **Chile Emprende — Chile** | El Ministerio describe buscador por filtros, búsqueda personalizada con ClaveÚnica y portal de datos sobre Mipymes y cooperativas. | Perfil territorial y empresarial; oportunidades según etapa; acceso al catálogo antes de completar una ficha extensa. | Referente público cercano para descubrimiento. La personalización está documentada, no se probó con ClaveÚnica. [Fuente oficial](https://www.economia.gob.cl/2026/06/03/conoce-chile-emprende-la-plataforma-que-reune-la-oferta-publica-de-apoyo-para-emprendedores.htm). |
| **Portal de Emprendimiento — Chile** | Oferta ajustada a características económicas, sociales y geográficas; agrupa programas, apoyos y capacitación. | Preguntas de perfil que cambien las opciones y derivaciones pertinentes cuando todavía no corresponde buscar un subsidio. | Cercano para personas que comienzan; su alcance y requisitos no son equivalentes a todos los proyectos tecnológicos. [ChileAtiende](https://www.chileatiende.gob.cl/fichas/131212-portal-de-emprendimiento). |
| **Fondos.gob.cl — Chile** | Búsqueda pública y fichas con institución, beneficiario, territorio, fechas y montos; portada organizada por fondos abiertos y categorías. | Exploración sin cuenta y presentación clara de oportunidades vigentes. | Referente transversal de descubrimiento, más amplio que emprendimiento tecnológico. Se revisó la página directamente porque el resultado inicial del buscador mostraba contenido antiguo. [Portal oficial](https://www.fondos.gob.cl/). |
| **TramIA — Chile** | Anuncia diagnóstico, asistente sobre bases, Canvas, pitch, cotizador y marketplace de asesores. La portada también anuncia alertas y acceso gratuito con límites de mensajes de IA. | Conectar la idea con herramientas de preparación y ofrecer ayuda contextual por convocatoria. | Es el competidor local más cercano **entre los encontrados**. Se verificó la oferta anunciada, no la calidad de esas funciones. [Acerca de](https://tramia.app/acerca-de) y [portada y planes](https://tramia.app/#planes). |
| **FANDIT — España** | Documenta búsqueda en lenguaje natural, filtros por perfil y ubicación, búsquedas guardadas y alertas por correo. Distingue convocatorias, concesiones y beneficiarios. | Convertir la descripción del usuario en filtros comprensibles; favoritos, alertas y separación entre oportunidades actuales e historial. | Referente cercano de búsqueda y gestión; combina acceso gratuito con funciones profesionales de pago. No prueba cobertura de Chile. [Guía del buscador](https://blog.fandit.es/ayuda/buscador-fandit/). |
| **Instrumentl — Estados Unidos** | Anuncia biblioteca documental, tareas, calendario, seguimiento, permisos y reutilización de fragmentos de respuestas. También cubre gestión posterior a la adjudicación. | Biblioteca de respuestas del proyecto y tablero sencillo para preparar cada postulación. | Referente de flujo de trabajo para organizaciones y equipos; su complejidad completa excede nuestro usuario inicial. [Descripción del producto](https://www.instrumentl.com/product-overview). |
| **OpenGrants — Estados Unidos** | Documenta recomendaciones de oportunidades abiertas con explicación del ajuste. Distingue explícitamente afinidad, elegibilidad y probabilidad de ganar. | Mostrar razones y datos faltantes sin confundir preparación con admisibilidad. | Útil para explicar recomendaciones. Su puntuación numérica no es necesaria para nuestro modelo de reglas. [Cómo funciona la correspondencia](https://opengrants.io/knowledge-base/how-match-scores-work/). |
| **business.gov.au — Australia** | Buscador público por ubicación, sector, tipo de empresa, antigüedad, objetivo y tipo de apoyo; separa abiertas, próximas y cerradas. Ofrece lista de guardados y salidas útiles sin resultados. | Separar subsidio, préstamo, asesoría y capacitación; orientar por objetivo y ofrecer una alternativa cuando no haya coincidencias. | Referente especialmente útil para claridad de navegación. Se observaron controles y textos públicos, no se probó el envío de guardados por correo. [Buscador oficial](https://business.gov.au/grants-and-programs). |
| **Uruguay Emprendedor — Uruguay** | Organiza el acceso por etapa; documenta autodiagnóstico, recursos, programas, instituciones y puntos de atención. | Ruta desde idea hasta crecimiento; directorio territorial de apoyo y recursos asociados a cada paso. | Referente regional de acompañamiento. El autodiagnóstico requiere registro y no se ejecutó. [Portal](https://www.uruguayemprendedor.uy/) y [preguntas frecuentes](https://www.uruguayemprendedor.uy/preguntas-frecuentes/). |

**Lectura competitiva:** la combinación de IA, búsqueda de fondos, Canvas y pitch ya se anuncia en Chile. La reutilización tampoco es exclusiva a escala internacional. Podemos especializar esos patrones para principiantes en Chile, con condiciones oficiales explícitas y continuidad entre lo que la persona declara, prepara y reutiliza. Esa ventaja debe demostrarse con usuarios.

## 3. Qué incorporar y en qué orden

Esfuerzo relativo: **bajo** = ampliación acotada de interfaz; **medio** = cambios de flujo, datos o servicio; **alto** = nuevo subsistema u operación continua. Son estimaciones preliminares, sin compromisos de plazo. El valor esperado se refiere a utilidad para la persona, no a probabilidad de adjudicación.

| Prioridad | Incorporación concreta | Referencia | Valor esperado / esfuerzo | Dependencia o criterio para darla por útil |
|---|---|---|---|---|
| **P0** | Catálogo con oportunidades abiertas y próximas, responsable de revisión e historial de cambios | Portales chilenos; FANDIT | Muy alto / alto y recurrente | Definir instituciones y territorios cubiertos; cada ficha conserva fuente, fecha y estado. Una apertura probable no se presenta como confirmada. |
| **P0** | Mantener verificador, vigencia y reglas por convocatoria al reutilizar antecedentes | Hallazgo propio | Muy alto / medio | Un dato compartido conserva los contextos de todos sus fondos; no hereda por defecto los del primero. |
| **P1** | Entrevista inicial con preguntas sobre problema, usuario, solución, etapa, territorio, formalización y ventas | Uruguay Emprendedor; TramIA | Alto / medio | Mostrar lo entendido y preguntar por vacíos decisivos. Toda inferencia requiere confirmación. |
| **P1** | Panel «Tus próximos tres pasos» | Síntesis propia a partir de las rutas por etapa | Alto / medio | Cada paso explica para qué sirve y qué oportunidad o material ayuda a preparar. |
| **P1** | Explicación completa por oportunidad: coincidencias, restricciones y datos pendientes | OpenGrants | Alto / bajo–medio | Aprovechar los motivos y datos faltantes que ya devuelve nuestro motor. |
| **P1** | Lista de interés y vista «Abiertas / Próximas / Referencias» | FANDIT; Australia | Alto / medio | Una convocatoria cerrada puede guardarse como referencia, sin aparecer como acción vigente. |
| **P1** | Alertas por apertura, cierre y cambios relevantes | FANDIT; oferta anunciada de TramIA | Alto / medio–alto | Requiere catálogo actualizado, preferencias del usuario y deduplicación de avisos. |
| **P1** | Ruta cuando no haya fondos: preparar materiales, validar la idea o buscar asesoría | Australia; Uruguay | Alto / bajo–medio | Cada proyecto conserva una siguiente acción útil incluso sin oportunidades vigentes. |
| **P2** | Comparador de dos o tres fondos | Síntesis propia sobre las fichas comparadas | Medio–alto / medio | Comparar territorio, estado, objetivo, aporte, requisitos y trabajo pendiente; distinguir dato desconocido de cero. |
| **P2** | Biblioteca editable de problema, propuesta de valor, Canvas, pitch y presupuesto | Instrumentl; TramIA | Alto / medio–alto | Una base común, versiones por convocatoria y exportación; los datos no confirmados quedan señalados. |
| **P2** | Tablero «Me interesa / Preparando / Enviada / Resultado» | Instrumentl | Medio–alto / medio | Registrar envío manual, fechas y notas; no implica integración con portales institucionales. |
| **P3** | Compartir con un asesor y permitir comentarios | Instrumentl; TramIA; Uruguay | Medio / alto | Permisos explícitos, trazabilidad y necesidad validada con usuarios. Empezar con compartir/exportar antes de construir un marketplace. |

### Una siguiente versión coherente

La primera entrega debería cerrar un recorrido completo:

1. La persona describe su idea y revisa un resumen inicial.
2. Confirma los datos que realmente cambian la orientación.
3. Ve oportunidades vigentes o una ruta de preparación adecuada.
4. Entiende por qué aparece cada alternativa y qué información falta.
5. Elige una oportunidad o un material de trabajo y recibe tres acciones concretas.
6. Guarda su avance y puede volver al mismo punto.

La actualización del catálogo y la corrección de requisitos compartidos deben preceder a las alertas. En una entrega posterior, la ficha alimentaría materiales editables y un tablero de postulaciones.

## 4. Tres direcciones de producto

| Dirección | Beneficio | Exigencia principal | Recomendación |
|---|---|---|---|
| Agregador de oportunidades | Resuelve la dispersión y permite descubrir apoyos | Cobertura y actualización continua; varios referentes ya hacen búsqueda personalizada | Tratarlo como una capacidad necesaria del producto. |
| **Asistente de preparación para principiantes** | Convierte una idea en antecedentes, acciones y materiales reutilizables | Buena entrevista, reglas comprensibles y continuidad del proyecto | **Foco recomendado**, por alineación con el usuario definido y el código actual. |
| Espacio profesional para asesores y organizaciones | Facilita trabajar con varios proyectos y clientes | Permisos, colaboración, operación comercial y necesidades distintas | Explorar después de validar el recorrido individual. |

Propuesta de posicionamiento a validar: **«Convierte tu idea en un proyecto preparado para buscar financiamiento en Chile, con próximos pasos claros y antecedentes que puedes reutilizar».**

## 5. Referencias comerciales y funciones que conviene postergar

TramIA anuncia una base gratuita y planes que amplían el uso de IA. FANDIT combina herramientas de búsqueda con planes profesionales, área de clientes y soluciones para gestores. Estos modelos muestran posibilidades comerciales; no demuestran que nuestro público esté dispuesto a pagar. [Planes de TramIA](https://tramia.app/#planes), [planes de FANDIT](https://fandit.es/precios).

La hipótesis inicial sería facilitar gratuitamente la orientación y probar el valor de la preparación persistente: materiales, versiones, seguimiento y colaboración. La alternativa de licencias para incubadoras o centros de apoyo merece entrevistas específicas antes de construir funciones para equipos.

Conviene postergar el marketplace completo, la rendición posterior a adjudicación, el autollenado de portales externos y una comunidad social generalista. También evitaría una puntuación de «éxito» o un chat genérico como centro de toda la experiencia: los próximos pasos y sus fuentes deben seguir siendo visibles.

No se recomienda ampliar indiscriminadamente el catálogo para aumentar un contador. Es preferible declarar una cobertura concreta y mantenerla que sugerir exhaustividad sin poder sostenerla.

## 6. Cómo validar que las incorporaciones aportan valor

Primero medir la experiencia actual y después comparar con la nueva. No hay una línea base de comportamiento aportada para este benchmark.

| Pregunta | Medida propuesta | Qué observar |
|---|---|---|
| ¿La persona comprende qué hacer? | Proporción de participantes capaces de explicar su siguiente paso al terminar la sesión | Deben poder relacionarlo con su proyecto, no repetir el nombre de una pantalla. |
| ¿Llega antes a una acción útil? | Tiempo desde el inicio hasta guardar una oportunidad pertinente o completar una acción de preparación | Incluir también los recorridos sin fondos vigentes. |
| ¿La extracción reduce trabajo? | Proporción de antecedentes propuestos que la persona confirma sin corregir | Separar errores de extracción y datos que el relato no contenía. |
| ¿Existe utilidad territorial? | Proporción de proyectos con oportunidad vigente pertinente o derivación útil, por región y etapa | No contar una oportunidad como pertinente solo porque está abierta. |
| ¿La reutilización ayuda? | Tiempo y campos que deben rehacerse al preparar una segunda convocatoria | Comprobar que se mantienen las diferencias específicas de cada fondo. |
| ¿Se mantiene la confianza? | Errores materiales detectados en fichas revisadas y tiempo hasta su corrección | Revisar requisitos, fechas, aportes y atribución de fuentes. |

Propuesta de investigación siguiente: sesiones con personas en etapa de idea, con prototipo sin ventas y con primeras ventas. Observar el recorrido y sus bloqueos antes de fijar metas numéricas. La adjudicación depende de factores externos y no sirve por sí sola para evaluar una mejora inicial de navegación.

## 7. Límites y pendientes de investigación

- Las capacidades comerciales descritas no acreditan precisión, facilidad de uso ni resultados reales.
- TramIA merece una comparación autenticada posterior por su proximidad funcional; esta revisión solo cubrió su comunicación pública.
- La escala publicitada de catálogos no se comparó numéricamente: las fuentes mezclan instrumentos, convocatorias históricas, ayudas y perfiles de financiadores.
- La documentación de FANDIT muestra recuentos distintos entre páginas. Se excluyeron de la comparación para evitar una falsa equivalencia.
- La apertura directa de la FAQ de Uruguay falló en una consulta; su contenido sí estaba disponible en el resultado indexado. Se usa como documentación publicada, no como prueba de ejecución.
- No se ha comprobado disponibilidad de APIs, licencias de reutilización ni acuerdos para integrar catálogos oficiales. Enlazar o revisar fuentes no equivale a disponer de una integración.
- Queda por validar con usuarios si la preparación transversal es un motivo suficiente para volver y, eventualmente, pagar.

**Decisión propuesta:** priorizar catálogo confiable, entrevista breve, explicación de compatibilidad y próximos pasos. Después añadir alertas y materiales reutilizables. Esa secuencia aprovecha la estructura existente y permite comprobar una mejora de utilidad antes de asumir un producto mucho más amplio.

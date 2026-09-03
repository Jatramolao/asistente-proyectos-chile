import type { AntecedentDefinition, AntecedentKey } from "./types";

export const ANTECEDENT_DEFINITIONS = [
  { key: "essence.problem", section: "essence", label: "Problema u oportunidad", help: "¿Qué dificultad observas y por qué sería útil resolverla? Puedes contar un ejemplo.", valueType: "long_text", decisive: false },
  { key: "essence.evidence", section: "essence", label: "Evidencia del problema", help: "Datos, observaciones o experiencias que muestran que el problema existe.", valueType: "long_text", decisive: false },
  { key: "essence.solution", section: "essence", label: "Solución propuesta", help: "¿Qué quieres crear y cómo ayudaría a resolver esa dificultad?", valueType: "long_text", decisive: false },
  { key: "essence.value_proposition", section: "essence", label: "Propuesta de valor", help: "Por qué alguien preferiría esta solución.", valueType: "long_text", decisive: false },
  { key: "essence.customer", section: "essence", label: "Cliente o beneficiario", help: "¿Quién usaría tu solución o pagaría por ella? Describe a esas personas u organizaciones.", valueType: "short_text", decisive: false },
  { key: "essence.territory", section: "essence", label: "Territorio de impacto", help: "Dónde se implementaría o produciría impacto.", valueType: "region", decisive: true },
  { key: "market.competition", section: "market", label: "Alternativas y competencia", help: "Cómo se resuelve hoy el problema.", valueType: "long_text", decisive: false },
  { key: "market.channels", section: "market", label: "Canales", help: "Cómo llegarías a clientes o beneficiarios.", valueType: "long_text", decisive: false },
  { key: "market.revenue_status", section: "market", label: "Estado de ingresos o ventas", help: "Si la idea aún no vende o ya registra ingresos.", valueType: "status", decisive: true },
  { key: "market.costs", section: "market", label: "Costos principales", help: "Qué recursos generan los costos más relevantes.", valueType: "long_text", decisive: false },
  { key: "market.size", section: "market", label: "Mercado estimado", help: "Alcance de clientes o beneficiarios posibles.", valueType: "long_text", decisive: false },
  { key: "market.partners", section: "market", label: "Alianzas", help: "Organizaciones necesarias para ejecutar o escalar.", valueType: "long_text", decisive: false },
  { key: "technology.component", section: "technology", label: "Componente tecnológico", help: "¿Usarías una aplicación, sensores u otra tecnología? No necesitas conocer los detalles técnicos.", valueType: "long_text", decisive: true },
  { key: "technology.novelty", section: "technology", label: "Novedad frente a alternativas", help: "¿Qué haría tu solución mejor o diferente de lo que las personas usan hoy?", valueType: "long_text", decisive: true },
  { key: "technology.ownership", section: "technology", label: "Tecnología propia o existente", help: "Qué desarrollarás y qué integrarás de terceros.", valueType: "long_text", decisive: false },
  { key: "technology.maturity", section: "technology", label: "Madurez de la solución", help: "Idea, prototipo, piloto o producto operativo.", valueType: "maturity", decisive: true },
  { key: "technology.ip", section: "technology", label: "Propiedad intelectual", help: "Activos, registros o acuerdos relevantes.", valueType: "long_text", decisive: false },
  { key: "technology.validation", section: "technology", label: "Validación técnica", help: "Pruebas o resultados técnicos obtenidos.", valueType: "long_text", decisive: false },
  { key: "execution.team", section: "execution", label: "Equipo y capacidades", help: "Personas y experiencia necesarias.", valueType: "long_text", decisive: false },
  { key: "execution.activities", section: "execution", label: "Actividades", help: "Trabajo principal para lograr el proyecto.", valueType: "long_text", decisive: false },
  { key: "execution.milestones", section: "execution", label: "Hitos", help: "Resultados intermedios observables.", valueType: "long_text", decisive: false },
  { key: "execution.timeline", section: "execution", label: "Plazo", help: "Tiempo estimado de ejecución.", valueType: "short_text", decisive: false },
  { key: "execution.budget", section: "execution", label: "Presupuesto estimado", help: "Costo total aproximado del proyecto.", valueType: "money", decisive: false },
  { key: "execution.cofunding", section: "execution", label: "Cofinanciamiento disponible", help: "Recursos propios que podrías aportar.", valueType: "money", decisive: true },
  { key: "execution.infrastructure", section: "execution", label: "Infraestructura", help: "Espacios, equipos o plataformas necesarias.", valueType: "long_text", decisive: false },
  { key: "execution.providers", section: "execution", label: "Proveedores", help: "Servicios o compras relevantes para ejecutar.", valueType: "long_text", decisive: false },
  { key: "impact.outcomes", section: "impact", label: "Resultados esperados", help: "Cambios que debería producir el proyecto.", valueType: "long_text", decisive: false },
  { key: "impact.jobs", section: "impact", label: "Empleo", help: "Empleos que podría crear o sostener.", valueType: "long_text", decisive: false },
  { key: "impact.social", section: "impact", label: "Impacto social", help: "Beneficios sociales previstos.", valueType: "long_text", decisive: false },
  { key: "impact.environmental", section: "impact", label: "Impacto ambiental", help: "Efectos positivos o riesgos ambientales.", valueType: "long_text", decisive: false },
  { key: "impact.indicators", section: "impact", label: "Indicadores", help: "Cómo medirías los resultados.", valueType: "long_text", decisive: false },
  { key: "impact.risks", section: "impact", label: "Riesgos", help: "Factores que podrían dificultar la ejecución.", valueType: "long_text", decisive: false },
  { key: "applicant.age", section: "applicant", label: "Edad", help: "Edad de la persona que postularía.", valueType: "number", decisive: true },
  { key: "applicant.gender", section: "applicant", label: "Género registral", help: "Antecedente requerido solo por convocatorias con foco de género.", valueType: "status", decisive: true },
  { key: "applicant.region", section: "applicant", label: "Región de residencia", help: "Región declarada por quien postula.", valueType: "region", decisive: true },
  { key: "applicant.commune", section: "applicant", label: "Comuna de residencia", help: "Comuna declarada para revisar disponibilidad territorial.", valueType: "short_text", decisive: true },
  { key: "applicant.formalization", section: "applicant", label: "Situación de formalización", help: "¿Postularías a tu nombre o ya tienes una empresa constituida? Esto es distinto del inicio de actividades ante el SII.", valueType: "status", decisive: true },
  { key: "applicant.sii_first_category", section: "applicant", label: "Inicio de actividades en primera categoría", help: "Situación tributaria declarada por el usuario.", valueType: "boolean", decisive: true },
  { key: "applicant.sii_activity_age_months", section: "applicant", label: "Antigüedad del inicio de actividades", help: "Meses transcurridos desde el inicio de actividades, cuando existe.", valueType: "number", decisive: true },
  { key: "applicant.has_sales", section: "applicant", label: "Ventas formales", help: "Si existen ventas registradas formalmente.", valueType: "boolean", decisive: true },
  { key: "applicant.rsh_percent", section: "applicant", label: "Tramo del Registro Social de Hogares", help: "Porcentaje declarado del RSH, cuando corresponda.", valueType: "number", decisive: true },
  { key: "applicant.valid_id", section: "applicant", label: "Cédula de identidad vigente", help: "Disponibilidad declarada de una cédula vigente.", valueType: "boolean", decisive: true },
  { key: "applicant.clave_unica", section: "applicant", label: "ClaveÚnica disponible", help: "Disponibilidad declarada para ingresar al portal correspondiente.", valueType: "boolean", decisive: true },
  { key: "applicant.company_ownership_percent", section: "applicant", label: "Participación en sociedades existentes", help: "Mayor porcentaje de participación declarado.", valueType: "number", decisive: true },
  { key: "applicant.labor_tax_debt", section: "applicant", label: "Deudas laborales, previsionales o tributarias", help: "Existencia declarada de estas deudas.", valueType: "boolean", decisive: true },
  { key: "applicant.alimony_registry", section: "applicant", label: "Registro de deudores de pensiones", help: "Inscripción declarada en el registro correspondiente.", valueType: "boolean", decisive: true },
] as const satisfies readonly AntecedentDefinition[];

const definitionsByKey = new Map<AntecedentKey, AntecedentDefinition>(
  ANTECEDENT_DEFINITIONS.map((definition) => [definition.key, definition]),
);

export function getAntecedentDefinition(key: AntecedentKey): AntecedentDefinition {
  const definition = definitionsByKey.get(key);
  if (!definition) {
    throw new Error(`Unknown antecedent key: ${key}`);
  }
  return definition;
}

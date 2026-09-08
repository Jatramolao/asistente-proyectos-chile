import type { AntecedentKey, ChecklistStatus } from "./types";

export const ALLIN_CALL_ID = "duoc-allin-chile-2026";
export type CallResponseDefinition = {
  stage: "participation" | "registration" | "assignment";
  minimum: number;
  options?: { value: string; label: string }[];
  accepted?: string[];
  seed?: AntecedentKey;
  seedResponse?: string;
  example?: string;
};

const pending = { value: "pending", label: "Todavía no" };
const definitions: Record<string, CallResponseDefinition> = {
  profile: { stage: "participation", minimum: 1, options: [{ value: "student", label: "Soy estudiante regular matriculado de Duoc UC" }, { value: "graduate", label: "Soy titulado de Duoc UC" }, { value: "other", label: "No cumplo estas condiciones como titular" }, pending], accepted: ["student", "graduate"] },
  team: { stage: "participation", minimum: 1, options: [pending, ...[2, 3, 4, 5].map(size => ({ value: String(size), label: `${size} integrantes, incluyéndome` }))], accepted: ["2", "3", "4", "5"] },
  conditions: { stage: "participation", minimum: 1, options: [pending, { value: "reviewed", label: "Revisé las condiciones y no identifiqué impedimentos" }], accepted: ["reviewed"] },
  "intro-problem": { stage: "registration", minimum: 1, seed: "essence.problem" },
  "intro-solution": { stage: "registration", minimum: 1, seed: "essence.solution" },
  "intro-sector": { stage: "registration", minimum: 1 },
  "intro-motivation": { stage: "registration", minimum: 1, seed: "execution.team" },
  receipt: { stage: "registration", minimum: 1, options: [pending, { value: "received", label: "Recibí el correo de confirmación de la inscripción" }], accepted: ["received"] },
  admission: { stage: "assignment", minimum: 1, options: [pending, { value: "enabled", label: "Me notificaron la habilitación para el Encargo 1" }, { value: "not_admissible", label: "Me notificaron que no soy admisible" }], accepted: ["enabled"] },
  "assignment-problem": { stage: "assignment", minimum: 680, seedResponse: "intro-problem", example: "Si estudias dificultades para coordinar equipos, explica quién las experimenta, cómo trabaja hoy y qué consecuencias observaste. Usa entrevistas o datos reales; no inventes cifras." },
  "assignment-solution": { stage: "assignment", minimum: 550, seedResponse: "intro-solution", example: "Describe qué haría un estudiante con tu herramienta, qué tarea mejoraría y cómo comprobarías ese beneficio. Distingue una funcionalidad que imaginas de una que ya probaste." },
  "assignment-innovation": { stage: "assignment", minimum: 680, example: "Compara tu propuesta con planillas, grupos de mensajería u otras soluciones que tus usuarios ya utilizan. Explica una diferencia útil y verificable, no solo que usarás IA." },
  "assignment-motivation": { stage: "assignment", minimum: 550, seedResponse: "intro-motivation", example: "Relaciona los roles del equipo con habilidades reales: entrevistar usuarios, diseñar interfaces, programar o probar. Explica qué necesitan aprender; no es obligatorio tener experiencia profesional." },
  "assignment-delivery": { stage: "assignment", minimum: 1, options: [pending, { value: "delivered", label: "Entregué el Encargo 1 en el medio oficial indicado" }], accepted: ["delivered"] },
};

export function getCallResponse(itemKey: string): CallResponseDefinition | undefined {
  const prefix = `requirement:${ALLIN_CALL_ID}:`;
  if (!itemKey.startsWith(prefix)) return undefined;
  const id = itemKey.slice(prefix.length);
  return Object.hasOwn(definitions, id) ? definitions[id] : undefined;
}

export function responseIsReady(definition: CallResponseDefinition, value: string): boolean {
  const normalized = value.trim();
  return normalized.length <= 10000 && (definition.accepted ? definition.accepted.includes(normalized) : normalized.length >= definition.minimum);
}

export function responseStatus(definition: CallResponseDefinition, value: string): ChecklistStatus {
  return responseIsReady(definition, value) ? "user_completed_unvalidated" : value.trim() ? "in_progress" : "pending";
}

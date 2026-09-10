import type { OfficialSource, Requirement } from "./types";

const ALL_IN_CALL_ID = "duoc-allin-chile-2026";
const ALL_IN_EDITORIAL_VERSION = "2026-09-07.allin.1";

export type GuidanceBlock =
  | { type: "paragraph"; title: string; text: string }
  | { type: "list"; title: string; items: string[] }
  | { type: "steps"; title: string; items: string[] };

export type RequirementGuidanceEntry = {
  editorialVersion: string;
  instruction: string;
  essentialConditions?: string[];
  blocks: GuidanceBlock[];
};

export type ResolvedRequirementGuidance = {
  requirementId: string;
  title: string;
  instruction: string;
  essentialConditions: string[];
  blocks: GuidanceBlock[];
  evidence: {
    description: string;
    verifier: string;
    validity: string | null;
    sources: Array<Pick<OfficialSource, "id" | "title" | "officialUrl">>;
    hasUnavailableSources: boolean;
  };
};

export type RequirementGuidanceMap = Record<string, ResolvedRequirementGuidance>;

const GUIDANCE: Readonly<Record<string, RequirementGuidanceEntry>> = {
  [`${ALL_IN_CALL_ID}:intro-problem`]: {
    editorialVersion: ALL_IN_EDITORIAL_VERSION,
    instruction: "Describe qué problema u oportunidad observaste, a quién afecta y en qué situación ocurre.",
    blocks: [
      {
        type: "list",
        title: "Qué incluir",
        items: [
          "Quién experimenta la dificultad.",
          "En qué situación aparece.",
          "Qué consecuencias observaste.",
        ],
      },
      {
        type: "paragraph",
        title: "Un ejemplo",
        text: "Los pequeños comercios del barrio pierden ventas porque sus clientes no saben qué productos tienen disponibles.",
      },
      {
        type: "paragraph",
        title: "Sobre el ejemplo",
        text: "Ejemplo orientativo; describe tu propia situación.",
      },
      {
        type: "paragraph",
        title: "Ten presente",
        text: "No necesitas un proyecto terminado. Describe primero la dificultad; la solución se trabaja en la siguiente tarea.",
      },
    ],
  },
  [`${ALL_IN_CALL_ID}:profile`]: {
    editorialVersion: ALL_IN_EDITORIAL_VERSION,
    instruction: "Indica si serás titular como estudiante regular matriculado de Duoc UC o como titulado de una carrera técnica o profesional de Duoc UC.",
    blocks: [
      {
        type: "paragraph",
        title: "Qué significa",
        text: "El titular es la persona que representa al equipo. La condición de pertenecer a Duoc UC corresponde al titular; los demás integrantes pueden ser externos.",
      },
      {
        type: "paragraph",
        title: "Ten presente",
        text: "Selecciona la opción que describe tu situación actual. Esta respuesta no confirma la admisibilidad del equipo.",
      },
    ],
  },
  [`${ALL_IN_CALL_ID}:receipt`]: {
    editorialVersion: ALL_IN_EDITORIAL_VERSION,
    instruction: "Confirma solo si recibiste el correo de recepción de la inscripción enviada por el titular en Santander X.",
    essentialConditions: [
      "La inscripción se realiza en el sitio oficial; guardar aquí no la envía.",
      "Presenta una sola inscripción. Si necesitas corregirla, consulta a Ruta IE.",
      "No ingreses aquí credenciales ni datos personales del equipo.",
    ],
    blocks: [
      {
        type: "steps",
        title: "Cómo comprobarlo",
        items: [
          "Accede a la inscripción desde el sitio oficial con la cuenta del titular.",
          "Completa y envía el formulario en Santander X.",
          "Comprueba el correo de recepción antes de confirmar esta tarea.",
        ],
      },
      {
        type: "paragraph",
        title: "Ten presente",
        text: "Las bases y la página difieren en el tratamiento de inscripciones duplicadas. Si necesitas corregir una inscripción, consulta a Ruta IE.",
      },
    ],
  },
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every(isNonEmptyString);
}

function isGuidanceBlock(value: unknown): value is GuidanceBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as Partial<GuidanceBlock>;
  if (!isNonEmptyString(block.title)) return false;
  if (block.type === "paragraph") return isNonEmptyString(block.text);
  if (block.type === "list" || block.type === "steps") return isStringList(block.items);
  return false;
}

function isValidGuidanceEntry(value: unknown): value is RequirementGuidanceEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<RequirementGuidanceEntry>;
  return isNonEmptyString(entry.editorialVersion)
    && isNonEmptyString(entry.instruction)
    && Array.isArray(entry.blocks)
    && entry.blocks.length > 0
    && entry.blocks.every(isGuidanceBlock)
    && (entry.essentialConditions === undefined || isStringList(entry.essentialConditions));
}

function resolveSources(requirement: Requirement, sources: readonly OfficialSource[]) {
  const available = new Map(sources.map(source => [source.id, source]));
  const seenUrls = new Set<string>();
  const resolved: Array<Pick<OfficialSource, "id" | "title" | "officialUrl">> = [];
  let unavailableCount = 0;

  for (const sourceId of requirement.sourceIds) {
    const source = available.get(sourceId);
    if (!source) {
      unavailableCount += 1;
      continue;
    }
    if (seenUrls.has(source.officialUrl)) continue;
    seenUrls.add(source.officialUrl);
    resolved.push({ id: source.id, title: source.title, officialUrl: source.officialUrl });
  }

  return {
    sources: resolved,
    hasUnavailableSources: requirement.sourceIds.length === 0 || unavailableCount > 0,
  };
}

export function resolveGuidanceEntry({
  entry,
  requirement,
  sources,
}: {
  entry: unknown;
  requirement: Requirement;
  sources: readonly OfficialSource[];
}): ResolvedRequirementGuidance | null {
  if (!isValidGuidanceEntry(entry)) return null;
  const resolvedSources = resolveSources(requirement, sources);
  return {
    requirementId: requirement.id,
    title: requirement.label,
    instruction: entry.instruction,
    essentialConditions: entry.essentialConditions ?? [],
    blocks: entry.blocks,
    evidence: {
      description: requirement.description,
      verifier: requirement.verifier,
      validity: requirement.validity,
      ...resolvedSources,
    },
  };
}

export function resolveRequirementGuidance({
  callId,
  editorialVersion,
  requirement,
  sources,
}: {
  callId: string;
  editorialVersion: string | undefined;
  requirement: Requirement;
  sources: readonly OfficialSource[];
}): ResolvedRequirementGuidance | null {
  const entry = GUIDANCE[`${callId}:${requirement.id}`];
  if (!entry || entry.editorialVersion !== editorialVersion) return null;
  return resolveGuidanceEntry({ entry, requirement, sources });
}

export function buildRequirementGuidanceMap({
  callId,
  editorialVersion,
  requirements,
  sources,
}: {
  callId: string;
  editorialVersion: string | undefined;
  requirements: readonly Requirement[];
  sources: readonly OfficialSource[];
}): RequirementGuidanceMap {
  return Object.fromEntries(requirements.flatMap(requirement => {
    const guidance = resolveRequirementGuidance({ callId, editorialVersion, requirement, sources });
    return guidance ? [[requirement.id, guidance]] : [];
  }));
}

import { hasConfirmedValue } from "./antecedent-input";
import type { AntecedentKey, ProjectAntecedent } from "./types";

export const BEGINNER_GROUPS = [
  {
    title: "1. Tu idea y a quién ayuda",
    help: "Empieza con tus propias palabras. No necesitas conocer los nombres de los fondos.",
    keys: ["essence.problem", "essence.solution", "essence.customer"],
  },
  {
    title: "2. Qué has desarrollado hasta ahora",
    help: "Tener solo una idea también es un punto de partida. Cuéntanos qué existe hoy.",
    keys: ["technology.component", "technology.maturity", "technology.novelty"],
  },
  {
    title: "3. Desde dónde y cómo comenzarías",
    help: "Estos datos ayudan a orientar la búsqueda. Si aún no sabes una respuesta, puedes dejarla pendiente.",
    keys: ["applicant.region", "applicant.formalization", "applicant.has_sales"],
  },
] as const satisfies ReadonlyArray<{ title: string; help: string; keys: readonly AntecedentKey[] }>;

export const BEGINNER_KEYS: readonly AntecedentKey[] = BEGINNER_GROUPS.flatMap((group) => [...group.keys]);

export function getBeginnerProgress(antecedents: readonly ProjectAntecedent[]) {
  const byKey = new Map(antecedents.map((item) => [item.key, item]));
  const pending = BEGINNER_KEYS.filter((key) => !hasConfirmedValue(byKey.get(key)));
  return { completed: BEGINNER_KEYS.length - pending.length, total: BEGINNER_KEYS.length, nextKeys: pending.slice(0, 3) };
}

export function emptyAntecedent(projectId: string, key: AntecedentKey): ProjectAntecedent {
  return {
    id: `missing-${key}`, projectId, key, value: null, confirmationStatus: "missing",
    origin: "manual", sourceExcerpt: null, updatedAt: new Date(0).toISOString(),
  };
}

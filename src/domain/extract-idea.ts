import type { AntecedentKey, AntecedentValue } from "./types";

export type InferredAntecedent = {
  key: AntecedentKey;
  value: AntecedentValue;
  confirmationStatus: "inferred";
  origin: "narrative";
  sourceExcerpt: string;
};

const TECHNOLOGY_PATTERN =
  /\b(software|plataforma|aplicaci[oó]n|app|inteligencia artificial|ia|sensor(?:es)?|robot(?:s|ica)?|biotecnolog[ií]a|hardware|algoritmo|datos|iot|internet de las cosas|automatizaci[oó]n)\b/i;
const PROBLEM_PATTERN = /\b(?:para|busca|permite)\s+(?:detectar|resolver|reducir|evitar|mejorar|prevenir|facilitar|optimizar)\b/i;

function sentences(narrative: string): string[] {
  return narrative
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function extractIdea(narrative: string): InferredAntecedent[] {
  const proposals: InferredAntecedent[] = [];

  for (const sentence of sentences(narrative)) {
    if (!proposals.some((item) => item.key === "technology.component") && TECHNOLOGY_PATTERN.test(sentence)) {
      proposals.push({
        key: "technology.component",
        value: sentence,
        confirmationStatus: "inferred",
        origin: "narrative",
        sourceExcerpt: sentence,
      });
    }

    if (!proposals.some((item) => item.key === "essence.problem") && PROBLEM_PATTERN.test(sentence)) {
      proposals.push({
        key: "essence.problem",
        value: sentence,
        confirmationStatus: "inferred",
        origin: "narrative",
        sourceExcerpt: sentence,
      });
    }
  }

  return proposals;
}

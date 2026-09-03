import { z } from "zod";

const projectNarrativeSchema = z
  .string()
  .trim()
  .min(40, "Describe tu idea con al menos 40 caracteres.")
  .max(5000, "La descripción no puede superar los 5.000 caracteres.");

export function parseProjectNarrative(input: string) {
  const narrative = projectNarrativeSchema.parse(input);
  const prefix = narrative.slice(0, 80);
  const completeWords = narrative.length > 80 && !/\s/.test(narrative[80])
    ? prefix.slice(0, prefix.lastIndexOf(" ") === -1 ? 0 : prefix.lastIndexOf(" "))
    : prefix;
  const name = completeWords.trim().replace(/[.,;:]$/, "") || "Mi proyecto";

  return { narrative, name };
}

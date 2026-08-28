import { z } from "zod";

const projectNarrativeSchema = z
  .string()
  .trim()
  .min(40, "Describe tu idea con al menos 40 caracteres.")
  .max(5000, "La descripción no puede superar los 5.000 caracteres.");

export function parseProjectNarrative(input: string) {
  const narrative = projectNarrativeSchema.parse(input);
  const name = narrative.slice(0, 80).trim().replace(/[.,;:]$/, "");

  return { narrative, name };
}

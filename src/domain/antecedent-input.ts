import { getAntecedentDefinition } from "./antecedents";
import type { AntecedentKey, AntecedentValue, ProjectAntecedent } from "./types";

export function hasConfirmedValue(item: Pick<ProjectAntecedent, "value" | "confirmationStatus"> | undefined): boolean {
  if (!item || !["confirmed", "corrected"].includes(item.confirmationStatus)) return false;
  if (item.value === null) return false;
  if (typeof item.value === "string") return item.value.trim().length > 0;
  return typeof item.value !== "number" || Number.isFinite(item.value);
}

export function parseAntecedentValue(key: AntecedentKey, rawValue: string): AntecedentValue {
  const value = rawValue.trim();
  if (!value) return null;
  const { valueType } = getAntecedentDefinition(key);
  if (valueType === "number" || valueType === "money") {
    const normalized = value.replace(/\./g, "").replace(",", ".");
    if (!/^-?\d+(?:\.\d+)?$/.test(normalized)) return null;
    const number = Number(normalized);
    return Number.isFinite(number) ? number : null;
  }
  if (valueType === "boolean") {
    if (/^(sí|si|true)$/i.test(value)) return true;
    if (/^(no|false)$/i.test(value)) return false;
    return null;
  }
  return value;
}

export function getAnswerOptions(key: AntecedentKey): ReadonlyArray<{ value: string; label: string }> {
  if (getAntecedentDefinition(key).valueType === "boolean") return [
    { value: "true", label: "Sí" }, { value: "false", label: "No" },
  ];
  if (key === "technology.maturity") return [
    { value: "idea", label: "Tengo una idea, todavía no la he construido" },
    { value: "prototype", label: "Tengo un prototipo o una primera versión" },
    { value: "pilot", label: "La estoy probando con personas usuarias" },
    { value: "operating", label: "La solución ya funciona y se utiliza" },
  ];
  if (key === "applicant.formalization") return [
    { value: "natural_person", label: "Postularía como persona natural" },
    { value: "company", label: "Tengo una empresa constituida" },
  ];
  if (key === "applicant.gender") return [
    { value: "female", label: "Femenino" },
    { value: "male", label: "Masculino" },
    { value: "other", label: "Otra opción registral" },
  ];
  return [];
}

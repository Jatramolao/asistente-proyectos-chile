"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AntecedentKey, AntecedentValue, ConfirmationStatus } from "@/domain/types";
import { getAntecedentDefinition } from "@/domain/antecedents";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";
import { createProjectFromNarrative } from "@/server/services/projects";

export async function createProjectAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const project = createProjectFromNarrative(getDb(), userId, String(formData.get("narrative") ?? ""));
  redirect(`/proyectos/${project.id}`);
}

function parseValue(key: AntecedentKey, rawValue: string): AntecedentValue {
  const definition = getAntecedentDefinition(key);
  if (definition.valueType === "number" || definition.valueType === "money") {
    const parsed = Number(rawValue.replace(/\./g, "").replace(",", "."));
    return Number.isFinite(parsed) ? parsed : rawValue;
  }
  if (definition.valueType === "boolean") {
    if (/^(sí|si|true)$/i.test(rawValue.trim())) return true;
    if (/^(no|false)$/i.test(rawValue.trim())) return false;
  }
  return rawValue.trim();
}

export async function confirmAntecedentAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const projectId = String(formData.get("projectId") ?? "");
  const rawKey = String(formData.get("key") ?? "");
  const intent = String(formData.get("intent") ?? "");
  const definition = getAntecedentDefinition(rawKey as AntecedentKey);

  const statuses: Record<string, ConfirmationStatus> = {
    confirm: "confirmed",
    correct: "corrected",
    missing: "missing",
  };
  const confirmationStatus = statuses[intent];
  if (!confirmationStatus) throw new Error("Acción de antecedente no reconocida.");

  const rawValue = String(formData.get("value") ?? "");
  const value = confirmationStatus === "missing" ? null : parseValue(definition.key, rawValue);
  const updated = projectRepository(getDb()).upsertAntecedent(userId, projectId, {
    key: definition.key,
    value,
    confirmationStatus,
    origin: "answer",
  });

  if (!updated) throw new Error("No tienes acceso a este proyecto.");
  revalidatePath(`/proyectos/${projectId}`);
}

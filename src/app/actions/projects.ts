"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AntecedentKey, ConfirmationStatus } from "@/domain/types";
import { parseAntecedentValue } from "@/domain/antecedent-input";
import { getAntecedentDefinition } from "@/domain/antecedents";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";
import { loadCatalog } from "@/server/services/catalog";
import { createProjectFromNarrative } from "@/server/services/projects";

export async function createProjectAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const callId = String(formData.get("callId") ?? "");
  if (callId && !loadCatalog().calls.some(call => call.id === callId)) throw new Error("Este apoyo no existe en el catálogo.");
  const project = createProjectFromNarrative(getDb(), userId, String(formData.get("narrative") ?? ""));
  if (callId) projectRepository(getDb()).selectCall(userId, project.id, callId);
  redirect(`/proyectos/${project.id}`);
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
  const value = confirmationStatus === "missing" ? null : parseAntecedentValue(definition.key, rawValue);
  const updated = projectRepository(getDb()).upsertAntecedent(userId, projectId, {
    key: definition.key,
    value,
    confirmationStatus: value === null ? "missing" : confirmationStatus,
    origin: "answer",
  });

  if (!updated) throw new Error("No tienes acceso a este proyecto.");
  revalidatePath(`/proyectos/${projectId}`);
}

export async function selectCallAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const projectId = String(formData.get("projectId") ?? "");
  const callId = String(formData.get("callId") ?? "");
  if (!loadCatalog().calls.some(call => call.id === callId)) throw new Error("Este apoyo no existe en el catálogo.");
  if (!projectRepository(getDb()).selectCall(userId, projectId, callId)) throw new Error("No tienes acceso a este proyecto.");
  revalidatePath(`/proyectos/${projectId}`);
  redirect(`/proyectos/${projectId}#oportunidades`);
}

export async function removeCallAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const projectId = String(formData.get("projectId") ?? "");
  const callId = String(formData.get("callId") ?? "");
  if (!projectRepository(getDb()).removeSelectedCall(userId, projectId, callId)) throw new Error("No tienes acceso a este proyecto.");
  revalidatePath(`/proyectos/${projectId}`);
}

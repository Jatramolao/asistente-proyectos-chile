import type Database from "better-sqlite3";
import { ALLIN_CALL_ID, getCallResponse, responseStatus } from "@/domain/call-responses";
import { projectRepository } from "@/server/db/repositories";

export function saveCallResponse(db: Database.Database, userId: string, input: { projectId: string; itemKey: string; value: string }) {
  const definition = getCallResponse(input.itemKey);
  const value = input.value.trim();
  if (!definition || input.value.length > 10000 || (value && definition.options && !definition.options.some(option => option.value === value))) {
    throw new Error("Respuesta inválida.");
  }
  const projects = projectRepository(db);
  if (!projects.getById(userId, input.projectId) || !projects.listSelectedCalls(userId, input.projectId).includes(ALLIN_CALL_ID)) {
    throw new Error("Selecciona la convocatoria en tu proyecto antes de guardar.");
  }
  const saved = projects.setChecklistProgress(userId, input.projectId, { itemKey: input.itemKey, status: responseStatus(definition, value), note: value, reason: null });
  if (!saved) throw new Error("No pudimos guardar la respuesta en este proyecto.");
}

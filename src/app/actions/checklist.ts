"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/server/db/client";
import { projectRepository } from "@/server/db/repositories";
import { requireSession } from "@/server/session";

const updateSchema = z.object({
  projectId: z.string().uuid(),
  itemKey: z.string().min(1).max(240),
  status: z.enum([
    "pending",
    "in_progress",
    "user_completed_unvalidated",
    "not_applicable",
    "institution_verifies",
    "future_if_selected",
    "stale",
  ]),
  note: z.string().trim().max(1000),
  reason: z.string().trim().max(1000),
});

export async function updateChecklistItemAction(formData: FormData): Promise<void> {
  const { userId } = await requireSession();
  const input = updateSchema.parse({
    projectId: formData.get("projectId"),
    itemKey: formData.get("itemKey"),
    status: formData.get("status"),
    note: formData.get("note") ?? "",
    reason: formData.get("reason") ?? "",
  });

  if (input.status === "not_applicable" && !input.reason) {
    throw new Error("Indica por qué este requisito no aplica.");
  }

  const updated = projectRepository(getDb()).setChecklistProgress(userId, input.projectId, {
    itemKey: input.itemKey,
    status: input.status,
    note: input.note || null,
    reason: input.reason || null,
  });
  if (!updated) throw new Error("No tienes acceso a este proyecto.");

  revalidatePath(`/proyectos/${input.projectId}`);
}

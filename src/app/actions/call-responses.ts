"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/server/db/client";
import { requireSession } from "@/server/session";
import { saveCallResponse } from "@/server/services/call-responses";

export async function saveCallResponseAction(data: FormData): Promise<void> {
  const { userId } = await requireSession();
  const input = z.object({ projectId: z.string().uuid(), itemKey: z.string().max(240), value: z.string().max(10000) }).parse({ projectId: data.get("projectId"), itemKey: data.get("itemKey"), value: data.get("value") });
  saveCallResponse(getDb(), userId, input);
  revalidatePath(`/proyectos/${input.projectId}`);
}

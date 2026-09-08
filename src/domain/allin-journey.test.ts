import { describe, expect, it } from "vitest";
import { loadCatalog } from "@/server/services/catalog";
import { buildPreparationJourney } from "./preparation-journey";
import { emptyAntecedent } from "./beginner-guide";
import { buildChecklist } from "./checklist";
import { getCallResponse, responseIsReady } from "./call-responses";

const callId = "duoc-allin-chile-2026";
const key = (id: string) => `requirement:${callId}:${id}`;

describe("All In preparation", () => {
  it.each([["assignment-problem", 680], ["assignment-solution", 550], ["assignment-innovation", 680], ["assignment-motivation", 550]] as const)("enforces both boundaries for %s", (id, minimum) => {
    const definition = getCallResponse(key(id))!;
    expect(responseIsReady(definition, "a".repeat(minimum - 1))).toBe(false);
    expect(responseIsReady(definition, "a".repeat(minimum))).toBe(true);
    expect(responseIsReady(definition, " ".repeat(minimum))).toBe(false);
  });
  it("has three editable stages and three conditional previews, without a budget stage", () => {
    const call = loadCatalog().calls.find(call => call.id === callId)!;
    const stages = buildPreparationJourney({ call, antecedents: [], progress: [] })!;
    expect(stages.map(stage => stage.id)).toEqual(["participation", "registration", "assignment", "bootcamp", "semifinal", "final"]);
    expect(stages.filter(stage => stage.previewOnly)).toHaveLength(3);
    expect(stages.slice(0, 3).every(stage => !stage.future)).toBe(true);
  });

  it("seeds an independent draft without marking either delivery as complete", () => {
    const call = loadCatalog().calls.find(call => call.id === callId)!;
    const antecedent = { ...emptyAntecedent("project-1", "essence.problem"), value: "Mi idea inicial", confirmationStatus: "confirmed" as const };
    const stages = buildPreparationJourney({ call, antecedents: [antecedent], progress: [] })!;
    expect(stages[1].tasks.find(task => task.id === key("intro-problem"))).toMatchObject({ complete: false, draft: "Mi idea inicial" });
    expect(stages[2].completed).toBe(0);
  });

  it.each([[679, false], [680, true]])("checks the Encargo minimum at %i characters, independently of manual status", (length, complete) => {
    const call = loadCatalog().calls.find(call => call.id === callId)!;
    const progress = [{ itemKey: key("assignment-problem"), status: "user_completed_unvalidated" as const, note: "a".repeat(length), reason: null, updatedAt: "2026-09-07" }];
    const stages = buildPreparationJourney({ call, antecedents: [], progress })!;
    expect(stages[2].tasks.find(task => task.id === key("assignment-problem"))?.complete).toBe(complete);
    const item = buildChecklist({ calls: [call], progress }).flatMap(group => group.items).find(item => item.key === key("assignment-problem"));
    expect(item?.status).toBe(complete ? "user_completed_unvalidated" : "in_progress");
  });

  it("does not count an incomplete team or unconfirmed receipt as ready", () => {
    const call = loadCatalog().calls.find(call => call.id === callId)!;
    const progress = ["team", "receipt"].map(id => ({ itemKey: key(id), status: "user_completed_unvalidated" as const, note: "pending", reason: null, updatedAt: "2026-09-07" }));
    const stages = buildPreparationJourney({ call, antecedents: [], progress })!;
    expect(stages[0].completed).toBe(0);
    expect(stages[1].completed).toBe(0);
  });
});

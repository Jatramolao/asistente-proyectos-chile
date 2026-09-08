import { describe, expect, it } from "vitest";
import catalog from "@/catalog/current.json";
import { emptyAntecedent } from "./beginner-guide";
import { buildPreparationJourney } from "./preparation-journey";
import type { FundingCall, ProjectAntecedent } from "./types";

const call = catalog.calls[0] as FundingCall;
const answer = (overrides: Partial<ProjectAntecedent> = {}): ProjectAntecedent => ({
  ...emptyAntecedent("project-1", "essence.problem"),
  value: "Desperdicio textil", confirmationStatus: "confirmed", ...overrides,
});
const journey = (antecedents: ProjectAntecedent[] = []) => buildPreparationJourney({ call, antecedents, progress: [] })!;

describe("preparation journey", () => {
  it("maps every pilot requirement into six preparation stages without duplicating task IDs", () => {
    const stages = journey();
    expect(stages.map(stage => stage.id)).toEqual(["fit", "proposal", "budget", "documents", "submission", "followup"]);
    const tasks = stages.flatMap(stage => stage.tasks);
    expect(new Set(tasks.map(task => task.id)).size).toBe(tasks.length);
    expect(new Set(tasks.flatMap(task => task.requirementIds))).toEqual(new Set(call.requirements.map(requirement => requirement.id)));
    expect(stages[1].tasks).toHaveLength(3);
  });

  it("reuses confirmed answers but does not complete the official application package", () => {
    const stages = journey([answer()]);
    expect(stages[1].completed).toBe(1);
    expect(stages[1].tasks[0]).toMatchObject({ complete: true, reused: true });
    expect(stages[4].completed).toBe(0);
  });

  it.each(["inferred", "stale", "missing"] as const)("does not complete %s answers", confirmationStatus => {
    expect(journey([answer({ confirmationStatus })])[1].completed).toBe(0);
  });

  it("accepts false and zero but not blank confirmed values", () => {
    const stages = journey([
      answer({ key: "applicant.sii_first_category", value: false }),
      answer({ key: "execution.budget", value: 0 }),
      answer({ value: " " }),
    ]);
    expect(stages[0].completed).toBe(1);
    expect(stages[2].completed).toBe(1);
    expect(stages[1].completed).toBe(0);
  });

  it("retains document notes and justified exceptions without treating future tasks as prepared", () => {
    const stages = buildPreparationJourney({ call, antecedents: [], progress: [{
      itemKey: `requirement:${call.id}:modo-cotizaciones`, status: "not_applicable",
      note: "Consultar con la institución", reason: "Excepción declarada", updatedAt: "2026-09-04",
    }] })!;
    expect(stages[3].tasks[0]).toMatchObject({ complete: true, item: { note: "Consultar con la institución", reason: "Excepción declarada" } });
    expect(stages[5]).toMatchObject({ completed: 0, future: true });
  });

  it("does not invent generic stages for unsupported services", () => {
    expect(buildPreparationJourney({ call: catalog.calls[1] as FundingCall, antecedents: [], progress: [] })).toBeNull();
  });
});

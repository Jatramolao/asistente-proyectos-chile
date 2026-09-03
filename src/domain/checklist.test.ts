import { describe, expect, it } from "vitest";
import catalog from "@/catalog/pilot.json";
import type { FundingCall } from "./types";
import { buildChecklist, buildChecklistByCall } from "./checklist";

describe("buildChecklist", () => {
  it("keeps FOSIS verification and validity in its own call", () => {
    const byCall = buildChecklistByCall({ calls: catalog.calls as FundingCall[], progress: [] });
    const age = byCall[2].groups.flatMap((group) => group.items)
      .find((item) => item.key === "antecedent:applicant.age");
    expect(age?.verifier).toBe("FOSIS");
    expect(age?.validity).toBe("A la fecha de postulación");
  });

  it("preserves different stages and responsibilities without duplicating shared progress", () => {
    const first = structuredClone(catalog.calls[0]) as FundingCall;
    const second = structuredClone(catalog.calls[2]) as FundingCall;
    first.requirements = [first.requirements[0]];
    second.requirements = [{ ...second.requirements[0], stage: "selection", responsibleParty: "institution" }];
    const input = { calls: [first, second], progress: [{
      itemKey: "antecedent:applicant.age", status: "in_progress" as const,
      note: "Revisar mi edad", reason: null, updatedAt: "2026-09-02T12:00:00Z",
    }] };
    const byCall = buildChecklistByCall(input);
    expect(byCall[1].groups[0].stage).toBe("selection");
    expect(byCall[1].groups[0].items[0]).toMatchObject({
      verifier: "FOSIS", responsibleParty: "institution", status: "in_progress", note: "Revisar mi edad",
    });
    const shared = buildChecklist(input).flatMap((group) => group.items);
    expect(shared).toHaveLength(1);
    expect(shared[0].contexts).toEqual(expect.arrayContaining([
      expect.objectContaining({ callId: first.id, verifier: "Sercotec", stage: "application" }),
      expect.objectContaining({ callId: second.id, verifier: "FOSIS", stage: "selection" }),
    ]));
  });

  it("reuses canonical antecedents and preserves call-specific formats", () => {
    const groups = buildChecklist({ calls: catalog.calls as FundingCall[], progress: [] });
    const items = groups.flatMap((group) => group.items);

    expect(items.filter((item) => item.key === "antecedent:applicant.age")).toHaveLength(1);
    expect(items.find((item) => item.key === "antecedent:applicant.age")?.callIds).toHaveLength(2);
    expect(items.filter((item) => item.key.includes("application-package"))).toHaveLength(1);
    expect(items.filter((item) => item.key.includes("portal-form"))).toHaveLength(1);
  });

  it("never promotes user completion to institutional validation", () => {
    const groups = buildChecklist({
      calls: catalog.calls as FundingCall[],
      progress: [{
        itemKey: "antecedent:applicant.age",
        status: "user_completed_unvalidated",
        note: null,
        reason: null,
        updatedAt: "2026-08-28T12:00:00Z",
      }],
    });
    const item = groups.flatMap((group) => group.items).find((candidate) => candidate.key === "antecedent:applicant.age");

    expect(item?.status).toBe("user_completed_unvalidated");
    expect(item?.statusLabel).toBe("Completado por el usuario, no validado");
  });

  it("groups by call while keeping shared items on the same stable key", () => {
    const progress = [{
      itemKey: "antecedent:applicant.age",
      status: "in_progress" as const,
      note: "Confirmar antes de postular",
      reason: null,
      updatedAt: "2026-09-01T12:00:00Z",
    }];

    const byCall = buildChecklistByCall({ calls: catalog.calls as FundingCall[], progress });
    const sercotecAge = byCall[0].groups.flatMap((group) => group.items)
      .find((item) => item.key === "antecedent:applicant.age");
    const fosisAge = byCall[2].groups.flatMap((group) => group.items)
      .find((item) => item.key === "antecedent:applicant.age");

    expect(byCall.map((group) => group.callId)).toEqual([
      "sercotec-capital-semilla-rm-2026",
      "corfo-semilla-inicia-mujeres-2026",
      "fosis-emprendamos-semilla-2026",
    ]);
    expect(sercotecAge).toMatchObject({ key: "antecedent:applicant.age", status: "in_progress" });
    expect(fosisAge).toMatchObject({ key: "antecedent:applicant.age", status: "in_progress" });
  });
});

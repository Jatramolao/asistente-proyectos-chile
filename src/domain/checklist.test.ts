import { describe, expect, it } from "vitest";
import catalog from "@/catalog/pilot.json";
import type { FundingCall } from "./types";
import { buildChecklist } from "./checklist";

describe("buildChecklist", () => {
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
});

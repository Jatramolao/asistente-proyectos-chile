import { describe, expect, it } from "vitest";
import allIn from "@/catalog/allin.json";
import type { OfficialSource, Requirement } from "./types";
import {
  buildRequirementGuidanceMap,
  resolveGuidanceEntry,
  resolveRequirementGuidance,
  type RequirementGuidanceEntry,
} from "./requirement-guidance";

const call = allIn.call;
const sources = allIn.sources as OfficialSource[];
const requirement = call.requirements.find(item => item.id === "intro-problem") as Requirement;

describe("requirement guidance resolver", () => {
  it("resolves reviewed guidance with the complete requirement and official source", () => {
    const result = resolveRequirementGuidance({
      callId: call.id,
      editorialVersion: call.editorial.version,
      requirement,
      sources,
    });

    expect(result?.instruction).toBe("Describe qué problema u oportunidad observaste, a quién afecta y en qué situación ocurre.");
    expect(result?.evidence).toEqual({
      description: requirement.description,
      verifier: requirement.verifier,
      validity: requirement.validity,
      sources: [{
        id: "duoc-allin-2026-bases",
        title: "Bases All In Chile 2026 · versión 2",
        officialUrl: "https://www.duoc.cl/wp-content/uploads/2026/08/bases-allin-2026-v2.pdf",
      }],
      hasUnavailableSources: false,
    });
  });

  it.each(["otra-version", undefined])("rejects an unreviewed editorial version: %s", editorialVersion => {
    expect(resolveRequirementGuidance({ callId: call.id, editorialVersion, requirement, sources })).toBeNull();
  });

  it("does not resolve entries outside the three-requirement pilot", () => {
    const outsidePilot = call.requirements.find(item => item.id === "intro-solution") as Requirement;
    expect(resolveRequirementGuidance({
      callId: call.id,
      editorialVersion: call.editorial.version,
      requirement: outsidePilot,
      sources,
    })).toBeNull();
  });

  it("rejects invalid editorial content", () => {
    const invalidEntry = {
      editorialVersion: call.editorial.version,
      instruction: "",
      blocks: [],
    } as unknown as RequirementGuidanceEntry;

    expect(resolveGuidanceEntry({ entry: invalidEntry, requirement, sources })).toBeNull();
  });

  it("omits unresolved source links and marks the evidence as unavailable", () => {
    const result = resolveRequirementGuidance({
      callId: call.id,
      editorialVersion: call.editorial.version,
      requirement,
      sources: [],
    });

    expect(result?.evidence.sources).toEqual([]);
    expect(result?.evidence.hasUnavailableSources).toBe(true);
  });

  it("deduplicates official sources by URL", () => {
    const duplicate = { ...sources[1], id: "same-url" };
    const requirementWithDuplicate = { ...requirement, sourceIds: [sources[1].id, duplicate.id] };
    const result = resolveRequirementGuidance({
      callId: call.id,
      editorialVersion: call.editorial.version,
      requirement: requirementWithDuplicate,
      sources: [...sources, duplicate],
    });

    expect(result?.evidence.sources).toHaveLength(1);
    expect(result?.evidence.hasUnavailableSources).toBe(false);
  });

  it("builds a serializable map containing only reviewed pilot requirements", () => {
    const map = buildRequirementGuidanceMap({
      callId: call.id,
      editorialVersion: call.editorial.version,
      requirements: call.requirements as Requirement[],
      sources,
    });

    expect(Object.keys(map)).toEqual(["profile", "intro-problem", "receipt"]);
    expect(JSON.parse(JSON.stringify(map))).toEqual(map);
  });
});

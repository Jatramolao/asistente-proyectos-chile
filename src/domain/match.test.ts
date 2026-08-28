import { describe, expect, it } from "vitest";
import type { FundingCall, ProjectAntecedent, Rule } from "./types";
import { evaluateRule, matchCall } from "./match";

const NOW = new Date("2026-06-01T12:00:00-04:00");

function rule(overrides: Partial<Rule> = {}): Rule {
  return {
    id: "adult",
    antecedentKey: "applicant.age",
    operator: "gte",
    expectedValue: 18,
    decisive: true,
    preparable: false,
    passReason: "Cumples la edad mínima declarada.",
    contradictionReason: "La edad declarada no cumple el mínimo.",
    unknownReason: "Falta confirmar la edad.",
    sourceIds: ["source-1"],
    ...overrides,
  };
}

function call(overrides: Partial<FundingCall> = {}): FundingCall {
  return {
    id: "call-1",
    instrumentId: "instrument-1",
    name: "Fondo de prueba",
    institutionId: "sercotec",
    territory: "Chile",
    timezone: "America/Santiago",
    opensAt: "2026-05-01T09:00:00-04:00",
    closesAt: "2026-06-30T15:00:00-04:00",
    schedulePrecision: "datetime",
    status: "open",
    isReference: false,
    supportType: "cofinanced_subsidy",
    benefit: {
      summary: "Aporte de prueba",
      maximumAmountClp: 1_000_000,
      coveragePercent: 80,
      beneficiaryContributionPercent: 20,
      taxTreatment: null,
      allowedCosts: [],
      excludedCosts: [],
    },
    requirements: [],
    rules: [rule()],
    sourceIds: ["source-1"],
    ...overrides,
  };
}

function antecedent(value: number, confirmationStatus: ProjectAntecedent["confirmationStatus"] = "confirmed"):
  ProjectAntecedent {
  return {
    id: "antecedent-1",
    projectId: "project-1",
    key: "applicant.age",
    value,
    confirmationStatus,
    origin: confirmationStatus === "inferred" ? "narrative" : "answer",
    sourceExcerpt: null,
    updatedAt: NOW.toISOString(),
  };
}

describe("matchCall", () => {
  it.each([
    ["closed call", call({ status: "closed" }), [antecedent(30)], "call_not_current"],
    ["confirmed contradiction", call(), [antecedent(16)], "not_compatible_now"],
    ["decisive unknown", call(), [], "insufficient_information"],
    [
      "preparable gap",
      call({ rules: [rule({ decisive: false, preparable: true, antecedentKey: "applicant.clave_unica" })] }),
      [],
      "requires_preparation",
    ],
    ["no blockers", call(), [antecedent(30)], "compatible_to_review"],
  ] as const)("classifies %s", (_label, fundingCall, antecedents, expected) => {
    expect(matchCall(fundingCall, antecedents, NOW, "catalog-test").status).toBe(expected);
  });

  it("does not turn an inferred value into a contradiction", () => {
    expect(evaluateRule(rule(), [antecedent(16, "inferred")]).outcome).toBe("unknown");
  });
});

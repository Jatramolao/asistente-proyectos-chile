import { describe, expect, it } from "vitest";
import { parseAntecedentValue, hasConfirmedValue } from "./antecedent-input";

describe("antecedent answers", () => {
  it("keeps blank numeric answers unknown instead of inventing zero", () => {
    expect(parseAntecedentValue("applicant.age", "  ")).toBeNull();
    expect(parseAntecedentValue("execution.budget", "")).toBeNull();
    expect(parseAntecedentValue("execution.budget", "1.500.000")).toBe(1500000);
  });
  it("distinguishes no, zero and unknown", () => {
    expect(parseAntecedentValue("applicant.has_sales", "false")).toBe(false);
    expect(parseAntecedentValue("applicant.has_sales", "no sé")).toBeNull();
    expect(hasConfirmedValue({ value: false, confirmationStatus: "confirmed" })).toBe(true);
    expect(hasConfirmedValue({ value: 0, confirmationStatus: "confirmed" })).toBe(true);
    expect(hasConfirmedValue({ value: " ", confirmationStatus: "confirmed" })).toBe(false);
    expect(hasConfirmedValue({ value: "Una idea", confirmationStatus: "inferred" })).toBe(false);
  });
});

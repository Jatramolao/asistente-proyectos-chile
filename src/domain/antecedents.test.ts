import { describe, expect, it } from "vitest";
import { ANTECEDENT_DEFINITIONS, getAntecedentDefinition } from "./antecedents";

describe("antecedent definitions", () => {
  it("covers every approved section", () => {
    expect(new Set(ANTECEDENT_DEFINITIONS.map((item) => item.section))).toEqual(
      new Set(["essence", "market", "technology", "execution", "impact", "applicant"]),
    );
  });

  it("keeps canonical keys unique", () => {
    const keys = ANTECEDENT_DEFINITIONS.map((item) => item.key);

    expect(new Set(keys).size).toBe(keys.length);
  });

  it("marks applicant region as decisive", () => {
    expect(getAntecedentDefinition("applicant.region")).toMatchObject({
      section: "applicant",
      valueType: "region",
      decisive: true,
    });
  });

  it("includes the applicant facts required by the pilot calls", () => {
    expect(getAntecedentDefinition("applicant.gender").decisive).toBe(true);
    expect(getAntecedentDefinition("applicant.sii_activity_age_months").valueType).toBe("number");
    expect(getAntecedentDefinition("applicant.commune").valueType).toBe("short_text");
    expect(getAntecedentDefinition("applicant.valid_id").valueType).toBe("boolean");
    expect(getAntecedentDefinition("applicant.clave_unica").valueType).toBe("boolean");
  });
});

import { describe, expect, it } from "vitest";
import { extractIdea } from "./extract-idea";

describe("extractIdea", () => {
  it("proposes an explicit technology as unconfirmed", () => {
    const result = extractIdea("Una plataforma usa sensores para detectar fugas de agua en edificios.");

    expect(result).toContainEqual(
      expect.objectContaining({
        key: "technology.component",
        confirmationStatus: "inferred",
        sourceExcerpt: expect.stringContaining("sensores"),
      }),
    );
  });

  it("does not invent applicant facts", () => {
    const result = extractIdea("Quiero crear software para agricultores.");

    expect(result.some((item) => item.key.startsWith("applicant."))).toBe(false);
  });
});

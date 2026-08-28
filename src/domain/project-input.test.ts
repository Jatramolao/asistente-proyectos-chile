import { describe, expect, it } from "vitest";
import { parseProjectNarrative } from "./project-input";

describe("parseProjectNarrative", () => {
  it("rejects a description that is too short to guide", () => {
    expect(() => parseProjectNarrative("Una app de salud.")).toThrow(/al menos 40 caracteres/i);
  });

  it("derives a short project name without changing the narrative", () => {
    const narrative = "Una plataforma con sensores detecta fugas de agua en edificios y ayuda a reducir pérdidas.";

    expect(parseProjectNarrative(narrative)).toEqual({
      narrative,
      name: "Una plataforma con sensores detecta fugas de agua en edificios y ayuda a reducir",
    });
  });
});

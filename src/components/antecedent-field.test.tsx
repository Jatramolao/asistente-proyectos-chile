import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getAntecedentDefinition } from "@/domain/antecedents";
import { AntecedentField } from "./antecedent-field";

describe("AntecedentField", () => {
  it("makes an inferred antecedent visibly unconfirmed", () => {
    render(
      <AntecedentField
        action={() => undefined}
        antecedent={{
          id: "antecedent-1",
          projectId: "project-1",
          key: "essence.problem",
          value: "Pérdidas de agua en edificios",
          confirmationStatus: "inferred",
          origin: "narrative",
          sourceExcerpt: "detectar fugas de agua en edificios",
          updatedAt: "2026-08-28T12:00:00Z",
        }}
        definition={getAntecedentDefinition("essence.problem")}
      />,
    );

    expect(screen.getByText("Inferido, pendiente de confirmación")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar corrección" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Dejar pendiente" })).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import catalog from "@/catalog/pilot.json";
import { buildChecklist, buildChecklistByCall } from "@/domain/checklist";
import type { FundingCall } from "@/domain/types";
import { ChecklistView } from "./checklist-view";

const calls = catalog.calls as FundingCall[];
const transversal = buildChecklist({ calls, progress: [] });
const byCall = buildChecklistByCall({ calls, progress: [] });

describe("ChecklistView", () => {
  it("shows each call as the default view while preserving shared checklist keys", () => {
    render(
      <ChecklistView
        action={vi.fn()}
        activeView="calls"
        byCall={byCall}
        calls={calls}
        projectId="project-1"
        transversal={transversal}
      />,
    );

    expect(screen.getByRole("heading", { name: /Capital Semilla Emprende Región Metropolitana/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Semilla Inicia para empresas lideradas por mujeres/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: /^Edad$/ })).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Vista transversal" })).toHaveAttribute("href", "?checklist=transversal#checklist");
  });

  it("shows each shared antecedent once in the transversal view", () => {
    render(
      <ChecklistView
        action={vi.fn()}
        activeView="transversal"
        byCall={byCall}
        calls={calls}
        projectId="project-1"
        transversal={transversal}
      />,
    );

    expect(screen.getAllByRole("heading", { name: /^Edad$/ })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Por convocatoria" })).toHaveAttribute("href", "?checklist=convocatorias#checklist");
  });
});

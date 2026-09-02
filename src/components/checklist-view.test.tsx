import { fireEvent, render, screen } from "@testing-library/react";
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

  it("refreshes every rendered copy when a shared status changes", () => {
    const { rerender } = render(
      <ChecklistView
        action={vi.fn()}
        activeView="calls"
        byCall={byCall}
        calls={calls}
        projectId="project-1"
        transversal={transversal}
      />,
    );
    const ageSelects = screen.getAllByRole("combobox", { name: /Edad$/ });

    fireEvent.change(ageSelects[0], { target: { value: "in_progress" } });
    expect(ageSelects[1]).toHaveValue("pending");

    const progress = [{
      itemKey: "antecedent:applicant.age",
      status: "in_progress" as const,
      note: null,
      reason: null,
      updatedAt: "2026-09-01T12:00:00Z",
    }];
    rerender(
      <ChecklistView
        action={vi.fn()}
        activeView="calls"
        byCall={buildChecklistByCall({ calls, progress })}
        calls={calls}
        projectId="project-1"
        transversal={buildChecklist({ calls, progress })}
      />,
    );

    for (const select of screen.getAllByRole("combobox", { name: /Edad$/ })) {
      expect(select).toHaveValue("in_progress");
    }
  });
});

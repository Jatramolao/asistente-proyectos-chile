import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProjectAntecedent } from "@/domain/types";
import { ProjectGuide } from "./project-guide";
import { getBeginnerProgress } from "@/domain/beginner-guide";

describe("beginner project guide", () => {
  it("starts with three concrete steps and reveals the rest gradually", () => {
    render(<ProjectGuide action={() => undefined} projectId="project-1" antecedents={[]} />);
    const steps = screen.getByRole("list", { name: "Siguientes pasos" });
    expect(within(steps).getAllByRole("listitem")).toHaveLength(3);
    expect(within(steps).getByRole("link", { name: /Problema/ })).toHaveAttribute("href", "#antecedent-essence.problem");
    expect(screen.getByRole("textbox", { name: /Solución propuesta/ })).toBeVisible();
    expect(screen.getByRole("combobox", { name: /Madurez/ })).not.toBeVisible();
    expect(screen.queryByText(/de 46/)).not.toBeInTheDocument();
  });

  it("counts a confirmed no as progress while leaving blank and inferred facts pending", () => {
    const base = { projectId: "project-1", origin: "answer" as const, sourceExcerpt: null, updatedAt: "2026-09-02" };
    const antecedents: ProjectAntecedent[] = [
      { ...base, id: "sales", key: "applicant.has_sales", value: false, confirmationStatus: "confirmed" },
      { ...base, id: "problem", key: "essence.problem", value: "", confirmationStatus: "confirmed" },
      { ...base, id: "solution", key: "essence.solution", value: "Una app", confirmationStatus: "inferred" },
    ];
    expect(getBeginnerProgress(antecedents)).toMatchObject({ completed: 1, total: 9 });
    expect(getBeginnerProgress(antecedents).nextKeys).not.toContain("applicant.has_sales");
  });
});

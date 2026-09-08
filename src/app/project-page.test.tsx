import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PILOT_JOURNEY_CALL_ID } from "@/domain/preparation-journey";
import ProjectPage from "@/app/(app)/proyectos/[projectId]/page";

const repository = vi.hoisted(() => ({
  getById: vi.fn(() => ({ id: "project-1", name: "Mi taller", narrative: "Un taller para reutilizar textiles." })),
  listAntecedents: vi.fn(() => []), listSelectedCalls: vi.fn<() => string[]>(() => []), getChecklistProgress: vi.fn(() => []),
}));
vi.mock("@/server/session", () => ({ requireSession: async () => ({ userId: "user-1" }) }));
vi.mock("@/server/db/client", () => ({ getDb: () => ({}) }));
vi.mock("@/server/db/repositories", () => ({ projectRepository: () => repository }));
vi.mock("@/app/actions/projects", () => ({ confirmAntecedentAction: vi.fn(), removeCallAction: vi.fn() }));
vi.mock("@/app/actions/checklist", () => ({ updateChecklistItemAction: vi.fn() }));

beforeEach(() => { repository.listSelectedCalls.mockReturnValue([]); localStorage.clear(); });

describe("project preparation routing", () => {
  it("does not create preparation tasks from the whole catalog before selection", async () => {
    render(await ProjectPage({ params: Promise.resolve({ projectId: "project-1" }), searchParams: Promise.resolve({}) }));
    expect(document.querySelectorAll("#checklist article")).toHaveLength(0);
    expect(screen.getByText("Elige un apoyo para comenzar tu preparación.")).toBeInTheDocument();
  });

  it("opens the selected pilot as a clean journey, not a long record", async () => {
    repository.listSelectedCalls.mockReturnValue([PILOT_JOURNEY_CALL_ID]);
    render(await ProjectPage({ params: Promise.resolve({ projectId: "project-1" }), searchParams: Promise.resolve({}) }));
    expect(screen.getByRole("navigation", { name: "Etapas de preparación" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Checklist de preparación" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Construyamos tu ficha paso a paso" })).not.toBeInTheDocument();
  });

  it("keeps the record available and ignores an unselected call parameter", async () => {
    repository.listSelectedCalls.mockReturnValue(["sercotec-capacitacion"]);
    render(await ProjectPage({ params: Promise.resolve({ projectId: "project-1" }), searchParams: Promise.resolve({ call: PILOT_JOURNEY_CALL_ID }) }));
    expect(screen.queryByRole("navigation", { name: "Etapas de preparación" })).not.toBeInTheDocument();
    expect(document.querySelectorAll("#checklist article")).toHaveLength(1);
  });

  it("allows inspecting the complete pilot record explicitly", async () => {
    repository.listSelectedCalls.mockReturnValue([PILOT_JOURNEY_CALL_ID]);
    render(await ProjectPage({ params: Promise.resolve({ projectId: "project-1" }), searchParams: Promise.resolve({ view: "record" }) }));
    expect(screen.getByRole("heading", { name: "Checklist de preparación" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver a mi recorrido" })).toBeInTheDocument();
  });
});

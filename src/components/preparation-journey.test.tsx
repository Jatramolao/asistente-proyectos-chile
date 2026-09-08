import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import catalog from "@/catalog/current.json";
import { buildPreparationJourney } from "@/domain/preparation-journey";
import type { FundingCall } from "@/domain/types";
import { PreparationJourney } from "./preparation-journey";

const call = catalog.calls[0] as FundingCall;
const stages = buildPreparationJourney({ call, antecedents: [], progress: [] })!;
const props = {
  projectId: "project-1", projectName: "Taller textil circular", call, stages,
  availabilityLabel: "Consultar disponibilidad", warnings: [],
  antecedentAction: vi.fn(async () => {}), checklistAction: vi.fn(async () => {}),
};

beforeEach(() => { localStorage.clear(); vi.clearAllMocks(); });

describe("PreparationJourney", () => {
  it("shows six stage controls but only the active stage tasks", () => {
    render(<PreparationJourney {...props} />);
    expect(screen.getByRole("navigation", { name: "Etapas de preparación" }).querySelectorAll("button")).toHaveLength(6);
    expect(screen.getByRole("heading", { name: "Conoce las condiciones para comenzar" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Describe tu solución" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Desarrolla tu propuesta/ }));
    expect(screen.getByRole("heading", { name: "Dale forma a tu propuesta" })).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Desarrolla tu propuesta/ })).toHaveAttribute("aria-current", "step");
  });

  it("resumes the selected stage only for this project and call", () => {
    const view = render(<PreparationJourney {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Reúne los respaldos/ }));
    view.unmount();
    const resumed = render(<PreparationJourney {...props} />);
    expect(screen.getByRole("heading", { name: "Prepara los documentos que te piden" })).toBeInTheDocument();
    resumed.unmount();
    render(<PreparationJourney {...props} projectId="project-2" />);
    expect(screen.getByRole("heading", { name: "Conoce las condiciones para comenzar" })).toBeInTheDocument();
  });

  it("preserves the editor and reports a failed save without advancing", async () => {
    render(<PreparationJourney {...props} antecedentAction={vi.fn(async () => { throw new Error("offline"); })} />);
    fireEvent.click(screen.getByRole("button", { name: /Desarrolla tu propuesta/ }));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Telas que se desechan" } });
    fireEvent.submit(input.closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No pudimos guardar"));
    expect(input).toHaveValue("Telas que se desechan");
  });

  it("requires a reason for a document exception", async () => {
    render(<PreparationJourney {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Reúne los respaldos/ }));
    const status = screen.getByRole("combobox", { name: "Estado de preparación" });
    fireEvent.change(status, { target: { value: "not_applicable" } });
    fireEvent.submit(status.closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("motivo"));
    expect(props.checklistAction).not.toHaveBeenCalled();
  });

  it("keeps navigation usable when browser storage is unavailable", () => {
    const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
    render(<PreparationJourney {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Organiza tu presupuesto/ }));
    expect(screen.getByRole("heading", { name: "Planifica cuánto necesitas" })).toBeInTheDocument();
    storage.mockRestore();
  });

  it("links to the full record without losing the focused call", () => {
    render(<PreparationJourney {...props} />);
    expect(screen.getByRole("link", { name: "Ver todos los requisitos" })).toHaveAttribute("href", `?view=record&call=${call.id}#checklist`);
  });

  it("warns before reloading after an unsaved edit", () => {
    render(<PreparationJourney {...props} />);
    fireEvent.click(screen.getByRole("button", { name: /Desarrolla tu propuesta/ }));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "Cambio sin guardar" } });
    const event = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});

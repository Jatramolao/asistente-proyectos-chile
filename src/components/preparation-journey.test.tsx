import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import catalog from "@/catalog/current.json";
import allIn from "@/catalog/allin.json";
import { buildPreparationJourney } from "@/domain/preparation-journey";
import { buildRequirementGuidanceMap } from "@/domain/requirement-guidance";
import type { FundingCall, OfficialSource, Requirement } from "@/domain/types";
import { PreparationJourney } from "./preparation-journey";

const call = catalog.calls[0] as FundingCall;
const stages = buildPreparationJourney({ call, antecedents: [], progress: [] })!;
const props = {
  projectId: "project-1", projectName: "Taller textil circular", call, stages,
  availabilityLabel: "Consultar disponibilidad", warnings: [],
  antecedentAction: vi.fn(async () => {}), checklistAction: vi.fn(async () => {}),
};

const allInCall = allIn.call as FundingCall;
const allInStages = buildPreparationJourney({ call: allInCall, antecedents: [], progress: [] })!;
const guidanceByRequirementId = buildRequirementGuidanceMap({
  callId: allIn.call.id,
  editorialVersion: allIn.call.editorial.version,
  requirements: allIn.call.requirements as Requirement[],
  sources: allIn.sources as OfficialSource[],
});
const allInProps = {
  ...props,
  call: allInCall,
  stages: allInStages,
  responseAction: vi.fn(async () => {}),
  initialStage: "registration",
  guidanceByRequirementId,
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

  it("keeps an unsaved All In draft while contextual guidance opens and closes", async () => {
    render(<PreparationJourney {...allInProps} />);
    const editor = screen.getByRole("textbox", { name: "Tu respuesta" });
    fireEvent.change(editor, { target: { value: "Borrador sin guardar" } });

    fireEvent.click(screen.getByRole("button", { name: "Ver orientación: Explica el problema inicial" }));
    expect(screen.getByRole("dialog", { name: "Explica el problema inicial" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(editor).toHaveValue("Borrador sin guardar");
    expect(allInProps.responseAction).not.toHaveBeenCalled();
  });

  it("shows guidance only for the three reviewed All In requirements", () => {
    render(<PreparationJourney {...allInProps} initialStage="participation" />);
    expect(screen.getByText(/Indica si serás titular como estudiante regular/)).toBeVisible();
    expect(screen.getByRole("button", { name: "Ver orientación: Confirma quién representará al equipo" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Idea e inscripción/ }));
    expect(screen.getByRole("button", { name: "Ver orientación: Explica el problema inicial" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Cuenta tu idea de solución/ }));
    expect(screen.getByText("Explica qué quieren crear y cómo ayudaría a resolver el problema. Una herramienta digital es un medio, no el problema que buscas resolver.")).toBeVisible();
    expect(screen.queryByRole("button", { name: /Ver orientación/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Registra la recepción de tu inscripción/ }));
    expect(screen.getByText("La inscripción se realiza en el sitio oficial; guardar aquí no la envía.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Ver orientación: Registra la recepción de tu inscripción" })).toBeVisible();
  });

  it("keeps a save error visible after consulting guidance", async () => {
    const responseAction = vi.fn(async () => { throw new Error("offline"); });
    render(<PreparationJourney {...allInProps} responseAction={responseAction} />);
    const editor = screen.getByRole("textbox", { name: "Tu respuesta" });
    fireEvent.change(editor, { target: { value: "Problema de prueba" } });
    fireEvent.submit(editor.closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("No pudimos guardar"));

    fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));
    fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }));

    await waitFor(() => expect(screen.getByRole("alert")).toBeVisible());
    expect(editor).toHaveValue("Problema de prueba");
  });
});

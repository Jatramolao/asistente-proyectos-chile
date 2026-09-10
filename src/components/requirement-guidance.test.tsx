import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import type { ResolvedRequirementGuidance } from "@/domain/requirement-guidance";
import { RequirementGuidance } from "./requirement-guidance";

const guidance: ResolvedRequirementGuidance = {
  requirementId: "intro-problem",
  title: "Explica el problema inicial",
  instruction: "Describe el problema.",
  essentialConditions: [],
  blocks: [
    { type: "list", title: "Qué incluir", items: ["Quién tiene la dificultad.", "Cuándo ocurre."] },
    { type: "paragraph", title: "Ten presente", text: "No necesitas un proyecto terminado." },
  ],
  evidence: {
    description: "Descripción completa del requisito.",
    verifier: "Duoc UC · bases",
    validity: "Hasta el 27 de septiembre de 2026",
    sources: [{ id: "bases", title: "Bases oficiales", officialUrl: "https://www.duoc.cl/bases.pdf" }],
    hasUnavailableSources: false,
  },
};

function GuidanceHarness({ value = guidance, disabled = false, onOpen = vi.fn() }: {
  value?: ResolvedRequirementGuidance;
  disabled?: boolean;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return <RequirementGuidance
    guidance={value}
    open={open}
    disabled={disabled}
    onOpen={() => { onOpen(); setOpen(true); }}
    onClose={() => setOpen(false)}
  />;
}

describe("RequirementGuidance", () => {
  it("opens explicitly, names the dialog and focuses its title", async () => {
    render(<GuidanceHarness />);
    const trigger = screen.getByRole("button", { name: "Ver orientación: Explica el problema inicial" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Explica el problema inicial" })).toBeVisible();
    await waitFor(() => expect(screen.getByRole("heading", { name: "Explica el problema inicial" })).toHaveFocus());
  });

  it.each([
    ["header close", () => fireEvent.click(screen.getByRole("button", { name: "Cerrar orientación" }))],
    ["return button", () => fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }))],
    ["Escape", () => fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }))],
    ["backdrop", () => fireEvent.click(screen.getByRole("dialog"))],
  ])("closes with %s and restores focus", async (_name, close) => {
    render(<GuidanceHarness />);
    const trigger = screen.getByRole("button", { name: /Ver orientación/ });
    fireEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeVisible());

    close();

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("renders typed blocks and complete official evidence", () => {
    render(<GuidanceHarness />);
    fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));

    expect(screen.getByRole("list", { name: "Qué incluir" })).toHaveTextContent("Quién tiene la dificultad.");
    fireEvent.click(screen.getByText("Requisito completo y fuentes"));
    expect(screen.getByText("Descripción completa del requisito.")).toBeVisible();
    expect(screen.getByText(/Duoc UC · bases/)).toBeVisible();
    const source = screen.getByRole("link", { name: /Bases oficiales.*abre en una pestaña nueva/i });
    expect(source).toHaveAttribute("href", "https://www.duoc.cl/bases.pdf");
    expect(source).toHaveAttribute("target", "_blank");
  });

  it("reports unavailable evidence without rendering an empty link", () => {
    render(<GuidanceHarness value={{ ...guidance, evidence: { ...guidance.evidence, sources: [], hasUnavailableSources: true } }} />);
    fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));
    fireEvent.click(screen.getByText("Requisito completo y fuentes"));

    expect(screen.getByText("Fuente no disponible en esta ficha")).toBeVisible();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("expands the mobile sheet and resets it and the evidence section when reopened", () => {
    render(<GuidanceHarness />);
    const trigger = screen.getByRole("button", { name: /Ver orientación/ });
    fireEvent.click(trigger);
    const expand = screen.getByRole("button", { name: "Ampliar orientación" });
    fireEvent.click(expand);
    expect(expand).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(screen.getByText("Requisito completo y fuentes"));
    expect(screen.getByText("Requisito completo y fuentes").closest("details")).toHaveAttribute("open");
    fireEvent.click(screen.getByRole("button", { name: "Volver a mi respuesta" }));

    fireEvent.click(trigger);
    expect(screen.getByRole("button", { name: "Ampliar orientación" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText("Requisito completo y fuentes").closest("details")).not.toHaveAttribute("open");
  });

  it("disables the trigger while a save is in progress", () => {
    const onOpen = vi.fn();
    render(<GuidanceHarness disabled onOpen={onOpen} />);
    const trigger = screen.getByRole("button", { name: /Ver orientación/ });

    fireEvent.click(trigger);

    expect(trigger).toBeDisabled();
    expect(onOpen).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("cycles keyboard focus inside the open dialog", async () => {
    render(<GuidanceHarness />);
    fireEvent.click(screen.getByRole("button", { name: /Ver orientación/ }));
    const dialog = screen.getByRole("dialog");
    const first = screen.getByRole("button", { name: "Cerrar orientación" });
    const last = screen.getByRole("button", { name: "Volver a mi respuesta" });
    await waitFor(() => expect(screen.getByRole("heading", { name: guidance.title })).toHaveFocus());

    last.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(last).toHaveFocus();
  });
});

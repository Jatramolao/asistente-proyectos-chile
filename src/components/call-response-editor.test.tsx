import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { loadCatalog } from "@/server/services/catalog";
import { buildPreparationJourney } from "@/domain/preparation-journey";
import { CallResponseEditor } from "./call-response-editor";
import { PreparationJourney } from "./preparation-journey";

const call = loadCatalog().calls.find(call => call.id === "duoc-allin-chile-2026")!;
const stages = buildPreparationJourney({ call, antecedents: [], progress: [] })!;
const task = stages[2].tasks.find(task => task.id.endsWith(":assignment-problem"))!;

describe("All In response editor", () => {
  it("saves below the minimum and preserves the draft after a failure", async () => {
    const action = vi.fn(async () => { throw new Error("offline"); });
    const onSaved = vi.fn();
    render(<CallResponseEditor task={task} projectId="project" action={action} onDirty={vi.fn()} onSaving={vi.fn()} onSaved={onSaved} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a".repeat(679) } });
    expect(screen.getByText(/679 caracteres.*Faltan 1/)).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: "Guardar borrador" }).closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toBeInTheDocument());
    expect(screen.getByRole("textbox")).toHaveValue("a".repeat(679));
    expect(onSaved).not.toHaveBeenCalled();
    expect(action).toHaveBeenCalledOnce();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a".repeat(680) } });
    expect(screen.getByRole("button", { name: "Guardar y continuar" })).toBeInTheDocument();
  });

  it("offers previews without editors or completion controls", () => {
    render(<PreparationJourney projectId="preview" projectName="Idea" call={call} stages={stages} availabilityLabel="Abierta" warnings={[]} antecedentAction={vi.fn()} checklistAction={vi.fn()} responseAction={vi.fn()} initialStage="bootcamp" />);
    expect(screen.getByRole("heading", { name: "Aprende y mejora tu propuesta" })).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Guardar/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});

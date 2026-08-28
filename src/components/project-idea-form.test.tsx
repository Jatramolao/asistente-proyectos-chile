import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProjectIdeaForm } from "./project-idea-form";

describe("ProjectIdeaForm", () => {
  it("guides a free narrative and makes the product limit visible", () => {
    render(<ProjectIdeaForm action={vi.fn()} />);

    const narrative = screen.getByLabelText(/cuéntanos tu idea/i);
    fireEvent.change(narrative, { target: { value: "Una plataforma tecnológica para pequeños comercios." } });

    expect(screen.getByText("51 / 5.000 caracteres")).toBeInTheDocument();
    expect(screen.getByText(/no evaluamos ni validamos documentos/i)).toBeInTheDocument();
    expect(narrative).toHaveAttribute("minLength", "40");
  });
});

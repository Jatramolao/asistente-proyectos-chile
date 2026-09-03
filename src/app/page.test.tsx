import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("declares catalogue coverage and allows exploration before registration", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /ordena tu idea/i })).toBeInTheDocument();
    expect(screen.getByText(/catálogo para empezar: 7 apoyos y referencias/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar apoyos sin cuenta/i })).toHaveAttribute("href", "/catalogo");
    expect(screen.getByText(/no evalúa ni valida documentos/i)).toBeInTheDocument();
  });
});

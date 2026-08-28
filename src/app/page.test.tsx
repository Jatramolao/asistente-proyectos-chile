import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "@/app/page";

describe("HomePage", () => {
  it("declares the pilot coverage and product limit", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { name: /ordena tu idea/i })).toBeInTheDocument();
    expect(screen.getByText(/catálogo piloto: 3 instrumentos/i)).toBeInTheDocument();
    expect(screen.getByText(/no evalúa ni valida documentos/i)).toBeInTheDocument();
  });
});

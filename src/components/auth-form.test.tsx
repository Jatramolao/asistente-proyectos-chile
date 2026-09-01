import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "./auth-form";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("AuthForm", () => {
  it("asks for the required registration fields", () => {
    render(<AuthForm mode="sign-up" />);

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toBeInTheDocument();
    expect(screen.getByLabelText("Correo electrónico")).toHaveAttribute("spellcheck", "false");
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("does not ask for a name when signing in", () => {
    render(<AuthForm mode="sign-in" />);

    expect(screen.queryByLabelText("Nombre")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ingresar" })).toBeInTheDocument();
  });
});

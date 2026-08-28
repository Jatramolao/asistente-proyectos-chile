"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/server/auth-client";

type AuthFormProps = {
  mode: "sign-in" | "sign-up";
};

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const response = isSignUp
      ? await authClient.signUp.email({
          name: String(formData.get("name") ?? "").trim(),
          email,
          password,
          callbackURL: "/proyectos",
        })
      : await authClient.signIn.email({ email, password, callbackURL: "/proyectos" });

    if (response.error) {
      setError(response.error.message ?? "No pudimos completar el acceso. Revisa los datos e inténtalo nuevamente.");
      setPending(false);
      return;
    }

    window.location.assign("/proyectos");
  }

  return (
    <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
      {isSignUp ? (
        <div>
          <label className="mb-2 block text-sm font-semibold text-[var(--navy)]" htmlFor="name">Nombre</label>
          <input className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-[var(--ink)] shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-soft)]" id="name" name="name" autoComplete="name" required />
        </div>
      ) : null}

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--navy)]" htmlFor="email">Correo electrónico</label>
        <input className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-[var(--ink)] shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-soft)]" id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-[var(--navy)]" htmlFor="password">Contraseña</label>
        <input className="w-full rounded-lg border border-[var(--line-strong)] bg-white px-4 py-3 text-[var(--ink)] shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-soft)]" id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={10} maxLength={128} required />
        {isSignUp ? <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">Usa al menos 10 caracteres.</p> : null}
      </div>

      {error ? <p className="rounded-lg border border-[#e7b4ad] bg-[#fff1ef] px-4 py-3 text-sm text-[#8d2f24]" role="alert">{error}</p> : null}

      <button className="w-full rounded-lg bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(20,48,79,0.18)] transition-[background-color,transform] duration-150 hover:bg-[#1c426b] active:scale-[0.98] disabled:cursor-wait disabled:opacity-65" disabled={pending} type="submit">
        {pending ? "Procesando…" : isSignUp ? "Crear cuenta" : "Ingresar"}
      </button>

      <p className="text-center text-sm text-[var(--ink-muted)]">
        {isSignUp ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
        <Link className="font-semibold text-[var(--blue)] underline decoration-[var(--blue-soft)] decoration-2 underline-offset-4" href={isSignUp ? "/ingresar" : "/registro"}>
          {isSignUp ? "Ingresa" : "Regístrate"}
        </Link>
      </p>
    </form>
  );
}

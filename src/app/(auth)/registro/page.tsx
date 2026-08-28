import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Comienza tu recorrido</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[var(--navy)]">Crea tu cuenta</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Tus proyectos y antecedentes quedarán separados de los de otros usuarios.</p>
      <AuthForm mode="sign-up" />
      <p className="mt-6 border-t border-[var(--line)] pt-5 text-xs leading-5 text-[var(--ink-muted)]">No incluyas secretos industriales innecesarios en la descripción de tu idea.</p>
    </>
  );
}

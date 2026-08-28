import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Continúa tu proyecto</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[var(--navy)]">Ingresa a tu cuenta</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Retoma tu ficha, oportunidades y checklist donde los dejaste.</p>
      <AuthForm mode="sign-in" />
    </>
  );
}

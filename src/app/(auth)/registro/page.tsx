import { loadCatalog } from "@/server/services/catalog";
import { AuthForm } from "@/components/auth-form";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ oportunidad?: string | string[] }> }) {
  const query = await searchParams;
  const opportunity = loadCatalog().calls.find(call => call.id === query.oportunidad);
  return (
    <>
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">Comienza tu recorrido</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-[var(--navy)]">Crea tu cuenta</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Tus proyectos y antecedentes quedarán separados de los de otros usuarios.</p>
      {opportunity ? <p className="mt-4 rounded-lg bg-[var(--blue-soft)] p-3 text-sm">Continuarás con: <strong>{opportunity.name}</strong></p> : null}
      <AuthForm opportunityId={opportunity?.id} mode="sign-up" />
      <p className="mt-6 border-t border-[var(--line)] pt-5 text-xs leading-5 text-[var(--ink-muted)]">No incluyas secretos industriales innecesarios en la descripción de tu idea.</p>
    </>
  );
}

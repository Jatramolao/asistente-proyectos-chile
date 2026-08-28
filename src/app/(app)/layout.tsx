import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth";

export default async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/ingresar");

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--line)] bg-[rgba(255,253,248,0.92)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 md:px-10">
          <Link className="flex items-center gap-3 text-sm font-semibold text-[var(--navy)]" href="/proyectos">
            <span className="grid size-9 place-items-center rounded-lg bg-[var(--navy)] text-xs font-bold text-white">IP</span>
            Impulsa Proyectos
          </Link>
          <div className="text-right">
            <p className="text-xs font-semibold text-[var(--navy)]">{session.user.name}</p>
            <p className="text-[0.7rem] text-[var(--ink-muted)]">Información declarada, no validada</p>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}

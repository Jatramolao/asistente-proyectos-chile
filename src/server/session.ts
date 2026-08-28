export type SessionLike = { user: { id: string } } | null;

export class AuthenticationError extends Error {
  readonly code = "UNAUTHENTICATED";

  constructor() {
    super("Debes ingresar para continuar.");
    this.name = "AuthenticationError";
  }
}

export async function requireUserId(session: SessionLike): Promise<string> {
  if (!session?.user.id) throw new AuthenticationError();
  return session.user.id;
}

export async function requireSession(): Promise<{ userId: string }> {
  const [{ headers }, { auth }] = await Promise.all([import("next/headers"), import("./auth")]);
  const session = await auth.api.getSession({ headers: await headers() });
  return { userId: await requireUserId(session) };
}

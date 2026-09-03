import Link from "next/link";
import { CatalogCard } from "@/components/catalog-card";
import { REGIONS, STAGES, GOALS, filterCatalog, formatCatalogDate, getAvailability } from "@/domain/catalog";
import { loadCatalog } from "@/server/services/catalog";

export const dynamic = "force-dynamic";
export const metadata = { title: "Explorar apoyos | Impulsa Proyectos" };

type Query = Record<string, string | string[] | undefined>;
const scalar = (value: Query[string]) => typeof value === "string" ? value : "";
const inputClass = "mt-2 w-full rounded-lg border border-[var(--line-strong)] bg-white px-3 py-3 text-sm text-[var(--ink)]";

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const valid = (value: Query[string], options: object) => { const text = scalar(value); return Object.hasOwn(options, text) ? text : ""; };
  const availability = scalar(query.availability);
  const filters = { region: valid(query.region, REGIONS), stage: valid(query.stage, STAGES), goal: valid(query.goal, GOALS), availability: ["available", "all", "closed"].includes(availability) ? availability : "available" };
  const catalog = loadCatalog();
  const now = new Date();
  const results = filterCatalog(catalog.calls, filters, now);
  const counts = catalog.calls.reduce((acc, call) => {
    const state = getAvailability(call, now);
    if (state === "open") acc.open++;
    if (state === "ongoing") acc.ongoing++;
    return acc;
  }, { open: 0, ongoing: 0 });
  return <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-16" id="contenido">
    <div className="max-w-3xl">
      <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--green)]">Para dar tus primeros pasos · sin crear una cuenta</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-[var(--navy)] md:text-6xl">Encuentra apoyo para empezar.</h1>
      <p className="mt-5 text-lg leading-8 text-[var(--ink-muted)]">Explora financiamiento, cursos y asesoría. Entiende qué ofrece cada apoyo y qué necesitas preparar, aunque nunca hayas postulado.</p>
    </div>
    <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-y border-[var(--line)] py-4 text-sm text-[var(--navy)]">
      <p><strong>{counts.open}</strong> {counts.open === 1 ? "fondo abierto" : "fondos abiertos"}</p><p><strong>{counts.ongoing}</strong> servicios continuos</p><p><strong>{catalog.calls.length}</strong> fichas en esta selección</p>
    </div>
    <form action="/catalogo" className="mt-8 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
      <h2 className="font-semibold text-[var(--navy)]">¿Qué necesitas hoy?</h2>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">Todas las preguntas son opcionales. Estos filtros ayudan a explorar; no determinan si cumples los requisitos.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label className="text-sm font-semibold" htmlFor="region">Tu región</label><select className={inputClass} id="region" name="region" defaultValue={filters.region}><option value="">Todas / aún no lo sé</option>{Object.entries(REGIONS).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
        <div><label className="text-sm font-semibold" htmlFor="stage">Etapa de tu proyecto</label><select className={inputClass} id="stage" name="stage" defaultValue={filters.stage}><option value="">Todas / aún no lo sé</option>{Object.entries(STAGES).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
        <div><label className="text-sm font-semibold" htmlFor="goal">Qué buscas</label><select className={inputClass} id="goal" name="goal" defaultValue={filters.goal}><option value="">Todo / aún no lo sé</option>{Object.entries(GOALS).map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
        <div><label className="text-sm font-semibold" htmlFor="availability">Disponibilidad</label><select className={inputClass} id="availability" name="availability" defaultValue={filters.availability}><option value="available">Disponibles ahora</option><option value="all">Todas, incluidas referencias</option><option value="closed">Solo referencias cerradas</option></select></div>
      </div>
      <div className="mt-5 flex items-center gap-5"><button className="rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-semibold text-white" type="submit">Buscar apoyos</button><Link className="text-sm font-semibold text-[var(--blue)] underline underline-offset-4" href="/catalogo">Limpiar filtros</Link></div>
    </form>
    <section aria-label="Resultados del catálogo" className="mt-10">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold text-[var(--navy)]">{results.length} opciones para explorar</h2><p className="text-xs text-[var(--ink-muted)]">Abiertos y servicios primero; referencias al final.</p></div>
      {results.length ? results.map(call => <CatalogCard key={call.id} call={call} now={now} />) : <div className="rounded-lg border border-[var(--line)] p-6"><h3 className="text-lg font-semibold">No encontramos apoyos con estos filtros</h3><p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">Nuestra selección es limitada. Puedes ampliar la búsqueda, revisar referencias o avanzar con tu idea mientras aparecen nuevos llamados.</p><div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold text-[var(--blue)]"><Link href="/catalogo?availability=all">Ver todos los apoyos</Link><Link href="/proyectos/nuevo">Preparar mi proyecto</Link></div></div>}
    </section>
    <section className="mt-10 border-t border-[var(--line-strong)] pt-8" id="cobertura">
      <h2 className="text-xl font-semibold text-[var(--navy)]">Qué cubre este catálogo</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-muted)]">{catalog.coverageNotice}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">{catalog.institutions.map(institution => <div className="border-l-2 border-[var(--line)] pl-4" key={institution.id}><h3 className="font-semibold text-[var(--navy)]">{institution.name}</h3><p className="mt-1 text-sm text-[var(--ink-muted)]">{catalog.calls.filter(c => c.institutionId === institution.id).length} fichas incluidas</p></div>)}</div>
      <details className="mt-6 text-sm text-[var(--ink-muted)]"><summary className="cursor-pointer font-semibold text-[var(--blue)]">Fuentes revisadas y alcance de la actualización</summary><p className="mt-3 leading-6">Última búsqueda de oportunidades: {formatCatalogDate(catalog.lastDiscoveryAt)}. {catalog.discoveryScope}</p><p className="mt-2">Versión {catalog.version}. Cada ficha indica su propia revisión. Una revisión vencida se muestra como pendiente de verificar.</p></details>
    </section>
  </main>;
}

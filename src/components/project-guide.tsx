import { ANTECEDENT_DEFINITIONS, getAntecedentDefinition } from "@/domain/antecedents";
import { BEGINNER_GROUPS, BEGINNER_KEYS, emptyAntecedent, getBeginnerProgress } from "@/domain/beginner-guide";
import { hasConfirmedValue } from "@/domain/antecedent-input";
import type { AntecedentKey, ProjectAntecedent } from "@/domain/types";
import { AntecedentField } from "./antecedent-field";

export function ProjectGuide({ action, antecedents, projectId }: {
  action: (formData: FormData) => void | Promise<void>;
  antecedents: ProjectAntecedent[];
  projectId: string;
}) {
  const byKey = new Map(antecedents.map((item) => [item.key, item]));
  const { nextKeys } = getBeginnerProgress(antecedents);
  const firstIncomplete = BEGINNER_GROUPS.findIndex((group) => group.keys.some((key) => !hasConfirmedValue(byKey.get(key))));
  const additional = ANTECEDENT_DEFINITIONS.filter((definition) => !BEGINNER_KEYS.includes(definition.key));
  function field(key: AntecedentKey) {
    return <AntecedentField key={key} action={action} antecedent={byKey.get(key) ?? emptyAntecedent(projectId, key)} definition={getAntecedentDefinition(key)} />;
  }

  return (
    <section className="py-10" id="antecedentes">
      <aside className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 md:p-7" aria-labelledby="next-steps-heading">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--blue)]">Empieza por aquí</p>
        <h2 id="next-steps-heading" className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--navy)]">{nextKeys.length === 3 ? "Tus próximos tres pasos" : nextKeys.length ? "Tus próximos pasos" : "Tu ficha inicial está completa"}</h2>
        {nextKeys.length ? (
          <>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Revisa lo que identificamos y responde lo que falte. Puedes avanzar a tu ritmo; no necesitas completar todo hoy.</p>
            <ol aria-label="Siguientes pasos" className="mt-5 grid list-inside list-decimal gap-4 md:grid-cols-3">
              {nextKeys.map((key) => <li className="text-sm text-[var(--navy)]" key={key}>
                <a href={`#antecedent-${key}`} className="font-semibold underline underline-offset-4">{getAntecedentDefinition(key).label}</a>
                <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">{getAntecedentDefinition(key).help}</p>
              </li>)}
            </ol>
          </>
        ) : <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Ya tienes una base para orientarte. <a className="font-semibold underline underline-offset-4" href="#oportunidades">Revisa las oportunidades y sus condiciones</a>. Completar esta ficha no valida requisitos ni garantiza financiamiento.</p>}
      </aside>

      <div className="mt-10">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--navy)]">Construyamos tu ficha paso a paso</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-muted)]">El relato inicial es el punto de partida. Estas preguntas completan lo que todavía no podemos identificar; cada respuesta se guarda para reutilizarla.</p>
      </div>
      <div className="mt-7 space-y-4">
        {BEGINNER_GROUPS.map((group, index) => {
          const confirmed = group.keys.filter((key) => hasConfirmedValue(byKey.get(key))).length;
          return <details key={`${index}-${firstIncomplete}`} open={index === firstIncomplete} className="rounded-xl border border-[var(--line)] p-5">
            <summary className="cursor-pointer text-lg font-semibold text-[var(--navy)]">
              {group.title}<span className="ml-3 whitespace-nowrap text-xs font-normal text-[var(--ink-muted)]">{confirmed} de {group.keys.length} respuestas</span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">{group.help}</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">{group.keys.map(field)}</div>
          </details>;
        })}
        <details className="rounded-xl border border-[var(--line)] p-5">
          <summary className="cursor-pointer font-semibold text-[var(--navy)]">Otros antecedentes, cuando los necesites</summary>
          <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">Aquí puedes ampliar tu proyecto o completar un dato que pida una convocatoria. Responde solo lo que corresponda a tu situación.</p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">{additional.map((definition) => field(definition.key))}</div>
        </details>
      </div>
    </section>
  );
}

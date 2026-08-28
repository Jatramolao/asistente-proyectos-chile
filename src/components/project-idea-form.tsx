"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type ProjectIdeaFormProps = {
  action: (formData: FormData) => void | Promise<void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-lg bg-[var(--navy)] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(20,48,79,0.18)] transition-[background-color,transform] duration-150 hover:bg-[#1c426b] active:scale-[0.98] disabled:cursor-wait disabled:opacity-65"
      disabled={pending}
      type="submit"
    >
      {pending ? "Ordenando tu idea…" : "Crear proyecto y ordenar antecedentes"}
    </button>
  );
}

export function ProjectIdeaForm({ action }: ProjectIdeaFormProps) {
  const [length, setLength] = useState(0);

  return (
    <form action={action} className="mt-9">
      <label className="block text-xl font-semibold tracking-[-0.025em] text-[var(--navy)]" htmlFor="narrative">
        Cuéntanos tu idea de proyecto
      </label>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--ink-muted)]">
        Escríbela como se la explicarías a otra persona: qué problema observas, a quién afecta y qué solución tecnológica imaginas.
      </p>
      <textarea
        aria-describedby="narrative-help narrative-count"
        autoFocus
        className="mt-5 min-h-72 w-full resize-y rounded-xl border border-[var(--line-strong)] bg-white px-5 py-4 text-base leading-7 text-[var(--ink)] shadow-sm outline-none transition-[border-color,box-shadow] duration-150 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_var(--blue-soft)]"
        id="narrative"
        maxLength={5000}
        minLength={40}
        name="narrative"
        onChange={(event) => setLength(event.currentTarget.value.length)}
        placeholder="Por ejemplo: En pequeños edificios se pierde agua porque las fugas se detectan tarde. Quiero desarrollar sensores conectados a una plataforma que alerten a la administración…"
        required
      />
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3 text-xs leading-5 text-[var(--ink-muted)]">
        <p id="narrative-help">No incluyas RUT, claves, datos bancarios ni información sensible.</p>
        <p className="font-mono" id="narrative-count">{length.toLocaleString("es-CL")} / 5.000 caracteres</p>
      </div>

      <aside className="mt-6 rounded-lg border border-[#bfd4e3] bg-[#edf6fc] px-4 py-3 text-sm leading-6 text-[#244c69]">
        <strong>Alcance de la guía:</strong> organizamos datos declarados y condiciones oficiales. No evaluamos ni validamos documentos, ni aseguramos una adjudicación.
      </aside>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <SubmitButton />
        <p className="max-w-md text-xs leading-5 text-[var(--ink-muted)]">Podrás corregir o dejar pendiente todo lo que el sistema identifique.</p>
      </div>
    </form>
  );
}

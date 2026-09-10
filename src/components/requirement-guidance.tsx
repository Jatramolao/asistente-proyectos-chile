"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, Lightbulb, Maximize2, Minimize2, X } from "lucide-react";
import type { GuidanceBlock, ResolvedRequirementGuidance } from "@/domain/requirement-guidance";

function GuidanceBlockContent({ block }: { block: GuidanceBlock }) {
  const titleId = useId();
  return <section>
    <h5 id={titleId} className="text-base font-semibold text-[var(--navy)]">{block.title}</h5>
    {block.type === "paragraph" ? <p className="mt-2 leading-7 text-[var(--ink-muted)]">{block.text}</p> : null}
    {block.type === "list" ? <ul aria-labelledby={titleId} className="mt-2 list-disc space-y-2 pl-5 leading-7 text-[var(--ink-muted)]">
      {block.items.map(item => <li key={item}>{item}</li>)}
    </ul> : null}
    {block.type === "steps" ? <ol aria-labelledby={titleId} className="mt-2 list-decimal space-y-2 pl-5 leading-7 text-[var(--ink-muted)]">
      {block.items.map(item => <li key={item}>{item}</li>)}
    </ol> : null}
  </section>;
}

function EvidenceDetails({ guidance, detailsRef }: {
  guidance: ResolvedRequirementGuidance;
  detailsRef: React.RefObject<HTMLDetailsElement | null>;
}) {
  const { evidence } = guidance;
  return <details ref={detailsRef} className="border-t border-[var(--line)] pt-5">
    <summary className="min-h-11 cursor-pointer py-2 font-semibold text-[var(--blue)]">Requisito completo y fuentes</summary>
    <div className="mt-3 space-y-4 rounded-md bg-[var(--canvas)] p-4 text-sm leading-6 text-[var(--ink-muted)]">
      <div><p className="font-semibold text-[var(--ink)]">Descripción completa</p><p className="mt-1">{evidence.description}</p></div>
      <div><p className="font-semibold text-[var(--ink)]">Quién verifica</p><p className="mt-1">{evidence.verifier}</p></div>
      {evidence.validity ? <div><p className="font-semibold text-[var(--ink)]">Vigencia</p><p className="mt-1">{evidence.validity}</p></div> : null}
      {evidence.sources.length ? <div>
        <p className="font-semibold text-[var(--ink)]">Fuentes oficiales</p>
        <ul className="mt-2 space-y-2">
          {evidence.sources.map(source => <li key={source.id}>
            <a className="inline-flex min-h-11 items-center gap-1.5 py-2 font-semibold text-[var(--blue)] underline underline-offset-4" href={source.officialUrl} target="_blank" rel="noreferrer">
              {source.title}<ArrowUpRight aria-hidden size={15} />
              <span className="sr-only"> (abre en una pestaña nueva)</span>
            </a>
          </li>)}
        </ul>
      </div> : null}
      {evidence.hasUnavailableSources ? <p className="font-semibold text-[#76551e]">Fuente no disponible en esta ficha</p> : null}
    </div>
  </details>;
}

export function RequirementGuidance({
  guidance,
  open,
  disabled,
  onOpen,
  onClose,
}: {
  guidance: ResolvedRequirementGuidance;
  open: boolean;
  disabled: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const reactId = useId().replaceAll(":", "");
  const dialogId = `requirement-guidance-${reactId}`;
  const titleId = `${dialogId}-title`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (detailsRef.current) detailsRef.current.open = false;
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      if (!dialog.open) {
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
      }
      requestAnimationFrame(() => titleRef.current?.focus());
      return;
    }
    if (!dialog.open) return;
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }, [guidance.requirementId, open]);

  function restoreFocus() {
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function openDialog() {
    setExpanded(false);
    if (detailsRef.current) detailsRef.current.open = false;
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
    onOpen();
  }

  function closeDialog() {
    const dialog = dialogRef.current;
    if (dialog?.open && typeof dialog.close === "function") {
      dialog.close();
      return;
    }
    dialog?.removeAttribute("open");
    onClose();
    restoreFocus();
  }

  function handleNativeClose() {
    if (open) onClose();
    restoreFocus();
  }

  function keepFocusInside(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
    )).filter(control => {
      const closedDetails = control.closest("details:not([open])");
      return getComputedStyle(control).display !== "none"
        && (!closedDetails || control.tagName === "SUMMARY");
    });
    const first = controls.at(0);
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return <>
    <button
      ref={triggerRef}
      type="button"
      aria-label={`Ver orientación: ${guidance.title}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={dialogId}
      disabled={disabled}
      onClick={openDialog}
      className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md border border-[#b7d2e4] bg-white px-3 py-2 text-sm font-semibold text-[var(--blue)] hover:border-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Lightbulb aria-hidden size={18} />
      Ver orientación
    </button>

    <dialog
      ref={dialogRef}
      id={dialogId}
      aria-labelledby={titleId}
      aria-modal="true"
      data-expanded={expanded}
      className="requirement-guidance-dialog"
      onClose={handleNativeClose}
      onCancel={event => { event.preventDefault(); closeDialog(); }}
      onClick={event => { if (event.target === event.currentTarget) closeDialog(); }}
      onKeyDown={keepFocusInside}
    >
      <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[var(--surface)]" onClick={event => event.stopPropagation()}>
        <header className="flex shrink-0 items-start gap-4 border-b border-[var(--line)] px-5 py-4 md:px-7">
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-[var(--blue)]">Orientación para este requisito</p>
            <h4 ref={titleRef} tabIndex={-1} id={titleId} className="mt-2 text-xl font-semibold leading-tight tracking-[-0.025em] text-[var(--navy)] outline-none">{guidance.title}</h4>
          </div>
          <button type="button" onClick={closeDialog} aria-label="Cerrar orientación" className="grid size-11 shrink-0 place-items-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--canvas)] hover:text-[var(--navy)]">
            <X aria-hidden size={22} />
          </button>
        </header>

        <div ref={bodyRef} className="min-h-0 flex-1 space-y-6 overflow-x-hidden overflow-y-auto px-5 py-6 text-base md:px-7">
          {guidance.blocks.map(block => <GuidanceBlockContent key={`${block.type}:${block.title}`} block={block} />)}
          <EvidenceDetails guidance={guidance} detailsRef={detailsRef} />
        </div>

        <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] bg-[var(--surface)] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 md:px-7">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(value => !value)}
            className="requirement-guidance-expand min-h-11 items-center gap-2 text-sm font-semibold text-[var(--blue)]"
          >
            {expanded ? <Minimize2 aria-hidden size={17} /> : <Maximize2 aria-hidden size={17} />}
            {expanded ? "Restaurar orientación" : "Ampliar orientación"}
          </button>
          <button type="button" onClick={closeDialog} className="min-h-11 rounded-md bg-[var(--blue)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--navy)]">Volver a mi respuesta</button>
        </footer>
      </div>
    </dialog>
  </>;
}

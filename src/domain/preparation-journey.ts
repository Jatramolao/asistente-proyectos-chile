import { hasConfirmedValue } from "./antecedent-input";
import { buildAllInJourney } from "./allin-journey";
import { ALLIN_CALL_ID, type CallResponseDefinition } from "./call-responses";
import { getAntecedentDefinition } from "./antecedents";
import { buildChecklist, type ChecklistProgress } from "./checklist";
import type { AntecedentKey, ChecklistItem, FundingCall, ProjectAntecedent } from "./types";

export const PILOT_JOURNEY_CALL_ID = "sercotec-modo-empleo-atacama-2026";

const STAGES = [
  { id: "fit", label: "Revisa si encaja", title: "Conoce las condiciones para comenzar", help: "Confirma tu situación antes de invertir tiempo en la postulación. Tener los datos preparados no significa cumplir las condiciones." },
  { id: "proposal", label: "Desarrolla tu propuesta", title: "Dale forma a tu propuesta", help: "Define qué problema resuelves, a quién ayudas y cómo funciona tu idea." },
  { id: "budget", label: "Organiza tu presupuesto", title: "Planifica cuánto necesitas", help: "Prepara el presupuesto de tu propuesta. Revisa los gastos permitidos, el aporte y los impuestos en la ficha oficial." },
  { id: "documents", label: "Reúne los respaldos", title: "Prepara los documentos que te piden", help: "Reúne los respaldos y comprueba su vigencia. Aquí registras su preparación; los documentos se presentan en el portal oficial." },
  { id: "submission", label: "Revisa y presenta", title: "Revisa tu postulación antes de enviarla", help: "Traslada tu trabajo al formulario oficial y revisa sus anexos. Marcarlo preparado no envía tu postulación." },
  { id: "followup", label: "Sigue el resultado", title: "Acompaña lo que viene después", help: "Consulta el resultado en la institución. La formalización y el aporte corresponden si eres seleccionado." },
] as const;

export type PreparationStageId = typeof STAGES[number]["id"] | "participation" | "registration" | "assignment" | "bootcamp" | "semifinal" | "final";
export type PreparationTask = {
  id: string;
  label: string;
  help: string;
  requirementIds: string[];
  antecedentKey?: AntecedentKey;
  antecedent?: ProjectAntecedent;
  item?: ChecklistItem;
  complete: boolean;
  reused: boolean;
  response?: CallResponseDefinition;
  draft?: string;
  draftSource?: string;
};
export type PreparationStage = {
  id: PreparationStageId;
  label: string;
  title: string;
  help: string;
  tasks: PreparationTask[];
  completed: number;
  future: boolean;
  previewOnly?: boolean;
  deadlineLabel?: string;
};

function answerStage(key: AntecedentKey): PreparationStageId {
  if (key.startsWith("applicant.")) return "fit";
  if (key.startsWith("execution.")) return "budget";
  return "proposal";
}

function isPrepared(item: ChecklistItem | undefined): boolean {
  return item?.status === "user_completed_unvalidated" || (item?.status === "not_applicable" && !!item.reason?.trim());
}

export function buildPreparationJourney({ call, antecedents, progress }: {
  call: FundingCall;
  antecedents: readonly ProjectAntecedent[];
  progress: readonly ChecklistProgress[];
}): PreparationStage[] | null {
  if (call.id === ALLIN_CALL_ID) return buildAllInJourney({ call, antecedents, progress });
  if (call.id !== PILOT_JOURNEY_CALL_ID) return null;
  const stages: PreparationStage[] = STAGES.map(stage => ({ ...stage, tasks: [], completed: 0, future: stage.id === "followup" }));
  const answers = new Map(antecedents.map(antecedent => [antecedent.key, antecedent]));
  const items = new Map(buildChecklist({ calls: [call], antecedents, progress }).flatMap(group => group.items).map(item => [item.key, item]));

  function addAnswer(key: AntecedentKey, requirementId: string) {
    const stage = stages.find(stage => stage.id === answerStage(key))!;
    const existing = stage.tasks.find(task => task.id === `antecedent:${key}`);
    if (existing) {
      existing.requirementIds.push(requirementId);
      return;
    }
    const definition = getAntecedentDefinition(key);
    const antecedent = answers.get(key);
    const item = items.get(`antecedent:${key}`);
    const labels: Partial<Record<AntecedentKey, string>> = {
      "essence.problem": "Define el problema", "essence.solution": "Describe tu solución",
      "essence.customer": "Identifica a tus clientes", "execution.budget": "Prepara tu presupuesto",
    };
    stage.tasks.push({
      id: `antecedent:${key}`, label: labels[key] ?? definition.label, help: definition.help,
      requirementIds: [requirementId], antecedentKey: key, antecedent, item,
      complete: hasConfirmedValue(antecedent) || isPrepared(item), reused: hasConfirmedValue(antecedent),
    });
  }

  for (const requirement of call.requirements) {
    const future = requirement.stage !== "application" || requirement.responsibleParty !== "applicant";
    if (requirement.kind === "canonical_antecedent" && !future) {
      requirement.antecedentKeys.forEach(key => addAnswer(key, requirement.id));
      continue;
    }
    if (!future) requirement.antecedentKeys.forEach(key => addAnswer(key, requirement.id));
    const stageId = future ? "followup" : requirement.id === "modo-postulacion" ? "submission" : "documents";
    const stage = stages.find(stage => stage.id === stageId)!;
    const requirementItems = [...items.values()].filter(item => item.contexts.some(context => context.requirementId === requirement.id));
    for (const item of requirementItems) {
      stage.tasks.push({
        id: item.key, label: requirement.label, help: requirement.description,
        requirementIds: [requirement.id], item, complete: isPrepared(item), reused: false,
      });
    }
  }
  return stages.map(stage => ({ ...stage, completed: stage.tasks.filter(task => task.complete).length }));
}

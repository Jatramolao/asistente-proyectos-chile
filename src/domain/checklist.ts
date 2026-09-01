import { getAntecedentDefinition } from "./antecedents";
import type { ChecklistItem, ChecklistStatus, FundingCall, RequirementStage } from "./types";

export type ChecklistProgress = {
  itemKey: string;
  status: ChecklistStatus;
  note: string | null;
  reason: string | null;
  updatedAt: string;
};

export type ChecklistGroup = {
  stage: RequirementStage;
  label: string;
  items: ChecklistItem[];
};

export type CallChecklistGroup = {
  callId: string;
  callName: string;
  institutionId: string;
  territory: string;
  groups: ChecklistGroup[];
};

const STAGE_LABELS: Record<RequirementStage, string> = {
  application: "Para postular",
  evaluation: "Durante la evaluación",
  selection: "Si el proyecto es seleccionado",
  formalization: "Para formalizar",
};

const STATUS_LABELS: Record<ChecklistStatus, string> = {
  pending: "Pendiente",
  in_progress: "En preparación",
  user_completed_unvalidated: "Completado por el usuario, no validado",
  not_applicable: "No aplica",
  institution_verifies: "Verifica la institución",
  future_if_selected: "Futuro, si resulta seleccionado",
  stale: "Revisar: puede estar desactualizado",
};

function defaultStatus(responsibleParty: ChecklistItem["responsibleParty"]): ChecklistStatus {
  if (responsibleParty === "institution") return "institution_verifies";
  if (responsibleParty === "selected_beneficiary") return "future_if_selected";
  return "pending";
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

export function buildChecklist(input: {
  calls: readonly FundingCall[];
  progress: readonly ChecklistProgress[];
}): ChecklistGroup[] {
  const items = new Map<string, ChecklistItem>();

  for (const call of input.calls) {
    for (const requirement of call.requirements) {
      const itemKeys = requirement.kind === "canonical_antecedent"
        ? requirement.antecedentKeys.map((key) => `antecedent:${key}`)
        : [`requirement:${call.id}:${requirement.id}`];

      for (const itemKey of itemKeys) {
        const existing = items.get(itemKey);
        if (existing) {
          existing.callIds = unique([...existing.callIds, call.id]);
          existing.sourceIds = unique([...existing.sourceIds, ...requirement.sourceIds]);
          existing.antecedentKeys = unique([...existing.antecedentKeys, ...requirement.antecedentKeys]);
          continue;
        }

        const canonicalKey = requirement.kind === "canonical_antecedent"
          ? requirement.antecedentKeys[itemKeys.indexOf(itemKey)]
          : null;
        const label = canonicalKey ? getAntecedentDefinition(canonicalKey).label : requirement.label;
        const status = defaultStatus(requirement.responsibleParty);
        items.set(itemKey, {
          key: itemKey,
          label,
          status,
          statusLabel: STATUS_LABELS[status],
          stage: requirement.stage,
          callIds: [call.id],
          antecedentKeys: canonicalKey ? [canonicalKey] : requirement.antecedentKeys,
          responsibleParty: requirement.responsibleParty,
          verifier: requirement.verifier,
          validity: requirement.validity,
          sourceIds: requirement.sourceIds,
          note: null,
          reason: null,
        });
      }
    }
  }

  for (const progress of input.progress) {
    const item = items.get(progress.itemKey);
    if (!item) continue;
    if (progress.status === "not_applicable" && !progress.reason?.trim()) continue;
    item.status = progress.status;
    item.statusLabel = STATUS_LABELS[progress.status];
    item.note = progress.note;
    item.reason = progress.reason;
  }

  return (Object.keys(STAGE_LABELS) as RequirementStage[])
    .map((stage) => ({
      stage,
      label: STAGE_LABELS[stage],
      items: [...items.values()].filter((item) => item.stage === stage),
    }))
    .filter((group) => group.items.length > 0);
}

export function buildChecklistByCall(input: {
  calls: readonly FundingCall[];
  progress: readonly ChecklistProgress[];
}): CallChecklistGroup[] {
  const transversal = buildChecklist(input);

  return input.calls.map((call) => ({
    callId: call.id,
    callName: call.name,
    institutionId: call.institutionId,
    territory: call.territory,
    groups: transversal
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.callIds.includes(call.id)),
      }))
      .filter((group) => group.items.length > 0),
  }));
}

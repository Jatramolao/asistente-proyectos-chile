import type {
  AntecedentValue,
  FundingCall,
  MatchResult,
  ProjectAntecedent,
  Rule,
  RuleEvaluation,
} from "./types";

function valuesEqual(left: AntecedentValue, right: AntecedentValue): boolean {
  return left === right;
}

function compare(value: AntecedentValue, rule: Rule): boolean {
  const expected = rule.expectedValue;

  switch (rule.operator) {
    case "equals":
      return !Array.isArray(expected) && valuesEqual(value, expected);
    case "not_equals":
      return !Array.isArray(expected) && !valuesEqual(value, expected);
    case "in":
      return Array.isArray(expected) && expected.some((item) => valuesEqual(value, item));
    case "not_in":
      return Array.isArray(expected) && expected.every((item) => !valuesEqual(value, item));
    case "gte":
      return typeof value === "number" && typeof expected === "number" && value >= expected;
    case "lte":
      return typeof value === "number" && typeof expected === "number" && value <= expected;
    case "is_known":
      return value !== null && value !== "";
  }
}

export function evaluateRule(rule: Rule, antecedents: readonly ProjectAntecedent[]): RuleEvaluation {
  const item = antecedents.find((candidate) => candidate.key === rule.antecedentKey);
  const isUserConfirmed = item && ["confirmed", "corrected"].includes(item.confirmationStatus);

  if (!item || !isUserConfirmed) {
    return {
      ruleId: rule.id,
      outcome: "unknown",
      reason: rule.unknownReason,
      antecedentKey: rule.antecedentKey,
      sourceIds: rule.sourceIds,
    };
  }

  const passes = compare(item.value, rule);
  return {
    ruleId: rule.id,
    outcome: passes ? "pass" : "contradiction",
    reason: passes ? rule.passReason : rule.contradictionReason,
    antecedentKey: rule.antecedentKey,
    sourceIds: rule.sourceIds,
  };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function isCurrent(call: FundingCall, now: Date): boolean {
  if (call.status !== "open") return false;
  const opensAt = new Date(call.opensAt);
  const closesAt = new Date(call.closesAt);
  return now >= opensAt && now <= closesAt;
}

export function matchCall(
  call: FundingCall,
  antecedents: readonly ProjectAntecedent[],
  now: Date,
  catalogVersion: string,
): MatchResult {
  const evaluations = call.rules.map((rule) => ({ rule, evaluation: evaluateRule(rule, antecedents) }));
  const contradictions = evaluations.filter(({ evaluation }) => evaluation.outcome === "contradiction");
  const decisiveUnknowns = evaluations.filter(
    ({ rule, evaluation }) => rule.decisive && evaluation.outcome === "unknown",
  );
  const preparableUnknowns = evaluations.filter(
    ({ rule, evaluation }) => !rule.decisive && rule.preparable && evaluation.outcome === "unknown",
  );

  let status: MatchResult["status"];
  let relevant = evaluations;

  if (!isCurrent(call, now)) {
    status = "call_not_current";
    relevant = [];
  } else if (contradictions.length > 0) {
    status = "not_compatible_now";
    relevant = contradictions;
  } else if (decisiveUnknowns.length > 0) {
    status = "insufficient_information";
    relevant = decisiveUnknowns;
  } else if (preparableUnknowns.length > 0) {
    status = "requires_preparation";
    relevant = preparableUnknowns;
  } else {
    status = "compatible_to_review";
  }

  const fallbackReason = status === "call_not_current"
    ? "La convocatoria no está vigente; se muestra solo como referencia."
    : "No hay incompatibilidades conocidas con los antecedentes confirmados; verifica siempre las bases oficiales.";

  return {
    callId: call.id,
    status,
    reasons: relevant.length > 0 ? relevant.map(({ evaluation }) => evaluation.reason) : [fallbackReason],
    blockingRuleIds: contradictions.map(({ rule }) => rule.id),
    missingAntecedentKeys: unique(
      evaluations
        .filter(({ evaluation }) => evaluation.outcome === "unknown")
        .map(({ rule }) => rule.antecedentKey),
    ),
    sourceIds: unique([...call.sourceIds, ...relevant.flatMap(({ evaluation }) => evaluation.sourceIds)]),
    catalogVersion,
  };
}

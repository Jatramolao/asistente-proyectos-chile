export type AntecedentSection =
  | "essence"
  | "market"
  | "technology"
  | "execution"
  | "impact"
  | "applicant";

export type AntecedentKey =
  | "essence.problem"
  | "essence.evidence"
  | "essence.solution"
  | "essence.value_proposition"
  | "essence.customer"
  | "essence.territory"
  | "market.competition"
  | "market.channels"
  | "market.revenue_status"
  | "market.costs"
  | "market.size"
  | "market.partners"
  | "technology.component"
  | "technology.novelty"
  | "technology.ownership"
  | "technology.maturity"
  | "technology.ip"
  | "technology.validation"
  | "execution.team"
  | "execution.activities"
  | "execution.milestones"
  | "execution.timeline"
  | "execution.budget"
  | "execution.cofunding"
  | "execution.infrastructure"
  | "execution.providers"
  | "impact.outcomes"
  | "impact.jobs"
  | "impact.social"
  | "impact.environmental"
  | "impact.indicators"
  | "impact.risks"
  | "applicant.age"
  | "applicant.gender"
  | "applicant.region"
  | "applicant.commune"
  | "applicant.formalization"
  | "applicant.sii_first_category"
  | "applicant.sii_activity_age_months"
  | "applicant.has_sales"
  | "applicant.rsh_percent"
  | "applicant.valid_id"
  | "applicant.clave_unica"
  | "applicant.company_ownership_percent"
  | "applicant.labor_tax_debt"
  | "applicant.alimony_registry";

export type AntecedentValue = string | number | boolean | null;
export type AntecedentValueType =
  | "short_text"
  | "long_text"
  | "number"
  | "money"
  | "boolean"
  | "region"
  | "maturity"
  | "status";

export type ConfirmationStatus = "inferred" | "confirmed" | "corrected" | "missing" | "stale";
export type AntecedentOrigin = "narrative" | "answer" | "manual" | "official";

export type AntecedentDefinition = {
  key: AntecedentKey;
  section: AntecedentSection;
  label: string;
  help: string;
  valueType: AntecedentValueType;
  decisive: boolean;
};

export type ProjectAntecedent = {
  id: string;
  projectId: string;
  key: AntecedentKey;
  value: AntecedentValue;
  confirmationStatus: ConfirmationStatus;
  origin: AntecedentOrigin;
  sourceExcerpt: string | null;
  updatedAt: string;
};

export type SourceStatus = "current" | "closed" | "replaced" | "verify";
export type OfficialSource = {
  id: string;
  institutionId: string;
  title: string;
  officialUrl: string;
  sourceType: "official_page" | "bases" | "faq" | "official_notice";
  scope: string;
  reviewedAt: string;
  status: SourceStatus;
};

export type SupportType =
  | "non_refundable_subsidy"
  | "cofinanced_subsidy"
  | "credit"
  | "state_guarantee"
  | "tax_incentive"
  | "training"
  | "technical_assistance";

export type CallStatus = "open" | "scheduled" | "closed" | "verify";
export type RequirementStage = "application" | "evaluation" | "selection" | "formalization";
export type RequirementKind = "canonical_antecedent" | "specific_document" | "institution_check";
export type RuleOperator = "equals" | "not_equals" | "in" | "not_in" | "gte" | "lte" | "is_known";

export type Rule = {
  id: string;
  antecedentKey: AntecedentKey;
  operator: RuleOperator;
  expectedValue: AntecedentValue | AntecedentValue[];
  decisive: boolean;
  preparable: boolean;
  passReason: string;
  contradictionReason: string;
  unknownReason: string;
  sourceIds: string[];
};

export type Requirement = {
  id: string;
  label: string;
  description: string;
  stage: RequirementStage;
  kind: RequirementKind;
  antecedentKeys: AntecedentKey[];
  responsibleParty: "applicant" | "institution" | "selected_beneficiary";
  verifier: string;
  validity: string | null;
  sourceIds: string[];
};

export type Benefit = {
  summary: string;
  maximumAmountClp: number | null;
  coveragePercent: number | null;
  beneficiaryContributionPercent: number | null;
  taxTreatment: string | null;
  allowedCosts: string[];
  excludedCosts: string[];
};

export type FundingCall = {
  id: string;
  instrumentId: string;
  name: string;
  institutionId: string;
  territory: string;
  timezone: "America/Santiago";
  opensAt: string;
  closesAt: string;
  schedulePrecision: "date" | "datetime";
  status: CallStatus;
  isReference: boolean;
  supportType: SupportType;
  benefit: Benefit;
  requirements: Requirement[];
  rules: Rule[];
  sourceIds: string[];
};

export type MatchStatus =
  | "compatible_to_review"
  | "requires_preparation"
  | "not_compatible_now"
  | "insufficient_information"
  | "call_not_current";

export type RuleOutcome = "pass" | "contradiction" | "unknown";
export type RuleEvaluation = {
  ruleId: string;
  outcome: RuleOutcome;
  reason: string;
  antecedentKey: AntecedentKey;
  sourceIds: string[];
};

export type MatchResult = {
  callId: string;
  status: MatchStatus;
  reasons: string[];
  blockingRuleIds: string[];
  missingAntecedentKeys: AntecedentKey[];
  sourceIds: string[];
  catalogVersion: string;
};

export type ChecklistStatus =
  | "pending"
  | "in_progress"
  | "user_completed_unvalidated"
  | "not_applicable"
  | "institution_verifies"
  | "future_if_selected"
  | "stale";

export type ChecklistItem = {
  key: string;
  label: string;
  status: ChecklistStatus;
  statusLabel: string;
  stage: RequirementStage;
  callIds: string[];
  antecedentKeys: AntecedentKey[];
  responsibleParty: Requirement["responsibleParty"];
  verifier: string;
  validity: string | null;
  sourceIds: string[];
  note: string | null;
  reason: string | null;
};

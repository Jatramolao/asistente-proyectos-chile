import { z } from "zod";

const InstitutionIdSchema = z.enum(["sercotec", "corfo", "fosis"]);
const AntecedentKeySchema = z.enum([
  "essence.problem",
  "essence.evidence",
  "essence.solution",
  "essence.value_proposition",
  "essence.customer",
  "essence.territory",
  "market.competition",
  "market.channels",
  "market.revenue_status",
  "market.costs",
  "market.size",
  "market.partners",
  "technology.component",
  "technology.novelty",
  "technology.ownership",
  "technology.maturity",
  "technology.ip",
  "technology.validation",
  "execution.team",
  "execution.activities",
  "execution.milestones",
  "execution.timeline",
  "execution.budget",
  "execution.cofunding",
  "execution.infrastructure",
  "execution.providers",
  "impact.outcomes",
  "impact.jobs",
  "impact.social",
  "impact.environmental",
  "impact.indicators",
  "impact.risks",
  "applicant.age",
  "applicant.gender",
  "applicant.region",
  "applicant.commune",
  "applicant.formalization",
  "applicant.sii_first_category",
  "applicant.sii_activity_age_months",
  "applicant.has_sales",
  "applicant.rsh_percent",
  "applicant.valid_id",
  "applicant.clave_unica",
  "applicant.company_ownership_percent",
  "applicant.labor_tax_debt",
  "applicant.alimony_registry",
]);

const SourceSchema = z
  .object({
    id: z.string().min(1),
    institutionId: InstitutionIdSchema,
    title: z.string().min(1),
    officialUrl: z
      .string()
      .url()
      .refine((url) => /(?:sercotec\.cl|corfo\.(?:cl|gob\.cl)|fosis\.gob\.cl)/.test(url), "Debe ser un dominio oficial"),
    sourceType: z.enum(["official_page", "bases", "faq", "official_notice"]),
    scope: z.string().min(1),
    reviewedAt: z.literal("2026-09-01"),
    status: z.enum(["current", "closed", "replaced", "verify"]),
  })
  .strict();

const RuleValueSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);

const RuleSchema = z
  .object({
    id: z.string().min(1),
    antecedentKey: AntecedentKeySchema,
    operator: z.enum(["equals", "not_equals", "in", "not_in", "gte", "lte", "is_known"]),
    expectedValue: z.union([RuleValueSchema, z.array(RuleValueSchema).min(1)]),
    decisive: z.boolean(),
    preparable: z.boolean(),
    passReason: z.string().min(1),
    contradictionReason: z.string().min(1),
    unknownReason: z.string().min(1),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

const RequirementSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    description: z.string().min(1),
    stage: z.enum(["application", "evaluation", "selection", "formalization"]),
    kind: z.enum(["canonical_antecedent", "specific_document", "institution_check"]),
    antecedentKeys: z.array(AntecedentKeySchema),
    responsibleParty: z.enum(["applicant", "institution", "selected_beneficiary"]),
    verifier: z.string().min(1),
    validity: z.string().nullable(),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

const BenefitSchema = z
  .object({
    summary: z.string().min(1),
    maximumAmountClp: z.number().int().positive().nullable(),
    coveragePercent: z.number().min(0).max(100).nullable(),
    beneficiaryContributionPercent: z.number().min(0).max(100).nullable(),
    taxTreatment: z.string().nullable(),
    allowedCosts: z.array(z.string()),
    excludedCosts: z.array(z.string()),
  })
  .strict();

const OfficialDateSchema = z.union([
  z.string().date(),
  z.string().datetime({ offset: true }),
]);

const CallSchema = z
  .object({
    id: z.string().min(1),
    instrumentId: z.string().min(1),
    name: z.string().min(1),
    institutionId: InstitutionIdSchema,
    territory: z.string().min(1),
    timezone: z.literal("America/Santiago"),
    opensAt: OfficialDateSchema,
    closesAt: OfficialDateSchema,
    schedulePrecision: z.enum(["date", "datetime"]),
    status: z.enum(["open", "scheduled", "closed", "verify"]),
    isReference: z.boolean(),
    supportType: z.enum([
      "non_refundable_subsidy",
      "cofinanced_subsidy",
      "credit",
      "state_guarantee",
      "tax_incentive",
      "training",
      "technical_assistance",
    ]),
    benefit: BenefitSchema,
    requirements: z.array(RequirementSchema).min(1),
    rules: z.array(RuleSchema),
    sourceIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const PilotCatalogSchema = z
  .object({
    version: z.literal("2026-09-01.pilot.2"),
    reviewedAt: z.literal("2026-09-01"),
    coverageNotice: z.string().min(1),
    institutions: z
      .array(
        z
          .object({
            id: InstitutionIdSchema,
            name: z.string().min(1),
            officialUrl: z.string().url(),
          })
          .strict(),
      )
      .length(3),
    instruments: z
      .array(
        z
          .object({
            id: z.string().min(1),
            institutionId: InstitutionIdSchema,
            name: z.string().min(1),
            description: z.string().min(1),
          })
          .strict(),
      )
      .length(3),
    sources: z.array(SourceSchema).min(3),
    calls: z.array(CallSchema).length(3),
  })
  .strict();

export type PilotCatalog = z.infer<typeof PilotCatalogSchema>;

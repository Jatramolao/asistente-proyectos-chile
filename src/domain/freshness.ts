import type { CallStatus } from "./types";

export type CatalogFreshness = {
  status: "recently_reviewed" | "review_due";
  reviewIntervalDays: 7 | 30;
  nextReviewAt: string;
};

function addUtcDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function assessCatalogFreshness(input: {
  reviewedAt: string;
  callStatuses: readonly CallStatus[];
  now: Date;
}): CatalogFreshness {
  const reviewIntervalDays = input.callStatuses.some((status) => status === "open" || status === "scheduled")
    ? 7
    : 30;
  const nextReviewAt = addUtcDays(input.reviewedAt, reviewIntervalDays);
  const today = input.now.toISOString().slice(0, 10);

  return {
    status: today <= nextReviewAt ? "recently_reviewed" : "review_due",
    reviewIntervalDays,
    nextReviewAt,
  };
}

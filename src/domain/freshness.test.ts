import { describe, expect, it } from "vitest";
import { assessCatalogFreshness } from "./freshness";

describe("assessCatalogFreshness", () => {
  it("requires weekly review while at least one call is open", () => {
    expect(assessCatalogFreshness({
      reviewedAt: "2026-08-24",
      callStatuses: ["open", "closed"],
      now: new Date("2026-09-01T12:00:00-04:00"),
    })).toMatchObject({ status: "review_due", reviewIntervalDays: 7 });
  });

  it("keeps a recently checked closed catalog current for 30 days", () => {
    expect(assessCatalogFreshness({
      reviewedAt: "2026-09-01",
      callStatuses: ["closed", "closed"],
      now: new Date("2026-09-20T12:00:00-03:00"),
    })).toEqual({
      status: "recently_reviewed",
      reviewIntervalDays: 30,
      nextReviewAt: "2026-10-01",
    });
  });
});

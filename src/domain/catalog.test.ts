import { describe, expect, it } from "vitest";
import { filterCatalog, getAvailability } from "./catalog";
import { loadCatalog } from "@/server/services/catalog";

const now = new Date("2026-09-02T18:00:00Z");
const calls = loadCatalog().calls;
const atacama = calls.find(c => c.id === "sercotec-modo-empleo-atacama-2026")!;

describe("catalogue availability and discovery", () => {
  it("uses the official Chile deadline across the September DST change", () => {
    const call = { ...atacama, editorial: { ...atacama.editorial, nextReviewAt: "2026-09-09" } };
    expect(getAvailability(call, new Date("2026-09-08T17:59:59Z"))).toBe("open");
    expect(getAvailability(call, new Date("2026-09-08T18:00:01Z"))).toBe("closed");
  });
  it("withdraws availability when editorial review expires", () => {
    expect(getAvailability(atacama, now)).toBe("open");
    expect(getAvailability(atacama, new Date("2026-09-04T12:00:00Z"))).toBe("verify");
    expect(getAvailability(atacama, new Date("2026-09-10T12:00:00Z"))).toBe("closed");
  });
  it("does not invent a deadline for an announced programme or ongoing service", () => {
    expect(getAvailability(calls.find(c => c.id === "corfo-build-programa")!, now)).toBe("announced");
    expect(getAvailability(calls.find(c => c.id === "sercotec-centros")!, now)).toBe("ongoing");
  });
  it("keeps national supports in regional results and unknown filters do not reject", () => {
    const results = filterCatalog(calls, { region: "metropolitana", availability: "all" }, now);
    expect(results.some(c => c.id === "sercotec-centros")).toBe(true);
    expect(results.some(c => c.id === atacama.id)).toBe(false);
    expect(filterCatalog(calls, { region: "unknown", stage: "unknown", goal: "unknown", availability: "all" }, now)).toHaveLength(calls.length);
  });
  it("keeps a date-only close through the entire local day", () => {
    const call = { ...atacama, closesAt: "2026-09-02", schedulePrecision: "date" as const };
    expect(getAvailability(call, new Date("2026-09-03T03:59:00Z"))).toBe("open");
    expect(getAvailability(call, new Date("2026-09-03T04:01:00Z"))).toBe("closed");
  });
});

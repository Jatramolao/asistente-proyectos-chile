// @vitest-environment node

import { describe, expect, it } from "vitest";
import { requireUserId } from "./session";

describe("requireUserId", () => {
  it("rejects an absent session", async () => {
    await expect(requireUserId(null)).rejects.toMatchObject({ code: "UNAUTHENTICATED" });
  });

  it("returns only the authenticated identifier", async () => {
    await expect(requireUserId({ user: { id: "user-1" } })).resolves.toBe("user-1");
  });
});

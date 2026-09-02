import { describe, expect, it, vi } from "vitest";
import { configurePersistentJournalMode } from "./core";

describe("configurePersistentJournalMode", () => {
  it("allows startup to continue when another process is configuring SQLite", () => {
    const pragma = vi.fn(() => {
      const error = new Error("database is locked") as Error & { code: string };
      error.code = "SQLITE_BUSY";
      throw error;
    });

    expect(() => configurePersistentJournalMode({ pragma })).not.toThrow();
    expect(pragma).toHaveBeenCalledWith("journal_mode = WAL");
  });

  it("does not hide unexpected SQLite configuration errors", () => {
    const failure = new Error("disk I/O error");
    const pragma = vi.fn(() => {
      throw failure;
    });

    expect(() => configurePersistentJournalMode({ pragma })).toThrow(failure);
  });
});

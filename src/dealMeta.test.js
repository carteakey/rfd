import { describe, expect, it } from "vitest";

import { formatDealAge, getFreshnessStatus } from "./dealMeta.js";

const NOW = Date.parse("2026-08-11T12:00:00Z");

describe("formatDealAge", () => {
  it("formats recent deals compactly", () => {
    expect(formatDealAge("2026-08-11T11:30:00Z", NOW)).toBe("<1h");
    expect(formatDealAge("2026-08-10T08:00:00Z", NOW)).toBe("1d");
  });

  it("formats month and year scale ages", () => {
    expect(formatDealAge("2026-06-01T12:00:00Z", NOW)).toBe("2mo");
    expect(formatDealAge("2024-01-11T12:00:00Z", NOW)).toBe("2y 7mo");
  });

  it("handles missing or invalid timestamps", () => {
    expect(formatDealAge(undefined, NOW)).toBe("—");
    expect(formatDealAge("not-a-date", NOW)).toBe("—");
  });
});

describe("getFreshnessStatus", () => {
  it("classifies fresh, active, aging, and stale activity", () => {
    expect(getFreshnessStatus("2026-08-11T11:00:00Z", NOW).key).toBe("fresh");
    expect(getFreshnessStatus("2026-08-07T12:00:00Z", NOW).key).toBe("active");
    expect(getFreshnessStatus("2026-07-20T12:00:00Z", NOW).key).toBe("aging");
    expect(getFreshnessStatus("2026-06-01T12:00:00Z", NOW).key).toBe("stale");
  });

  it("returns unknown when activity is unavailable", () => {
    expect(getFreshnessStatus(undefined, NOW)).toEqual({
      key: "unknown",
      label: "Unknown",
      icon: "help_outline",
      description: "No activity timestamp available",
    });
  });
});

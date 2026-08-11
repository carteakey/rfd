import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function makeStorage() {
  const data = Object.create(null);
  return {
    getItem: (key) => (Object.prototype.hasOwnProperty.call(data, key) ? data[key] : null),
    setItem: (key, value) => { data[key] = String(value); },
    removeItem: (key) => { delete data[key]; },
  };
}

const STORAGE_KEY = "rfd-archived-deals";

async function freshImport() {
  vi.resetModules();
  return import("./useArchivedDeals.js");
}

describe("useArchivedDeals", () => {
  let storage;

  beforeEach(() => {
    storage = makeStorage();
    vi.stubGlobal("localStorage", storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("archives and finds a deal by numeric or string ID", async () => {
    const { archiveDeal, isArchived } = await freshImport();
    archiveDeal(42);
    expect(isArchived(42)).toBe(true);
    expect(isArchived("42")).toBe(true);
  });

  it("persists and unarchives a deal", async () => {
    const { archiveDeal, unarchiveDeal } = await freshImport();
    archiveDeal(7);
    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toEqual(["7"]);
    unarchiveDeal(7);
    expect(JSON.parse(storage.getItem(STORAGE_KEY))).toEqual([]);
  });

  it("loads archived IDs and clears the archive", async () => {
    storage.setItem(STORAGE_KEY, JSON.stringify(["11", 22]));
    const { archived, clearArchived, isArchived } = await freshImport();
    expect(isArchived(11)).toBe(true);
    expect(isArchived(22)).toBe(true);
    clearArchived();
    expect(archived.value.size).toBe(0);
    expect(storage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("ignores invalid stored archive data", async () => {
    storage.setItem(STORAGE_KEY, "not-json");
    const { archived } = await freshImport();
    expect(archived.value.size).toBe(0);
  });
});

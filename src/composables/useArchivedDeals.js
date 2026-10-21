/**
 * Persistent archive state for deals the user wants out of the normal list.
 *
 * Storage format: JSON array of topic IDs
 * Key: rfd-archived-deals
 */

import { shallowRef, triggerRef } from "vue";

const STORAGE_KEY = "rfd-archived-deals";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map((id) => String(id)));
  } catch {
    return new Set();
  }
}

function persist(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // quota exceeded or private-browsing restriction — fail silently
  }
}

export const archived = shallowRef(load());

export function archiveDeal(id) {
  archived.value.add(String(id));
  persist(archived.value);
  triggerRef(archived);
}

export function unarchiveDeal(id) {
  archived.value.delete(String(id));
  persist(archived.value);
  triggerRef(archived);
}

export function isArchived(id) {
  return archived.value.has(String(id));
}

export function clearArchived() {
  archived.value.clear();
  triggerRef(archived);
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function useArchivedDeals() {
  return { archived, archiveDeal, unarchiveDeal, isArchived, clearArchived };
}

const HOUR_MS = 60 * 60 * 1000;

const FRESHNESS_LEVELS = [
  { key: "fresh", label: "Fresh", maxHours: 24, description: "Last activity within 24 hours" },
  { key: "active", label: "Active", maxHours: 7 * 24, description: "Last activity within 7 days" },
  { key: "aging", label: "Aging", maxHours: 30 * 24, description: "Last activity within 30 days" },
  { key: "stale", label: "Stale", maxHours: Infinity, description: "No activity in the last 30 days" },
];

function elapsedHours(dateString, now = Date.now()) {
  const timestamp = Date.parse(dateString || "");
  if (!Number.isFinite(timestamp)) return null;
  return Math.max(now - timestamp, 0) / HOUR_MS;
}

/** Returns a compact age from the original post time. */
export function formatDealAge(dateString, now = Date.now()) {
  const hours = elapsedHours(dateString, now);
  if (hours == null) return "—";
  if (hours < 1) return "<1h";
  if (hours < 24) return `${Math.floor(hours)}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  return `${years}y${remainingMonths ? ` ${remainingMonths}mo` : ""}`;
}

/** Classifies freshness from the last reply/activity timestamp. */
export function getFreshnessStatus(dateString, now = Date.now()) {
  const hours = elapsedHours(dateString, now);
  if (hours == null) {
    return {
      key: "unknown",
      label: "Unknown",
      description: "No activity timestamp available",
    };
  }

  return FRESHNESS_LEVELS.find((level) => hours <= level.maxHours);
}

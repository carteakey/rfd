const refreshUrl = process.env.RFD_REFRESH_URL ?? "http://rfd:8788/admin/refresh";
const refreshSecret = process.env.REFRESH_SECRET ?? "local";
const refreshIntervalSeconds = readPositiveInteger("RFD_REFRESH_INTERVAL_SECONDS", 600);
const retryIntervalSeconds = readPositiveInteger("RFD_REFRESH_RETRY_SECONDS", 30);

function readPositiveInteger(name, fallback) {
  const value = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function refresh() {
  try {
    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        authorization: `Bearer ${refreshSecret}`,
      },
      signal: AbortSignal.timeout(120000),
    });
    const body = await response.text();

    if (!response.ok) {
      console.error(`refresh failed (${response.status}): ${body}`);
      return false;
    }

    console.log(`refresh completed: ${body}`);
    return true;
  } catch (error) {
    console.error("refresh request failed:", error instanceof Error ? error.message : error);
    return false;
  }
}

let delaySeconds = 0;

while (true) {
  if (delaySeconds > 0) {
    await sleep(delaySeconds);
  }

  delaySeconds = (await refresh()) ? refreshIntervalSeconds : retryIntervalSeconds;
}

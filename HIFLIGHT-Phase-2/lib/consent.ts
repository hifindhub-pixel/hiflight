export const CONSENT_KEY = "hiflight-consent-v1";
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;
const CONSENT_DURATION_SECONDS = Math.floor(CONSENT_DURATION_MS / 1000);

export type ConsentChoice = "accepted" | "refused";

function readStoredValue() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) return stored;
  } catch {
    // Some privacy modes block localStorage. The essential consent cookie below
    // keeps the visitor's choice available in that case.
  }

  try {
    const prefix = `${CONSENT_KEY}=`;
    const cookie = document.cookie.split("; ").find((entry) => entry.startsWith(prefix));
    return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const saved = readStoredValue();
  if (!saved) return null;
  const [choice, timestampValue] = saved.split(":");
  const timestamp = Number(timestampValue);
  if ((choice !== "accepted" && choice !== "refused") || !Number.isFinite(timestamp) || Date.now() - timestamp > CONSENT_DURATION_MS) {
    return null;
  }
  return choice;
}

export function writeConsent(choice: ConsentChoice) {
  const value = `${choice}:${Date.now()}`;
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // The cookie fallback is sufficient when localStorage is unavailable.
  }
  try {
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(value)}; Max-Age=${CONSENT_DURATION_SECONDS}; Path=/; SameSite=Lax; Secure`;
  } catch {
    // The banner still closes for browsers that block every storage mechanism.
  }
}

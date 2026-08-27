export const CONSENT_KEY = "hiflight-consent-v1";
const CONSENT_DURATION_MS = 180 * 24 * 60 * 60 * 1000;

export type ConsentChoice = "accepted" | "refused";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem(CONSENT_KEY);
  if (!saved) return null;
  const [choice, timestampValue] = saved.split(":");
  const timestamp = Number(timestampValue);
  if ((choice !== "accepted" && choice !== "refused") || !Number.isFinite(timestamp) || Date.now() - timestamp > CONSENT_DURATION_MS) {
    return null;
  }
  return choice;
}

export function writeConsent(choice: ConsentChoice) {
  localStorage.setItem(CONSENT_KEY, `${choice}:${Date.now()}`);
}

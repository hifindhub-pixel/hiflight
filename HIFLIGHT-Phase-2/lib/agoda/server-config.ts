import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

type AgodaBindings = {
  AGODA_ENABLED?: string;
  AGODA_AUTH?: string;
  AGODA_CATALOGUE?: { get(key: string): Promise<{ json<T>(): Promise<T> } | null> };
  AGODA_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
};
export function agodaBindings(): AgodaBindings {
  if (process.env.NODE_ENV === 'development') return process.env as AgodaBindings;
  try { return getCloudflareContext().env as AgodaBindings; }
  catch { return {}; }
}
export function agodaEnabled() {
  return process.env.NODE_ENV === 'development' || agodaBindings().AGODA_ENABLED === 'true';
}
export async function allowAgodaSearch(request: Request) {
  if (process.env.NODE_ENV === 'development') return true;
  const limiter = agodaBindings().AGODA_RATE_LIMITER;
  // Fail closed if preview protection has not been configured.
  if (!limiter) throw new Error('Missing Agoda rate limiter');
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip) return false;
  return (await limiter.limit({ key: `agoda:${ip}` })).success;
}

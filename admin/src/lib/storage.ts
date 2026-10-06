import type { PortalData, Account } from '@/types/admin';

const PORTAL_KEY = 'ecec_admin_portal';
const SESSION_KEY = 'ecec_admin_session';

export function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const portalStorage = {
  load: () => readJSON<PortalData>(PORTAL_KEY),
  save: (data: PortalData) => writeJSON(PORTAL_KEY, data),
  clear: () => localStorage.removeItem(PORTAL_KEY),
};

export const sessionStorage = {
  get: () => readJSON<Account>(SESSION_KEY),
  set: (user: Account) => writeJSON(SESSION_KEY, user),
  clear: () => localStorage.removeItem(SESSION_KEY),
};
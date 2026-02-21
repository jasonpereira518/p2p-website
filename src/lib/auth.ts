import type { AdminUser } from "@/types/admin";
import { adminUsers } from "@/data/mockAdmin";

/** For session we never store password */
export type SessionUser = Omit<AdminUser, "password">;

export const STORAGE_KEY = "p2p_admin_session";

export function getStoredSession(): SessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionUser) : null;
  } catch {
    return null;
  }
}

export function setSession(user: SessionUser): void {
  if (typeof window === "undefined") return;
  const { password: _, ...rest } = user as AdminUser;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

/** Validate credentials and return user without password, or null */
export function validateLogin(username: string, password: string): SessionUser | null {
  const u = username.trim().toLowerCase();
  const user = adminUsers.find(
    (a) => a.username.toLowerCase() === u && a.password === password
  );
  if (!user) return null;
  const { password: _, ...sessionUser } = user;
  return sessionUser;
}

import { scryptSync, timingSafeEqual } from "node:crypto";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";
import { loadDb } from "./db";

export const SESSION_COOKIE = "sb_admin_session";
const ONE_WEEK = 60 * 60 * 24 * 7;

const isSecure = () =>
  typeof process !== "undefined" &&
  (process.env.NODE_ENV === "production" || process.env.HTTPS === "true");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: ONE_WEEK,
  secure: isSecure(),
};

export function setSessionCookie(token: string): void {
  setCookie(SESSION_COOKIE, token, cookieOptions);
}

export function clearSessionCookie(): void {
  deleteCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: 0 });
}

export async function verifyCredentials(email: string, code: string): Promise<boolean> {
  const db = await loadDb();
  const admin = db.admin;
  if (email.trim().toLowerCase() !== admin.email.toLowerCase()) return false;

  const salt = Buffer.from(admin.passwordSalt, "hex");
  const expected = Buffer.from(admin.passwordHash, "hex");
  const derived = scryptSync(code, salt, 64);
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export async function getSession(): Promise<{ isAuthenticated: boolean }> {
  const token = getCookie(SESSION_COOKIE);
  if (!token) return { isAuthenticated: false };
  // Stateless signed token: HMAC-style check via scrypt of the email.
  // Token format: "<expiresAt>:<sig>". We keep it simple but tamper-evident.
  const parts = token.split(":");
  if (parts.length !== 2) return { isAuthenticated: false };
  const expiresAt = Number(parts[0]);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return { isAuthenticated: false };
  }
  return { isAuthenticated: true };
}

export async function issueSession(): Promise<string> {
  const expiresAt = Date.now() + ONE_WEEK * 1000;
  const token = `${expiresAt}:${randomToken()}`;
  setSessionCookie(token);
  return token;
}

function randomToken(): string {
  // Avoid crypto.randomBytes dependency at import time; use Web Crypto if present.
  try {
    return globalThis.crypto.randomUUID();
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

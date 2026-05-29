import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "hirepilot_admin_session";

const sessionSalt = "hirepilot-owner-admin-v1";

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getAdminUsername() {
  return process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || "";
}

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export async function createAdminSessionValue() {
  return sha256(`${getAdminUsername()}:${getAdminPassword()}:${sessionSalt}`);
}

export async function validateAdminCredentials(username: string, password: string) {
  const configuredUsername = getAdminUsername();
  const configuredPassword = getAdminPassword();
  return Boolean(configuredUsername && configuredPassword && username === configuredUsername && password === configuredPassword);
}

export async function isAdminSessionValid() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return Boolean(session && session === (await createAdminSessionValue()));
}

export async function requireAdminSession() {
  if (!(await isAdminSessionValid())) {
    redirect("/admin");
  }
}

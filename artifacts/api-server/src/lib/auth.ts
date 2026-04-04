import { createHash, randomBytes } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const computed = createHash("sha256")
    .update(password + salt)
    .digest("hex");
  return computed === hash;
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

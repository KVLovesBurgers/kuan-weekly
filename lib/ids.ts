import { randomBytes, randomUUID } from "node:crypto";

export function uid(prefix?: string) {
  const id = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

export function token(bytes = 24) {
  return randomBytes(bytes).toString("hex");
}

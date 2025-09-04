import { nanoid } from "nanoid";
import dayjs from "dayjs";
import { Repo } from "./repo";

export function generateCode(custom) {
  if (custom) {
    if (Repo.codeExists(custom)) {
      throw new Error("Shortcode already exists!");
    }
    return custom;
  }
  let code;
  do {
    code = nanoid(6);
  } while (Repo.codeExists(code));
  return code;
}

export function addMinutes(dateISO, minutes) {
  return dayjs(dateISO).add(minutes, "minute").toISOString();
}

export function isExpired(expiryISO) {
  return dayjs().isAfter(dayjs(expiryISO));
}

export function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

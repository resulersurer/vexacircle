import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

const TIMEZONE = "Europe/Istanbul";

function toIstanbul(date: Date | string | number): Date {
  return toZonedTime(new Date(date), TIMEZONE);
}

export function formatDateTR(date: Date | string | number): string {
  return format(toIstanbul(date), "d MMMM yyyy", { locale: tr });
}

export function formatDateShortTR(date: Date | string | number): string {
  return format(toIstanbul(date), "dd.MM.yyyy");
}

export function formatTimeTR(date: Date | string | number): string {
  return format(toIstanbul(date), "HH:mm");
}

export function formatDateTimeTR(date: Date | string | number): string {
  return format(toIstanbul(date), "d MMMM yyyy HH:mm", { locale: tr });
}

import { defineRouting } from "next-intl/routing";
import { getRequestConfig } from "next-intl/server";
import createMiddleware from "next-intl/middleware";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: {
    mode: "always",
  },
});

export const intlMiddleware = createMiddleware(routing);

export type Locale = (typeof routing.locales)[number];

export default getRequestConfig(async () => {
  const locale = routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: "Europe/Istanbul",
    formats: {
      number: {
        currency: {
          style: "currency",
          currency: "TRY",
          currencyDisplay: "symbol",
        },
      },
    },
  };
});

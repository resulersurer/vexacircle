import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "VEXA Circle - Topluluklar ve Bağlantılar",
  description:
    "Yeni insanlarla tanış, topluluklara katıl ve ilgi alanlarınla ortak noktalar bul. VEXA Circle, Türkiye'nin sosyal keşif platformu.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

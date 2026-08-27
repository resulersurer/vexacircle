"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("login");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/tr" className="inline-flex items-center gap-2 text-foreground">
            <span className="text-xl font-bold text-primary">VEXA</span>
            <span className="text-sm font-normal text-muted-foreground">Circle</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card className="p-6">
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Input label={t("email")} type="email" placeholder="ornek@eposta.com" />
            <Input label={t("password")} type="password" />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                Beni hatırla
              </label>
              <Link href="/tr/sifremi-unuttum" className="text-xs text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <Button type="submit" className="w-full">
              {t("submit")}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">
                {t("orContinueWith")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              {t("google")}
            </Button>
            <Button variant="outline" className="w-full">
              {t("apple")}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {t("noAccount")}{" "}
            <Link href="/tr/kayit" className="font-medium text-primary hover:underline">
              {t("register")}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

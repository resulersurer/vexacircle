"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();

  const [form, setForm] = React.useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!form.email.trim()) {
      next.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("errors.emailInvalid");
    }

    if (!form.password) {
      next.password = t("errors.passwordRequired");
    }

    return next;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const response = await fetch(`/${locale}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || t("errors.generic") });
        setSubmitting(false);
        return;
      }

      router.push(`/${locale}/kesfet`);
    } catch {
      setErrors({ general: t("errors.generic") });
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-foreground">
            <span className="text-xl font-bold text-primary">VEXA</span>
            <span className="text-sm font-normal text-muted-foreground">Circle</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>

        <Card className="p-6">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label={t("email")}
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label={t("password")}
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(event) =>
                    setForm({ ...form, rememberMe: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                {t("rememberMe")}
              </label>
              <Link href={`/${locale}/sifremi-unuttum`} className="text-xs text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>

            {errors.general ? (
              <p className="text-xs text-destructive">{errors.general}</p>
            ) : null}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "..." : t("submit")}
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
            <Link href={`/${locale}/kayit`} className="font-medium text-primary hover:underline">
              {t("register")}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

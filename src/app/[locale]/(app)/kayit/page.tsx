"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterPage() {
  const t = useTranslations("register");
  const router = useRouter();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!form.name.trim()) {
      next.name = t("errors.nameRequired");
    }

    if (!form.email.trim()) {
      next.email = t("errors.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("errors.emailInvalid");
    }

    if (!form.password) {
      next.password = t("errors.passwordRequired");
    } else if (form.password.length < 8) {
      next.password = t("errors.passwordMin");
    }

    if (form.password !== form.confirmPassword) {
      next.confirmPassword = t("errors.passwordMismatch");
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
      const response = await fetch("/tr/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.error || t("errors.general") });
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/tr/onboarding");
      }, 600);
    } catch {
      setErrors({ general: t("errors.generic") });
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-sm p-6 text-center">
          <p className="text-sm text-muted-foreground">Hesabın oluşturuldu. Yönlendiriliyorsun...</p>
        </Card>
      </div>
    );
  }

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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              label={t("name")}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              error={errors.name}
              autoComplete="name"
            />
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
              autoComplete="new-password"
            />
            <Input
              label={t("confirmPassword")}
              type="password"
              value={form.confirmPassword}
              onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="h-4 w-4 rounded border-border accent-primary" />
              {t("terms")}
            </label>

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
            {t("hasAccount")}{" "}
            <Link href="/tr/giris" className="font-medium text-primary hover:underline">
              {t("login")}
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INTERESTS = [
  "technology",
  "software",
  "entrepreneurship",
  "travel",
  "football",
  "sports",
  "fitness",
  "gaming",
  "photography",
  "coffee",
  "investment",
  "music",
  "cinema",
  "books",
  "automotive",
  "ai",
  "science",
  "design",
  "marketing",
  "business",
] as const;

const GOALS = [
  "makeNewFriends",
  "buildProfessionalNetwork",
  "findBusinessPartner",
  "findTravelBuddy",
  "findSportsBuddy",
  "findGamingFriends",
  "joinEvents",
  "learnNewThings",
] as const;

export default function OnboardingPage() {
  const t = useTranslations();
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>([]);
  const [goal, setGoal] = React.useState<string>("");

  const toggleInterest = (value: string) => {
    setSelectedInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const canContinue =
    step === 1 ? selectedInterests.length >= 3 : step === 2 ? Boolean(goal) : true;

  const handleNext = () => {
    if (step === 2) {
      router.push("/tr/kesfet");
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            {[0, 1, 2].map((s) => (
              <div
                key={s}
                className={[
                  "h-2 rounded-full transition-all",
                  s <= step ? "w-8 bg-primary" : "w-8 bg-muted",
                ].join(" ")}
              />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {step === 0 && t("onboarding.welcomeTitle")}
            {step === 1 && t("onboarding.step1Title")}
            {step === 2 && t("onboarding.step2Title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === 0 && t("onboarding.welcomeSubtitle")}
            {step === 1 && t("onboarding.step1Subtitle")}
            {step === 2 && t("onboarding.step2Subtitle")}
          </p>
        </div>

        <Card className="p-6">
          {step === 0 && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Kişiselleştirilmiş topluluk önerileri almak için birkaç adımı tamamla.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const active = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={[
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:border-primary/50",
                    ].join(" ")}
                  >
                    {t(`interests.${interest}`)}
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={[
                    "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    goal === g
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-background hover:border-primary/50",
                  ].join(" ")}
                >
                  {t(`onboarding.${g}`)}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              disabled={step === 0}
            >
              {t("onboarding.back")}
            </Button>
            <Button onClick={handleNext} disabled={!canContinue}>
              {step === 2 ? t("onboarding.finish") : t("onboarding.continue")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

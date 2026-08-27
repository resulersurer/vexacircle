"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const t = useTranslations("profile");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("title", { default: "Profil" })}</h1>
        <Button variant="ghost" size="sm">
          {t("editProfile", { default: "Düzenle" })}
        </Button>
      </div>
      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar fallback="RE" className="h-16 w-16 text-lg" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">Resul Ersürer</h2>
              <p className="text-sm text-muted-foreground">@resulersurer</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Yazılım geliştirici, girişimci ve açık kaynak tutkunu.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">Yazılım</Badge>
            <Badge variant="secondary">Yapay Zeka</Badge>
            <Badge variant="secondary">Girişimcilik</Badge>
            <Badge variant="secondary">Seyahat</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">{t("circlesCount", { default: "Topluluklar" })}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">12</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">{t("connectionsCount", { default: "Bağlantılar" })}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">48</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">{t("postsCount", { default: "Gönderiler" })}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">7</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">{t("joinedDays", { default: "Katılım Süresi" })}</h3>
            <p className="mt-1 text-2xl font-bold text-foreground">3 gün</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  const t = useTranslations("settings");

  return (
    <div className="flex flex-1 flex-col">
      <div className="pb-6">
        <h1 className="text-2xl font-bold text-foreground">{t("title", { default: "Ayarlar" })}</h1>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-foreground">{t("profile", { default: "Profil" })}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("profileDesc", { default: "Hesap bilgilerini ve profilini düzenle." })}
            </p>
            <div className="mt-4 flex flex-col gap-4">
              <Input label={t("name", { default: "Ad Soyad" })} defaultValue="Resul Ersürer" />
              <Input label={t("username", { default: "Kullanıcı Adı" })} defaultValue="@resulersurer" />
              <Input label={t("bio", { default: "Hakkımda" })} defaultValue="Yazılım geliştirici, girişimci ve açık kaynak tutkunu." />
            </div>
            <div className="mt-6 flex justify-end">
              <Button>{t("save", { default: "Kaydet" })}</Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-foreground">{t("notifications", { default: "Bildirimler" })}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("notificationsDesc", { default: "Bildirim tercihlerini ayarla." })}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              {["push", "email", "sms"].map((channel) => (
                <label key={channel} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">
                    {t(`channels.${channel}`, { default: channel })}
                  </span>
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border accent-primary" />
                </label>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-base font-semibold text-destructive">{t("dangerZone", { default: "Tehlikeli Bölge" })}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("dangerZoneDesc", { default: "Hesabını kalıcı olarak sil." })}
            </p>
            <div className="mt-4">
              <Button variant="destructive">{t("deleteAccount", { default: "Hesabı Sil" })}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

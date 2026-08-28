import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getCircles } from "@/lib/app-data";
import { createCircle, toggleCircleMembership } from "./actions";

export const dynamic = "force-dynamic";

type CirclesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CirclesPage({ params }: CirclesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("circles");
  const user = await getCurrentUser();
  const { circles, joinedIds, unavailable } = await getCircles(user?.id);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("title", { default: "Topluluklar" })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            İlgi alanlarına göre toplulukları keşfet, katıl ve akışını büyüt.
          </p>
        </div>

        {unavailable ? (
          <Card className="mb-4 border-destructive/30 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-foreground">Topluluk verileri yüklenemedi.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Veritabanı bağlantısı geldiğinde liste otomatik güncellenecek.
            </p>
          </Card>
        ) : null}

        <div className="flex flex-col gap-4">
          {circles.length > 0 ? (
            circles.map((circle) => {
              const joined = joinedIds.has(circle.id);
              const tags = circle.tags.split(",").map((tag) => tag.trim()).filter(Boolean);

              return (
                <Card key={circle.id} className="transition-colors hover:bg-accent/40">
                  <div className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold text-foreground">{circle.name}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {circle.description}
                        </p>
                      </div>
                      <form action={toggleCircleMembership}>
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="circleId" value={circle.id} />
                        <Button variant={joined ? "outline" : "primary"} size="sm">
                          {joined
                            ? t("leaveCircle", { default: "Ayrıl" })
                            : t("join", { default: "Katıl" })}
                        </Button>
                      </form>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {circle.memberCount.toLocaleString("tr-TR")} üye
                    </p>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm font-medium text-foreground">Henüz topluluk yok.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                İlk topluluğu oluşturup bu sayfayı canlandırabilirsin.
              </p>
            </Card>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-foreground">
            {t("create", { default: "Yeni Topluluk" })}
          </h2>
          <form action={createCircle} className="mt-4 grid gap-3">
            <input type="hidden" name="locale" value={locale} />
            <input
              name="name"
              required
              maxLength={80}
              placeholder="Topluluk adı"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
            <textarea
              name="description"
              required
              maxLength={280}
              rows={4}
              placeholder="Kısa açıklama"
              className="min-h-24 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-ring"
            />
            <input
              name="tags"
              maxLength={120}
              placeholder="Etiketler: teknoloji, tasarım"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" disabled={!user}>
              Oluştur
            </Button>
            {!user ? (
              <p className="text-xs text-muted-foreground">Topluluk oluşturmak için giriş yapmalısın.</p>
            ) : null}
          </form>
        </Card>
      </aside>
    </div>
  );
}

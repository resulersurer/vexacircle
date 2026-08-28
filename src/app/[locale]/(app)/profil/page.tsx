import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfileStats } from "@/lib/app-data";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

function handleFromEmail(email?: string | null) {
  const name = email?.split("@")[0]?.replace(/[^a-z0-9._-]/gi, "");
  return name ? `@${name}` : "@vexa";
}

export default async function ProfilePage() {
  const t = await getTranslations("profile");
  const user = await getCurrentUser();
  const stats = await getProfileStats(user?.id);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-6">
        <h1 className="text-2xl font-bold text-foreground">
          {t("title", { default: "Profil" })}
        </h1>
        <Button variant="ghost" size="sm">
          {t("editProfile", { default: "Düzenle" })}
        </Button>
      </div>

      <Card className="mb-6">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Avatar
              fallback={user?.name || "Kullanıcı"}
              src={user?.image ?? undefined}
              className="h-16 w-16 text-lg"
            />
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {user?.name ?? "Misafir kullanıcı"}
              </h2>
              <p className="text-sm text-muted-foreground">{handleFromEmail(user?.email)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.email ?? "Profil bilgilerini görmek için giriş yap."}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary">VEXA Circle</Badge>
            <Badge variant="secondary">Topluluk</Badge>
            <Badge variant="secondary">Keşif</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("circlesCount", { default: "Topluluklar" })}
            </h3>
            <p className="mt-1 text-2xl font-bold text-foreground">{stats.circles}</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("connectionsCount", { default: "Bağlantılar" })}
            </h3>
            <p className="mt-1 text-2xl font-bold text-foreground">{stats.connections}</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("postsCount", { default: "Gönderiler" })}
            </h3>
            <p className="mt-1 text-2xl font-bold text-foreground">{stats.posts}</p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("joinedDays", { default: "Katılım Süresi" })}
            </h3>
            <p className="mt-1 text-2xl font-bold text-foreground">{user ? "Bugün" : "-"}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

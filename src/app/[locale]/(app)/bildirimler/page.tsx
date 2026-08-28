import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getNotifications } from "@/lib/app-data";
import { markNotificationRead } from "./actions";
import { MarkReadButton } from "./submit-button";

export const dynamic = "force-dynamic";

type NotificationsPageProps = {
  params: Promise<{ locale: string }>;
};

function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: tr });
}

export default async function NotificationsPage({ params }: NotificationsPageProps) {
  const { locale } = await params;
  const t = await getTranslations("navigation");
  const user = await getCurrentUser();
  const { notifications, unavailable } = await getNotifications(user?.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("notifications")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Topluluk, mesaj ve akış hareketlerini burada takip et.
        </p>
      </div>

      {unavailable ? (
        <Card className="mb-4 border-destructive/30 bg-destructive/5 p-5">
          <p className="text-sm font-medium text-foreground">Bildirimler yüklenemedi.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Veritabanı bağlantısı geldiğinde bildirimler burada görünecek.
          </p>
        </Card>
      ) : null}

      <div className="flex flex-col gap-3">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={notification.read ? "p-5 opacity-75" : "border-primary/40 bg-primary/5 p-5"}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-foreground">{notification.title}</h2>
                    <Badge variant={notification.read ? "outline" : "default"}>
                      {notification.read ? "Okundu" : "Yeni"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {relativeTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{notification.body}</p>
                </div>
                {!notification.read ? (
                  <form action={markNotificationRead}>
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="notificationId" value={notification.id} />
                    <MarkReadButton />
                  </form>
                ) : null}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm font-medium text-foreground">Henüz bildirimin yok.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Yeni etkileşimler ve sistem duyuruları burada görünecek.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

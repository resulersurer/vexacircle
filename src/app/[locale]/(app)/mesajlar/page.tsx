import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth/session";
import { getConversations } from "@/lib/app-data";
import { sendMessage } from "./actions";

export const dynamic = "force-dynamic";

type MessagesPageProps = {
  params: Promise<{ locale: string }>;
};

function relativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, locale: tr });
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = await params;
  const t = await getTranslations("messages");
  const user = await getCurrentUser();
  const { conversations, latestMessages, unavailable } = await getConversations();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="min-w-0">
        <div className="pb-4">
          <h1 className="text-2xl font-bold text-foreground">
            {t("title", { default: "Mesajlar" })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aktif konuşmaları ve son mesajları buradan takip et.
          </p>
        </div>

        {unavailable ? (
          <Card className="mb-4 border-destructive/30 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-foreground">Mesajlar yüklenemedi.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Veritabanı bağlantısı geldiğinde konuşmalar burada görünecek.
            </p>
          </Card>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-border">
          {conversations.length > 0 ? (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                className="flex w-full items-center gap-4 border-b border-border bg-background px-4 py-4 text-left transition-colors last:border-b-0 hover:bg-accent/40"
              >
                <Avatar
                  fallback={conversation.title}
                  src={conversation.image ?? undefined}
                  className="h-12 w-12"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {conversation.title}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {relativeTime(conversation.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">
                    {latestMessages.get(conversation.id) ?? "Henüz mesaj yok."}
                  </p>
                </div>
                {conversation.unreadCount > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                    {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="bg-background p-8 text-center">
              <p className="text-sm font-medium text-foreground">Henüz konuşma yok.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                İlk mesajını gönderince burada bir konuşma oluşacak.
              </p>
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Hızlı Mesaj</h2>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <form action={sendMessage} className="mt-4 grid gap-3">
            <input type="hidden" name="locale" value={locale} />
            <textarea
              name="body"
              required
              maxLength={500}
              rows={5}
              placeholder="Kısa bir mesaj yaz..."
              className="min-h-28 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition focus:ring-2 focus:ring-ring"
            />
            <Button type="submit" disabled={!user}>
              Gönder
            </Button>
            {!user ? (
              <p className="text-xs text-muted-foreground">Mesaj göndermek için giriş yapmalısın.</p>
            ) : null}
          </form>
        </Card>
      </aside>
    </div>
  );
}

import { desc } from "drizzle-orm";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db/neon";
import { posts } from "@/lib/db/schema";
import { createPost } from "./actions";
import { SubmitButton } from "./submit-button";

export const dynamic = "force-dynamic";

type DiscoverPageProps = {
  params: Promise<{ locale: string }>;
};

type DiscoverPost = typeof posts.$inferSelect;

async function getDiscoverPosts(): Promise<{
  posts: DiscoverPost[];
  unavailable: boolean;
}> {
  if (!db) {
    return { posts: [], unavailable: true };
  }

  try {
    const items = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(30);
    return { posts: items, unavailable: false };
  } catch (error) {
    console.error("Discover posts query failed:", error);
    return { posts: [], unavailable: true };
  }
}

function relativeTime(date: Date) {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: tr,
  });
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-lg font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ActionIcon({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground">
      {children}
      {label}
    </span>
  );
}

export default async function DiscoverPage({ params }: DiscoverPageProps) {
  const { locale } = await params;
  const t = await getTranslations("discover");
  const { posts: discoverPosts, unavailable } = await getDiscoverPosts();

  const totalLikes = discoverPosts.reduce((total, post) => total + post.likes, 0);
  const activeAuthors = new Set(discoverPosts.map((post) => post.authorHandle)).size;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t("title", { default: "Keşfet" })}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Topluluktaki yeni fikirleri, buluşmaları ve çağrıları takip et.
            </p>
          </div>
          <Badge>Canlı akış</Badge>
        </div>

        <Card className="mb-5">
          <form action={createPost} className="p-5">
            <input type="hidden" name="locale" value={locale} />
            <div className="flex items-start gap-3">
              <Avatar fallback="Sen" className="h-10 w-10" />
              <div className="grid min-w-0 flex-1 gap-3">
                <div className="grid gap-3">
                  <input
                    name="title"
                    required
                    maxLength={120}
                    placeholder="Başlık"
                    className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                  />
                </div>
                <textarea
                  name="body"
                  required
                  maxLength={500}
                  rows={4}
                  placeholder="Bugün ne paylaşmak istersin?"
                  className="min-h-28 resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">500 karaktere kadar</span>
                  <SubmitButton pendingLabel="Paylaşılıyor...">Paylaş</SubmitButton>
                </div>
              </div>
            </div>
          </form>
        </Card>

        {unavailable ? (
          <Card className="mb-5 border-destructive/30 bg-destructive/5 p-5">
            <p className="text-sm font-medium text-foreground">Akış şu anda veritabanına bağlanamıyor.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Production ortamında tablo oluşturulduktan sonra gönderiler burada listelenir.
            </p>
          </Card>
        ) : null}

        <div className="flex flex-col gap-4">
          {discoverPosts.length > 0 ? (
            discoverPosts.map((post) => (
              <Card key={post.id} className="transition-colors hover:bg-accent/40">
                <article className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar
                      fallback={post.authorName}
                      src={post.authorImage ?? undefined}
                      className="h-10 w-10"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-foreground">{post.authorName}</span>
                        <span className="text-xs text-muted-foreground">{post.authorHandle}</span>
                        <span className="text-xs text-muted-foreground">
                          {relativeTime(post.createdAt)}
                        </span>
                      </div>
                      <h2 className="mt-3 text-base font-semibold text-foreground">{post.title}</h2>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">{post.body}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-6 pl-[52px]">
                    <ActionIcon label={String(post.likes)}>
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 10v12" />
                        <path d="M15 5.88 14 10h5.38a2 2 0 0 1 1.89 2.68l-1.66 7.03a2 2 0 0 1-1.89 1.68H6.38a2 2 0 0 1-1.89-1.68L3.38 12.68A2 2 0 0 1 5.26 10H10" />
                      </svg>
                    </ActionIcon>
                    <ActionIcon label={String(post.comments)}>
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </ActionIcon>
                    <ActionIcon label={t("share", { default: "Paylaş" })}>
                      <svg
                        aria-hidden="true"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" x2="12" y1="2" y2="15" />
                      </svg>
                    </ActionIcon>
                  </div>
                </article>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <p className="text-sm font-medium text-foreground">Henüz gönderi yok.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                İlk paylaşımı yap ve keşfet akışını başlat.
              </p>
            </Card>
          )}
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-foreground">Akış Özeti</h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <Stat label="Gönderi" value={discoverPosts.length} />
            <Stat label="Kişi" value={activeAuthors} />
            <Stat label="Beğeni" value={totalLikes} />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-foreground">Gündem</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>Teknoloji</Badge>
            <Badge>Etkinlik</Badge>
            <Badge>Girişimcilik</Badge>
            <Badge>Seyahat</Badge>
          </div>
        </Card>
      </aside>
    </div>
  );
}

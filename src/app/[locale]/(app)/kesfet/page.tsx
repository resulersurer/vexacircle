import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const MOCK_POSTS = [
  {
    id: 1,
    author: "Ayşe Yılmaz",
    handle: "@ayse",
    avatar: null,
    time: "2 saat önce",
    title: "Bu hafta sonu etkinliğimiz var!",
    body: "İstanbul'da buluşmak üzereyiz. Katılım ücretsiz, yer sayısı sınırlı.",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    author: "Mehmet Demir",
    handle: "@mehmet",
    avatar: null,
    time: "5 saat önce",
    title: "Yeni bir proje başlatıyorum",
    body: "Yapay zeka destekli bir eğitim platformu üzerine çalışıyorum. Ortaklar arıyorum.",
    likes: 56,
    comments: 12,
  },
  {
    id: 3,
    author: "Zeynep Kaya",
    handle: "@zeynep",
    avatar: null,
    time: "Dün",
    title: "Fotoğrafçılık turu",
    body: "Balat sokaklarında düzenlediğimiz fotoğrafçılık turuna 20 kişi katıldı. Harika bir gün!",
    likes: 89,
    comments: 23,
  },
];

export default function DiscoverPage() {
  const t = useTranslations("discover");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("title", { default: "Keşfet" })}</h1>
        <Button variant="outline" size="sm">
          {t("filter", { default: "Filtrele" })}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {MOCK_POSTS.map((post) => (
          <Card key={post.id} className="cursor-pointer transition-colors hover:bg-accent/40">
            <div className="p-5">
              <div className="flex items-center gap-3">
                <Avatar fallback={post.author} className="h-10 w-10" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{post.author}</span>
                    <span className="text-xs text-muted-foreground">{post.handle}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{post.body}</p>
              </div>
              <div className="mt-4 flex items-center gap-6">
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                  {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  {t("share", { default: "Paylaş" })}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

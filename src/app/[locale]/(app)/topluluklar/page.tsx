import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CIRCLES = [
  {
    id: 1,
    name: "Yazılım Geliştiriciler",
    members: 1240,
    description: "Türkiye'den yazılım geliştiricileri, tasarımcılar ve ürün yöneticileri.",
    tags: ["software", "technology"],
    joined: false,
  },
  {
    id: 2,
    name: "Seyahat Tutkunları",
    members: 890,
    description: "Yeni yerler keşfetmek ve seyahat hikayeleri paylaşmak için.",
    tags: ["travel"],
    joined: true,
  },
  {
    id: 3,
    name: "Girişimcilik Kulübü",
    members: 560,
    description: "Girişim fikirleri, yatırım ve networking.",
    tags: ["entrepreneurship", "business"],
    joined: false,
  },
  {
    id: 4,
    name: "Fotoğrafçılar",
    members: 430,
    description: "Kamera, kompozisyon ve düzenleme üzerine paylaşımlar.",
    tags: ["photography"],
    joined: false,
  },
];

export default function CirclesPage() {
  const t = useTranslations("circles");
  const tInterests = useTranslations("interests");

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("title", { default: "Topluluklar" })}</h1>
        <Button variant="outline" size="sm">
          {t("create", { default: "Yeni Topluluk" })}
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        {CIRCLES.map((circle) => (
          <Card key={circle.id} className="transition-colors hover:bg-accent/40">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{circle.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{circle.description}</p>
                </div>
                <Button variant={circle.joined ? "outline" : "primary"} size="sm">
                  {circle.joined ? t("leaveCircle", { default: "Ayrıl" }) : t("join", { default: "Katıl" })}
                </Button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {circle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tInterests(tag)}</Badge>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {circle.members.toLocaleString("tr-TR")} üye
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

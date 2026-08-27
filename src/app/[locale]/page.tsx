import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function HomePage() {
  const t = useTranslations("landing");

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/tr" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-xl font-bold text-primary">VEXA</span>
            <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
              Circle
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/tr/giris">
              <Button variant="ghost" size="sm">
                Giriş Yap
              </Button>
            </Link>
            <Link href="/tr/kayit">
              <Button size="sm">Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              İlgi alanlarınla ortak noktalar bul.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              VEXA Circle ile yeni insanlarla tanış, topluluklara katıl ve paylaşım
              ortamına dahil ol. Sadece seninle aynı dünyaya sahip olanları bul.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/tr/kayit">
                <Button size="lg" className="px-8">
                  Hemen Başla
                </Button>
              </Link>
              <Link href="/tr/kesfet">
                <Button variant="outline" size="lg" className="px-8">
                  Keşfet
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </section>

      <section className="border-t border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nasıl çalışır?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sadece birkaç adımda topluluklara katıl ve paylaşıma başla.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "İlgi alanlarını seç",
                desc: "Sana en uygun toplulukları bulabilmemiz için ilgi alanlarını belirle.",
              },
              {
                title: "Topluluklara katıl",
                desc: "Beğendiğin topluluklara katıl, üyelerle tanış ve tartışmalara dahil ol.",
              },
              {
                title: "Paylaş ve etkileşim kur",
                desc: "Gönderiler paylaş, yorum yap ve bağlantılarını genişlet.",
              },
            ].map((step, index) => (
              <Card key={index} className="h-full">
                <div className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <span className="text-sm font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {step.desc}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Topluluklar seni bekliyor.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Yeni insanlarla tanışmak için en iyi zaman şimdi.
            </p>
            <div className="mt-10">
              <Link href="/tr/kayit">
                <Button size="lg" className="px-10">
                  Hesap Oluştur
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

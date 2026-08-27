"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

type HeaderProps = {
  user?: {
    name?: string | null;
    image?: string | null;
  };
};

export function Header({ user }: HeaderProps) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/tr" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-xl font-bold text-primary">VEXA</span>
            <span className="hidden text-sm font-normal text-muted-foreground sm:inline">
              Circle
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/tr/kesfet"
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive("/tr/kesfet")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t("discover")}
            </Link>
            <Link
              href="/tr/topluluklar"
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive("/tr/topluluklar")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t("circles")}
            </Link>
            <Link
              href="/tr/mesajlar"
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive("/tr/mesajlar")
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {t("messages")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/tr/bildirimler">
            <Button variant="ghost" size="icon" className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </Link>
          <Link href="/tr/profil">
            {user?.image ? (
              <img
                alt={user.name || "Profil"}
                src={user.image}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <Avatar fallback={user?.name || "Kullanıcı"} className="h-8 w-8 text-xs" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

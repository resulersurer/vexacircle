import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Container } from "@/components/layout/container";
import { getCurrentUser } from "@/lib/auth/session";
import { getUnreadCounts } from "@/lib/app-data";

type AppShellProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppShell({ children, params }: AppShellProps) {
  const { locale } = await params;
  const user = await getCurrentUser();
  const unreadCounts = await getUnreadCounts(user?.id);

  return (
    <div className="flex min-h-screen flex-col">
      <Header locale={locale} user={user} />
      <main className="flex-1 pb-16 md:pb-0">
        <Container className="py-6">{children}</Container>
      </main>
      <BottomNav locale={locale} unreadCounts={unreadCounts} />
    </div>
  );
}

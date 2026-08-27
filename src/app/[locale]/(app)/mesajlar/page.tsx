import { useTranslations } from "next-intl";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const CONVERSATIONS = [
  {
    id: 1,
    name: "Ayşe Yılmaz",
    lastMessage: "Harika, o zaman buluşalım.",
    time: "10:30",
    unread: 2,
    avatar: null,
  },
  {
    id: 2,
    name: "Mehmet Demir",
    lastMessage: "Proje hakkında konuşalım mı?",
    time: "Dün",
    unread: 0,
    avatar: null,
  },
  {
    id: 3,
    name: "Yazılım Geliştiriciler",
    lastMessage: "Zeynep: yarınki toplantıyı unutmayalım",
    time: "Dün",
    unread: 5,
    avatar: null,
    isGroup: true,
  },
];

export default function MessagesPage() {
  const t = useTranslations("messages");

  return (
    <div className="flex flex-1 flex-col">
      <div className="pb-4">
        <h1 className="text-2xl font-bold text-foreground">{t("title", { default: "Mesajlar" })}</h1>
      </div>
      <div className="flex flex-col">
        {CONVERSATIONS.map((conversation) => (
          <button
            key={conversation.id}
            className="flex items-center gap-4 border-b border-border px-1 py-4 text-left transition-colors hover:bg-accent/40"
          >
            <Avatar fallback={conversation.name} className="h-12 w-12" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{conversation.name}</span>
                <span className="text-xs text-muted-foreground">{conversation.time}</span>
              </div>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                {conversation.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

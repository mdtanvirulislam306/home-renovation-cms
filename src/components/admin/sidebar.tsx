"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Wrench,
  FileText,
  FolderOpen,
  Image,
  MessagesSquare,
  Mail,
  Settings,
  Star,
  Briefcase,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/blogs", label: "Blogs", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/case-studies", label: "Case Studies", icon: Briefcase },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/live-chat", label: "Live Chat", icon: MessagesSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const { data: unreadData } = useQuery({
    queryKey: ["chat-unread"],
    queryFn: async () => {
      const res = await fetch("/api/chat/unread");
      const json = await res.json();
      if (!json.success) return { unreadTotal: 0 };
      return json.data as { unreadTotal: number };
    },
    refetchInterval: 5000,
  });

  const unreadTotal = unreadData?.unreadTotal ?? 0;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card hidden md:flex flex-col">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="text-lg font-bold">
          Green<span className="text-primary">Scape</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(({ href, label, icon: Icon }) => {
          const isLiveChat = href === "/admin/live-chat";
          const showBadge = isLiveChat && unreadTotal > 0;

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {showBadge && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                    pathname === href
                      ? "bg-primary-foreground text-primary"
                      : "bg-destructive text-destructive-foreground"
                  )}
                >
                  {unreadTotal > 99 ? "99+" : unreadTotal}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

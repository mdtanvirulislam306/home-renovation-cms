import { AdminSidebar } from "@/components/admin/sidebar";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-end border-b bg-background/95 backdrop-blur px-6">
          <ThemeToggle />
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

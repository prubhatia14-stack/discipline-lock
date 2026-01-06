import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="dark min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center border-b-2 border-border px-4">
            <SidebarTrigger className="p-2 hover:bg-muted transition-colors">
              <Menu className="w-5 h-5" />
            </SidebarTrigger>
            <span className="ml-4 font-bold uppercase text-lg">Habits</span>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

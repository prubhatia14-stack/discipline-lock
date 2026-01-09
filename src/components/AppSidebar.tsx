import { useLocation } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  CalendarDays,
  Scale,
  User,
  Share2,
  Settings,
  Wallet,
  History,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Logs", url: "/logs", icon: CalendarDays },
  { title: "Wallet", url: "/wallet", icon: Wallet },
  { title: "Challenges", url: "/challenges", icon: History },
  { title: "Stakes & Rules", url: "/stakes", icon: Scale },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Share", url: "/share", icon: Share2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-60"} border-r-2 border-border bg-sidebar`}
      collapsible="icon"
    >
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`${isActive ? "bg-sidebar-accent" : ""}`}
                    >
                      <NavLink
                        to={item.url}
                        end
                        className="flex items-center gap-3 px-3 py-2 hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-accent font-medium"
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

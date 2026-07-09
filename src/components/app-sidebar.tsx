import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, UserCheck, MessageSquareWarning, BellRing, LogOut, Users2, ShieldCheck, GraduationCap, Palette } from "lucide-react";
import { LOGO_URL } from "@/lib/brand";
import { authStore, useCurrentUser, can, type Section } from "@/lib/auth-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Item = { title: string; url: string; icon: typeof BookOpen; section?: Section };

const overview: Item[] = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Gestion des utilisateurs", url: "/utilisateurs", icon: Users2, section: "utilisateurs" },
];
const aiItems: Item[] = [
  { title: "Base de connaissance IA", url: "/base-connaissance", icon: BookOpen, section: "base-connaissance" },
  { title: "Qualification IA", url: "/qualification", icon: UserCheck, section: "qualification" },
  { title: "Réclamations IA", url: "/reclamations", icon: MessageSquareWarning, section: "reclamations" },
  { title: "Relance IA", url: "/relance", icon: BellRing, section: "relance" },
  { title: "Design IA", url: "/design", icon: Palette, section: "design" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const user = useCurrentUser();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const visible = (i: Item) => !i.section || user?.role === "admin" || can(user, i.section, "read");

  const logout = () => {
    authStore.logout();
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center px-2 py-4 group-data-[collapsible=icon]:py-3">
          {collapsed ? (
            <div className="h-9 w-9 rounded-xl brand-gradient-warm flex items-center justify-center shadow-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
          ) : (
            <img
              src={LOGO_URL}
              alt="Excel Academy"
              className="logo-invert h-12 w-auto transition-all"
            />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Vue d'ensemble</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overview.filter(visible).map((item) => {
                const active = pathname === item.url || pathname.startsWith(item.url + "/");
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Agents IA</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiItems.filter(visible).map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient-warm text-white font-bold text-sm shadow">
            {(user?.nom ?? "AD").split(" ").map((s) => s[0]).slice(0, 2).join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-sidebar-foreground truncate flex items-center gap-1">
              {user?.nom ?? "Admin"}
              {user?.role === "admin" && <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--brand-accent)]" />}
            </p>
            <Badge variant="secondary" className="h-4 text-[10px] bg-sidebar-accent text-sidebar-foreground border-sidebar-border">
              {user?.role ?? "—"}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Déconnexion</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

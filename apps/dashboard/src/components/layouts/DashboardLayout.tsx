/**
 * Dashboard Layout
 * Main layout with sidebar navigation for authenticated pages
 */

import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import {
  Home,
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, clearAuthAtom } from '@/stores/auth';

/** Navigation menu items */
const menuItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: LayoutDashboard, label: 'Overview', to: '/overview' },
  { icon: Users, label: 'Participants', to: '/participants' },
  { icon: FileText, label: 'Documents', to: '/documents' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
  { icon: Settings, label: 'Settings', to: '/settings' },
] as const;

export function DashboardLayout() {
  const user = useAtomValue(userAtom);
  const clearAuth = useSetAtom(clearAuthAtom);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar variant="inset">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-4">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Greenway NDIS</span>
                <span className="text-xs text-muted-foreground">Dashboard</span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive =
                      item.to === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(item.to);

                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.to}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
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
            <div className="flex flex-col gap-2 px-2 py-4">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-medium">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </Button>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Dashboard</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

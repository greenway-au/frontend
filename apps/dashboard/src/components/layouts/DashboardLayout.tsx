/**
 * Dashboard Layout
 * Main layout with sidebar navigation for authenticated pages
 * Premium, clean design
 */

import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAtom, clearAuthAtom } from '@/stores/auth';

/** Navigation menu items */
const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
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
            <div className="px-2 py-4">
              <Link to="/" className="block">
                <img
                  src="/logos/logo_full.svg"
                  alt="Greenway Plan Management"
                  className="h-8 w-auto"
                />
              </Link>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <SidebarGroup className="py-4">
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive =
                      item.to === '/'
                        ? currentPath === '/'
                        : currentPath.startsWith(item.to);

                    return (
                      <SidebarMenuItem key={item.to}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="h-10 px-3"
                        >
                          <Link to={item.to}>
                            <item.icon className="size-4" />
                            <span className="font-medium">{item.label}</span>
                            {isActive && (
                              <ChevronRight className="ml-auto size-4 opacity-50" />
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border p-4">
            {user && (
              <div className="flex items-center gap-3 mb-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col overflow-hidden flex-1">
                  <span className="truncate text-sm font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
            <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="h-6" />
            <div className="flex-1">
              {/* Breadcrumb could go here */}
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

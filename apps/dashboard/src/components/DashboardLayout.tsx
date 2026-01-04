import { Outlet } from '@tanstack/react-router';
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
} from 'lucide-react';
import { Link } from '@tanstack/react-router';

const menuItems = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: LayoutDashboard, label: 'Overview', to: '/overview' },
  { icon: Users, label: 'Participants', to: '/participants' },
  { icon: FileText, label: 'Documents', to: '/documents' },
  { icon: BarChart3, label: 'Reports', to: '/reports' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function DashboardLayout() {
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
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild>
                        <Link to={item.to}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-4 text-sm text-muted-foreground">
              <span>v1.0.0</span>
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

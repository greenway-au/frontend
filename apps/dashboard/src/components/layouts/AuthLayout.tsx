/**
 * Auth Layout
 * Layout wrapper for authentication pages (login, register, etc.)
 */

import { LayoutDashboard } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground text-primary">
            <LayoutDashboard className="size-5" />
          </div>
          <span className="text-xl font-semibold text-primary-foreground">
            Greenway NDIS
          </span>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-primary-foreground">
            NDIS Provider Dashboard
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Manage participants, documents, and reports with ease.
            Streamline your NDIS service delivery.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">
          &copy; {new Date().getFullYear()} Greenway NDIS. All rights reserved.
        </p>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden mb-8 flex items-center justify-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="size-5" />
            </div>
            <span className="text-xl font-semibold">Greenway NDIS</span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

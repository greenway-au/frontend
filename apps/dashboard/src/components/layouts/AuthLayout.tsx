/**
 * Auth Layout
 * Layout wrapper for authentication pages (login, register, etc.)
 * Premium, clean design with proper branding
 */

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Premium Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div>
            <img
              src="/logos/logo_full.svg"
              alt="Greenway Plan Management"
              className="h-10 w-auto brightness-0 invert"
            />
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-primary-foreground leading-tight">
              Simplify your NDIS<br />plan management
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              A powerful platform designed to help providers deliver exceptional
              NDIS services with ease and efficiency.
            </p>

            {/* Feature highlights */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <svg className="size-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-foreground/90">Participant management made simple</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <svg className="size-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-foreground/90">Real-time reporting & insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20">
                  <svg className="size-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-primary-foreground/90">Secure document management</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-sm text-primary-foreground/60">
            &copy; {new Date().getFullYear()} Greenway Plan Management. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile branding */}
          <div className="lg:hidden mb-8 flex items-center justify-center">
            <img
              src="/logos/logo_full.svg"
              alt="Greenway Plan Management"
              className="h-8 w-auto"
            />
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}

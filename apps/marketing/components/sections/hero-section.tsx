import { Button } from '@workspace/ui/components/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Trusted by 1000+ NDIS participants</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Your NDIS Plan, <span className="text-primary">Managed Expertly</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Focus on achieving your goals while we handle the paperwork. Professional NDIS plan management services
                designed to maximize your funding and simplify your life.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="group">
                <Link href="#contact">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Learn More</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-muted-foreground">Active Participants</div>
              </div>
              <div>
                <div className="text-3xl font-bold">$50M+</div>
                <div className="text-sm text-muted-foreground">Funds Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right column - Image/Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-full w-full">
              {/* Placeholder for image/illustration */}
              <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border bg-gradient-to-br from-primary/10 to-primary/5 p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="h-24 rounded-lg border bg-background/80 p-4 backdrop-blur">
                      <div className="mb-2 h-3 w-16 rounded bg-primary/20" />
                      <div className="h-2 w-20 rounded bg-muted" />
                    </div>
                    <div className="h-32 rounded-lg border bg-background/80 p-4 backdrop-blur">
                      <div className="mb-2 h-3 w-20 rounded bg-primary/20" />
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-3/4 rounded bg-muted" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="h-32 rounded-lg border bg-background/80 p-4 backdrop-blur">
                      <div className="mb-2 h-3 w-20 rounded bg-primary/20" />
                      <div className="space-y-1">
                        <div className="h-2 w-full rounded bg-muted" />
                        <div className="h-2 w-2/3 rounded bg-muted" />
                      </div>
                    </div>
                    <div className="h-24 rounded-lg border bg-background/80 p-4 backdrop-blur">
                      <div className="mb-2 h-3 w-16 rounded bg-primary/20" />
                      <div className="h-2 w-20 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

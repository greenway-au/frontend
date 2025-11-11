import { Button } from '@workspace/ui/components/button';
import { ArrowLeft, Hammer, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function ComingSoonPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background px-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Hammer className="h-12 w-12" />
            </div>
            <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Heading */}
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          We're Building Something <span className="text-primary">Amazing</span>
        </h1>

        {/* Description */}
        <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
          This feature is currently under construction. We're working hard to bring you the best experience possible.
          Check back soon!
        </p>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>75%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/4 rounded-full bg-primary transition-all duration-500"></div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/#services">Explore Services</Link>
          </Button>
        </div>

        {/* Features Coming Soon */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 text-3xl">🚀</div>
            <h3 className="mb-1 font-semibold">Fast & Reliable</h3>
            <p className="text-sm text-muted-foreground">Built for speed and performance</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 text-3xl">🎨</div>
            <h3 className="mb-1 font-semibold">Beautiful Design</h3>
            <p className="text-sm text-muted-foreground">Clean and modern interface</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 text-3xl">🔒</div>
            <h3 className="mb-1 font-semibold">Secure</h3>
            <p className="text-sm text-muted-foreground">Your data is safe with us</p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-12 text-sm text-muted-foreground">
          Have questions?{' '}
          <Link href="/#faq" className="font-medium text-primary hover:underline">
            Visit our FAQ
          </Link>{' '}
          or reach out at{' '}
          <a href="mailto:support@greenwayplanmanagement.com.au" className="font-medium text-primary hover:underline">
            support@greenwayplanmanagement.com.au
          </a>
        </p>
      </div>
    </div>
  );
}

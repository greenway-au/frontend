import { Button } from '@workspace/ui/components/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="border-b bg-primary py-20 text-primary-foreground sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to Simplify Your NDIS Journey?
          </h2>
          <p className="mt-6 text-lg opacity-90 sm:text-xl">
            Join thousands of satisfied participants who trust Greenway with their NDIS plan management. Get started
            today and experience the difference.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="group w-full sm:w-auto">
              <Link href="#contact">
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
            >
              <Link href="tel:+611300000000">Call Us: 1300 XXX XXX</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>Free consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

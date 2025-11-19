import { Button } from '@workspace/ui/components/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b bg-white">
      <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left column - Content */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Trusted by NDIS professionals</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Smarter NDIS <br /> plan management <br /> <span className="text-primary">that you can rely on</span>
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Simple transparent and stress free plan management. Our team handles your invoices, tracks your budget,
                and ensure providers are paid on time.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="group">
                <Link href="#services">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Get in Contact</Link>
              </Button>
            </div>
          </div>

          {/* Right column - Image/Visual */}
          <div className="relative flex items-center justify-center">
            <div className="relative h-full w-full">
              <div className="relative h-full min-h-[550px] overflow-hidden rounded-2xl border shadow-2xl">
                <Image
                  src="/images/landing-4.jpg"
                  alt="NDIS Plan Management Services"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

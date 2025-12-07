import { Button } from '@workspace/ui/components/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/landing-1.jpg"
          alt="Background"
          fill
          className="object-cover object-[80%_center] sm:object-[75%_center] md:object-[70%_center] lg:object-center"
          priority
          quality={90}
        />
        {/* Lighter gradient overlay - shows more of the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/60 to-white/40 dark:from-background/88 dark:via-background/75 dark:to-background/60" />
        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/35 dark:to-background/35" />
      </div>

      <div className="container relative mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <div className="max-w-3xl">
          {/* Content - Centered */}
          <div className="flex flex-col justify-center space-y-10">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-background/90 px-4 py-1.5 text-sm backdrop-blur-md shadow-lg">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Trusted by NDIS professionals</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl drop-shadow-md">
                Smarter NDIS <br /> plan management <br />{' '}
                <span className="text-primary drop-shadow-lg">that you can rely on</span>
              </h1>
              <p className="text-lg text-foreground/90 sm:text-xl drop-shadow-md max-w-2xl">
                Simple transparent and stress free plan management. Our team handles your invoices, tracks your budget,
                and ensure providers are paid on time.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild className="group shadow-lg">
                <Link href="#services">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="shadow-lg backdrop-blur-sm bg-background/80">
                <Link href="#how-it-works">Get in Contact</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

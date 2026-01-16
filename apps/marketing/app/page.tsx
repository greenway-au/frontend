import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AboutSection } from '@/components/sections/about-section';
import { CTASection } from '@/components/sections/cta-section';
import { FAQSection } from '@/components/sections/faq-section';
import { HeroSection } from '@/components/sections/hero-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { ServicesSection } from '@/components/sections/services-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export default function RootPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col relative">
      {/* Multi-color animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/5 to-secondary/10 dark:from-background dark:via-primary/10 dark:to-secondary/5" />
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 dark:bg-primary/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-secondary/20 dark:bg-secondary/10 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-primary/15 dark:bg-primary/8 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <HowItWorksSection />
        {/*<TestimonialsSection />*/}
        {/*<AboutSection />*/}
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

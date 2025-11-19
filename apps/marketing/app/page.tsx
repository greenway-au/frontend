import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { AboutSection } from '@/components/sections/about-section';
import { CTASection } from '@/components/sections/cta-section';
import { FAQSection } from '@/components/sections/faq-section';
import { HeroSection } from '@/components/sections/hero-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { ServicesSection } from '@/components/sections/services-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';

export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col">
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

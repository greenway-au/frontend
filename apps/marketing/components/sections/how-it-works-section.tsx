import { Card } from '@workspace/ui/components/card';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Get In Touch',
    description:
      "Reach out to us via phone, email, or our contact form. We'll schedule a friendly chat to understand your needs.",
    highlights: ['No obligation', 'Free consultation', 'Quick response'],
  },
  {
    step: '02',
    title: 'Simple Setup',
    description:
      "Complete a straightforward registration process. We'll guide you through every step and answer all your questions.",
    highlights: ['Easy paperwork', 'Guided process', 'Same-day activation'],
  },
  {
    step: '03',
    title: 'We Take Over',
    description:
      'Relax while we handle all plan management tasks. Track your budget, view reports, and contact us anytime.',
    highlights: ['Real-time tracking', 'Regular reports', 'Ongoing support'],
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-b py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Getting Started is Easy</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three simple steps to professional NDIS plan management. No complexity, no confusion.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((item, index) => (
            <div key={item.step} className="relative">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-16 hidden h-px w-full bg-border lg:block" />
              )}

              <Card className="relative overflow-hidden p-8">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground">
                  {item.step}
                </div>

                <h3 className="mb-3 text-2xl font-semibold">{item.title}</h3>
                <p className="mb-6 text-muted-foreground">{item.description}</p>

                <ul className="space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

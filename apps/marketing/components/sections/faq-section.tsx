import { Card } from '@workspace/ui/components/card';

const faqs = [
  {
    question: 'What is NDIS plan management?',
    answer:
      'NDIS plan management is a service that handles the financial administration of your NDIS plan. We process invoices, pay service providers, track your budget, and provide regular reports, so you can focus on achieving your goals.',
  },
  {
    question: 'How much does plan management cost?',
    answer:
      'Plan management is funded by the NDIS and included in your plan at no cost to you. The fees are paid directly by the NDIA, so you can enjoy our services without any out-of-pocket expenses.',
  },
  {
    question: 'Can I choose my own service providers?',
    answer:
      'Yes! With plan management, you have the flexibility to choose both registered and non-registered NDIS providers. We can pay any provider you choose, giving you maximum choice and control.',
  },
  {
    question: 'How quickly can I switch to Greenway?',
    answer:
      "Switching is quick and easy! Once you complete our simple registration process, we can typically activate your account within 24-48 hours. We'll handle all the transition details for you.",
  },
  {
    question: 'How do I track my budget?',
    answer:
      "We provide real-time budget tracking through our online portal and send regular detailed reports. You'll always know exactly how much funding you have available in each category of your plan.",
  },
  {
    question: 'What if I need help or have questions?',
    answer:
      "Our dedicated support team is here to help! Contact us by phone or email during business hours, and we'll respond promptly. We pride ourselves on providing personalized, friendly support.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">Frequently Asked Questions</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
          <p className="text-lg text-muted-foreground">
            Here are answers to the most common questions we receive. If you need further assistance, please don't
            hesitate to reach out.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-shadow bg-card">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-sm font-semibold">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                      <p className="text-base leading-relaxed text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block rounded-lg border bg-muted/50 px-8 py-6">
            <p className="text-base text-foreground mb-2">Still have questions?</p>
            <p className="text-muted-foreground">
              We&apos;re here to help.{' '}
              <a href="#contact" className="font-semibold text-primary hover:underline underline-offset-4">
                Contact our team
              </a>{' '}
              for personalized assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

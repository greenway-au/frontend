import { Card } from '@workspace/ui/components/card';

const faqs = [
  {
    question: 'What is NDIS plan management?',
    answer:
      'Plan management providers help participants manage the financial side of their NDIS plan. We process invoices, pay service providers, track your budget, and provide regular reports, so you can focus on achieving your goals.',
  },
  {
    question: 'How much does plan management cost?',
    answer:
      'Plan management is funded by the NDIS and included in your plan at no cost to you. The fees are paid directly by the NDIA, with no out-of-pocket expenses for you.',
  },
  {
    question: 'What is the difference between Plan Managed, Self Managed, and Agency Managed?',
    answer:
      'Plan Managed lets you choose any provider while a plan manager handles payments Self Managed means you manage everything yourself. Agency Managed limits you to registered providers with the NDIA paying invoices.',
  },
  {
    question: 'How quickly are invoiced paid?',
    answer: 'We aim to process claims on the same day, but in some cases, payments may take 2–3 business days.',
  },
  {
    question: 'How do I track my budget?',
    answer:
      "We provide real-time budget tracking through our online portal and send regular detailed reports. You'll always know exactly how much funding you have available in each category of your plan.",
  },
  {
    question: 'What if I need help or have questions?',
    answer:
      "Our dedicated support team is here to help! Contact us by phone or email during business hours, and we'll respond promptly. We pride ourselves on providing personalised, friendly support.",
  },
];

export function FAQSection(): React.JSX.Element {
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
              for personalised assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

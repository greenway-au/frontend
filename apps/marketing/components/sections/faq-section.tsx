import { Card } from '@workspace/ui/components/card';
import { HelpCircle } from 'lucide-react';

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
    <section className="border-b py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Got questions? We've got answers. Here are some of the most common questions we receive.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question} className="p-6">
              <div className="mb-3 flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                <h3 className="font-semibold">{faq.question}</h3>
              </div>
              <p className="text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Still have questions?{' '}
            <a href="#contact" className="font-medium text-primary hover:underline">
              Contact us
            </a>{' '}
            and we'll be happy to help.
          </p>
        </div>
      </div>
    </section>
  );
}

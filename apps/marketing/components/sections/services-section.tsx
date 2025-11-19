import { LayoutDashboard, Users, FileText } from 'lucide-react';
import Image from 'next/image';

const benefits = [
  {
    icon: LayoutDashboard,
    title: 'Your own dashboard',
    description: 'The easy way to manage and track your NDIS funding with clear insights on spending',
  },
  {
    icon: Users,
    title: 'A team of experts',
    description: 'Access to a highly skilled with extensive NDIS knowledge and an accounting background',
  },
  {
    icon: FileText,
    title: 'Speedy reimbursements',
    description: 'Any costs incurred personally are reimbursed fast and stress free',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="border-b">
      {/* Benefits Section */}
      <div className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl mb-6">Benefits of Greenway Plan Management</h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
            <p className="text-lg text-muted-foreground">
              Everything you need to manage your NDIS funding efficiently and effectively, all in one place.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-12 lg:gap-20">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="text-center px-4">
                <div className="mb-8 mx-auto inline-flex h-28 w-28 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <benefit.icon className="h-14 w-14" />
                </div>
                <h3 className="mb-4 text-2xl font-bold">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="bg-primary py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-5 text-primary-foreground">
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Am I Eligible for Plan Management?</h2>
              <div className="space-y-3 text-base sm:text-lg leading-relaxed opacity-95">
                <p>
                  Plan Management is under the “Improved Life Choices” funding category within your NDIS plan. It is a
                  Capacity Building Supports item designed to  assist you in becoming independent and pursuing your
                  goals. If you do not already have access to this support, contact your Local Area Coordinator or NDIA
                  representative.
                </p>
              </div>
            </div>

            {/* Right Side - Images */}
            <div className="relative h-80 lg:h-96 mx-auto max-w-lg">
              {/* Left - Group Image (Larger) */}
              <div
                className="absolute top-1/2 -translate-y-1/2 left-0 w-44 h-44 sm:w-48 sm:h-48 overflow-hidden shadow-xl"
                style={{ borderRadius: '20% 80% 30% 70% / 75% 25% 75% 25%' }}
              >
                <Image src="/images/landing-1.jpg" alt="Group of people" fill className="object-cover" />
              </div>
              {/* Top Right - Desk Image */}
              <div
                className="absolute top-0 right-8 sm:right-12 w-40 h-40 sm:w-44 sm:h-44 overflow-hidden shadow-xl"
                style={{ borderRadius: '75% 25% 70% 30% / 30% 70% 30% 70%' }}
              >
                <Image src="/images/landing-2.jpg" alt="Person working at desk" fill className="object-cover" />
              </div>
              {/* Bottom Right - Consultation Image */}
              <div
                className="absolute bottom-0 right-8 sm:right-12 w-40 h-40 sm:w-44 sm:h-44 overflow-hidden shadow-xl"
                style={{ borderRadius: '30% 70% 80% 20% / 70% 30% 65% 35%' }}
              >
                <Image src="/images/landing-3.jpg" alt="Consultation session" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

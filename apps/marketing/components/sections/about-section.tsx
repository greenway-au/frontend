import { Card } from '@workspace/ui/components/card';
import { Award, Clock, Heart, Users } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Participant-Focused',
    description: 'Your needs and goals are at the center of everything we do.',
  },
  {
    icon: Award,
    title: 'Professional Excellence',
    description: 'Qualified team with extensive NDIS knowledge and experience.',
  },
  {
    icon: Clock,
    title: 'Reliability',
    description: 'Consistent, timely service you can count on, every single time.',
  },
  {
    icon: Users,
    title: 'Personal Support',
    description: 'Dedicated team members who get to know you and your plan.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-b py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column - Content */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Greenway Plan Management</h2>
              <div className="mt-6 space-y-4 text-lg text-muted-foreground">
                <p>
                  At Greenway, we believe that managing your NDIS plan should be simple, transparent, and stress-free.
                  Founded by professionals passionate about disability support, we've built a service that puts
                  participants first.
                </p>
                <p>
                  Our team of experienced plan managers works tirelessly to ensure your funding is managed efficiently,
                  your providers are paid on time, and you always have a clear picture of your budget. We're here to
                  empower you to make the most of your NDIS plan.
                </p>
                <p>
                  With cutting-edge technology and a human touch, we provide a plan management experience that's both
                  modern and personal. Join the thousands of participants who trust us with their NDIS journey.
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Values */}
          <div>
            <h3 className="mb-6 text-2xl font-bold">Our Values</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <Card key={value.title} className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h4 className="mb-2 font-semibold">{value.title}</h4>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

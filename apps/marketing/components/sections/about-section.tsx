import { Card } from '@workspace/ui/components/card';
import { Award, Clock, Heart, Shield } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Participant Focused',
    description: 'Your needs and goals are at the heart of everything we do.',
  },
  {
    icon: Award,
    title: 'Professional Excellence',
    description: 'Decades of combined expertise in NDIS management.',
  },
  {
    icon: Clock,
    title: 'Unwavering Reliability',
    description: 'Consistent, dependable service you can trust.',
  },
  {
    icon: Shield,
    title: 'Complete Transparency',
    description: 'Clear communication and honest guidance, always.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="border-b bg-white py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About Greenway</h2>
          <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
          <p className="text-xl leading-relaxed text-muted-foreground">
            Founded on principles of integrity and compassion, we've dedicated ourselves to empowering NDIS participants
            through exceptional plan management.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center mb-20">
          {/* Left column - Story */}
          <div className="space-y-6">
            <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
              <p>
                At Greenway, we believe managing your NDIS plan should be a dignified, straightforward experience.
                Founded by professionals who understand the challenges participants face, we've built our service on
                trust and reliability.
              </p>
              <p>
                Our team brings together extensive knowledge of the NDIS framework with a genuine commitment to your
                success. We handle the complexities of plan management with meticulous attention to detail, ensuring
                your funding works as hard as possible for you.
              </p>
              <p>
                Every member of our team is dedicated to providing the kind of service we'd want for our own
                families—thoughtful, responsive, and always in your best interest.
              </p>
            </div>

            <div className="pt-4">
              <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground">
                "Our mission is simple: to provide plan management services that honor the dignity and aspirations of
                every participant we serve."
              </blockquote>
            </div>
          </div>

          {/* Right column - Values */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-center lg:text-left">Our Guiding Principles</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {values.map((value) => (
                <Card key={value.title} className="p-6 bg-card hover:shadow-lg transition-shadow">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" />
                  </div>
                  <h4 className="mb-2 font-semibold text-lg">{value.title}</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t pt-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">15+</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$50M+</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">Funds Managed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99%</div>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

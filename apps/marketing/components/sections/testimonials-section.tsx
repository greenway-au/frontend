import { Card } from '@workspace/ui/components/card';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'NDIS Participant',
    content:
      'Greenway has been a game-changer for me. I used to spend hours dealing with paperwork and payments. Now I can focus on my goals while they handle everything. Highly recommend!',
    rating: 5,
  },
  {
    name: 'James Chen',
    role: 'NDIS Participant',
    content:
      'The team at Greenway is incredibly professional and supportive. They always respond quickly to my questions and their budget tracking system is so easy to use.',
    rating: 5,
  },
  {
    name: 'Emma Rodriguez',
    role: 'NDIS Participant',
    content:
      'Switching to Greenway was the best decision I made. They genuinely care about their clients and go above and beyond to help. I feel confident my plan is in good hands.',
    rating: 5,
  },
  {
    name: 'Michael Thompson',
    role: 'NDIS Participant',
    content:
      'I appreciate how transparent Greenway is with everything. The regular reports keep me informed, and I love that I can check my budget anytime. Excellent service!',
    rating: 5,
  },
  {
    name: 'Lisa Patel',
    role: 'NDIS Participant',
    content:
      "As someone who found NDIS overwhelming, Greenway made everything simple. Their team explained everything clearly and set up my plan quickly. Couldn't ask for more.",
    rating: 5,
  },
  {
    name: 'David Wilson',
    role: 'NDIS Participant',
    content:
      'Five stars! Professional, reliable, and always available when I need them. Greenway has made managing my NDIS plan stress-free. Thank you for the amazing support!',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-b bg-muted/30 py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Participants Nationwide</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Don't just take our word for it. Here's what our participants have to say about their experience with
            Greenway.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="relative p-6">
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />

              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="mb-6 text-muted-foreground">{testimonial.content}</p>

              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">{testimonial.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

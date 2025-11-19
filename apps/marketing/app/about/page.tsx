import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Card } from '@workspace/ui/components/card';
import { Users, Target, Trophy, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-white py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
                About Our Company
              </h1>
              <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
              <p className="text-xl leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="border-b bg-muted/30 py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Our Story</h2>
              <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
            </div>

            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                  </p>
                </div>
              </div>

              <div>
                <blockquote className="border-l-4 border-primary pl-6 italic text-xl text-muted-foreground">
                  "Our mission is to deliver exceptional service that makes a meaningful difference in the lives of those we serve."
                </blockquote>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-primary mb-2">10+</div>
                    <div className="text-sm uppercase tracking-wider text-muted-foreground">Years</div>
                  </div>
                  <div className="text-center p-6 bg-card rounded-lg shadow-sm">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm uppercase tracking-wider text-muted-foreground">Clients</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="border-b bg-white py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Our Values</h2>
              <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. These core values guide everything we do.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-semibold text-xl">Compassion</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Target className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-semibold text-xl">Excellence</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Trophy className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-semibold text-xl">Integrity</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </Card>

              <Card className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-3 font-semibold text-xl">Collaboration</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="border-b bg-muted/30 py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Meet Our Team</h2>
              <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our dedicated team of professionals is here to help.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-xl">John Doe</h3>
                <p className="text-sm text-primary mb-3">Chief Executive Officer</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-xl">Jane Smith</h3>
                <p className="text-sm text-primary mb-3">Chief Operating Officer</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="mb-4 mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-xl">Alex Johnson</h3>
                <p className="text-sm text-primary mb-3">Head of Services</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

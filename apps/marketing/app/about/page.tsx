import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { Card } from '@workspace/ui/components/card';
import { Users, Target, Trophy, Heart } from 'lucide-react';

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b bg-white py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">About Our Company</h1>
              <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
              <p className="text-xl leading-relaxed text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="border-b bg-muted/30 py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-2">
              {/* Mission */}
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Our Mission</h2>
                  <div className="h-1 w-24 bg-primary mx-auto lg:mx-0 mb-8"></div>
                </div>
                <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="space-y-6">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Our Vision</h2>
                  <div className="h-1 w-24 bg-primary mx-auto lg:mx-0 mb-8"></div>
                </div>
                <div className="space-y-5 text-lg leading-relaxed text-foreground/90">
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
                    totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                    dicta sunt explicabo.
                  </p>
                  <p>
                    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                    magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
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
      </main>
      <Footer />
    </div>
  );
}

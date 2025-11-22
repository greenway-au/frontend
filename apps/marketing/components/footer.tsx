import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, PaperclipIcon, Phone, Twitter } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Logo width={140} height={35} showAsLink={false} />
            <p className="text-sm text-muted-foreground">
              NDIS plan management provider assisting participants with managing their funding and achieving their
              goals.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#how-it-works"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#testimonials"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <a
                  href="mailto:hello@greenwayplans.com.au"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  hello@greenwayplans.com.au
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <PaperclipIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <a
                  href="mailto:accounts@greenwayplans.com.au"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  accounts@greenwayplans.com.au
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                <a
                  href="tel:0421002313"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  0421 002 313
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Greenway Plan Management. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-1 justify-end text-sm text-muted-foreground">
              <p className="whitespace-nowrap">NDIS Registration Number: xxxxxxxxxx</p>
              <p className="whitespace-nowrap">ABN: xx xxx xxx xxx</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

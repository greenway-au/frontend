'use client';

import { Button } from '@workspace/ui/components/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './logo';
import { siteConfig } from '@/config/site';

export function Navbar(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '#services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '/coming-soon', label: 'Blogs' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/98 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Logo width={160} height={40} />
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium tracking-wide text-foreground/80 transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side - CTA */}
          <div className="hidden items-center space-x-3 lg:flex">
            <Button variant="ghost" asChild className="font-medium">
              <a href={siteConfig.links.login}>Sign In</a>
            </Button>
            <Button asChild className="shadow-md font-medium">
              <a href={siteConfig.links.register}>Get Started</a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t lg:hidden">
          <div className="space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-md px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 px-4 pt-4">
              <Button variant="outline" asChild className="w-full">
                <a href={siteConfig.links.login}>Sign In</a>
              </Button>
              <Button asChild className="w-full">
                <a href={siteConfig.links.register}>Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

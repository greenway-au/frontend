'use client';

import { Button } from '@workspace/ui/components/button';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
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
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
                <span className="text-2xl font-bold">G</span>
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-lg font-bold leading-tight tracking-tight">Greenway</span>
                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                  Plan Management
                </span>
              </div>
            </Link>
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
              <Link href="/coming-soon">Sign In</Link>
            </Button>
            <Button asChild className="shadow-md font-medium">
              <Link href="/coming-soon">Dashboard</Link>
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
                <Link href="/coming-soon">Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/coming-soon">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

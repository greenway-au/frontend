import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  showAsLink?: boolean;
}

export function Logo({ className = '', width = 180, height = 45, showAsLink = true }: LogoProps): React.JSX.Element {
  const logoImage = (
    <Image
      src="/logos/logo_full.svg"
      alt="Greenway Plan Management"
      width={width}
      height={height}
      priority
      className="h-auto w-auto"
    />
  );

  if (!showAsLink) {
    return <div className={className}>{logoImage}</div>;
  }

  return (
    <Link href="/" className={`transition-opacity hover:opacity-80 ${className}`}>
      {logoImage}
    </Link>
  );
}

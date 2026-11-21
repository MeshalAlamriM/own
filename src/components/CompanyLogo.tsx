'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export default function CompanyLogo({ src, name, size = 48, className = '' }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-paper text-ink-400 ${className}`}
        style={{ width: size, height: size }}
        aria-label={name}
      >
        <Building2 className="w-[45%] h-[45%]" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        fill
        sizes={`${size}px`}
        className="object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

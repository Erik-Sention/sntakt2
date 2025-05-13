import React from 'react';
import Image from 'next/image';

interface AppIconProps {
  size?: number;
  className?: string;
}

export default function AppIcon({ size = 32, className = '' }: AppIconProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <Image
        src="/sa-logo.svg"
        alt="Sention + Aktivitus"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
} 
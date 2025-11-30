import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export const GlassCard = ({ children, className }: GlassCardProps) => {
  return (
    <div className={twMerge('glass-panel rounded-2xl p-6', className)}>
      {children}
    </div>
  );
};
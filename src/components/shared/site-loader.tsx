
import React from 'react';
import Logo from './logo'; // Assuming Logo component path
import { cn } from '@/lib/utils';

interface SiteLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
}

const SiteLoader: React.FC<SiteLoaderProps> = ({ className, size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <Logo
        className={cn(
          sizeClasses[size],
          'text-primary animate-pulse-logo' // Apply custom pulse animation
        )}
      />
    </div>
  );
};

export default SiteLoader;

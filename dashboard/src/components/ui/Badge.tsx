import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-primary/10 text-primary border-primary/20',
      success: 'bg-green-500/10 text-green-700 border-green-500/20',
      warning: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      error: 'bg-red-500/10 text-red-700 border-red-500/20',
      info: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
      secondary: 'bg-secondary text-secondary-foreground border-secondary',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;

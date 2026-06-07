import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'sale' | 'new' | 'sold-out';
  className?: string;
}

const variantStyles = {
  default: 'bg-secondary-200 text-secondary-700',
  sale: 'bg-red-100 text-red-700',
  new: 'bg-accent-100 text-accent-700',
  'sold-out': 'bg-secondary-100 text-secondary-500',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
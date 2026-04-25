import { LucideIcon } from 'lucide-react';
import Button from '@/components/ui/Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 shadow-sm">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="mt-8 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-center text-sm text-muted-foreground max-w-md leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

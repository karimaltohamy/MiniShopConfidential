import { Card, CardContent } from '@/components/ui/Card';
import { ArrowUpIcon, ArrowDownIcon, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  iconColor?: string;
}

export default function KPICard({ title, value, change, icon: Icon, iconColor = 'text-primary' }: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;
  const hasChange = change !== undefined && change !== 0;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {hasChange && (
              <div className="flex items-center gap-1 text-sm">
                {isPositive ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-600" />
                )}
                <span className={cn(isPositive ? 'text-green-600' : 'text-red-600')}>
                  {Math.abs(change)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-full bg-primary/10', iconColor)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useAuth } from '@/features/auth/hooks/useAuth';
import { User } from 'lucide-react';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium">{user?.email || 'Admin'}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role || 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

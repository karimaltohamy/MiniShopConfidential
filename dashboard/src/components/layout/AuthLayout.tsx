import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/hooks/useAuth';

export function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

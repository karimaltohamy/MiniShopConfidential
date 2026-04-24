import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { authApi } from '../api/authApi';
import { User, LoginCredentials } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

   const signIn = async (credentials: LoginCredentials) => {
     try {
       const { user, session } = await authApi.login(credentials);
       // Set Supabase session with tokens from backend
       if (session) {
         await supabase.auth.setSession({
           access_token: session.access_token,
           refresh_token: session.refresh_token,
         });
       }
       setUser(user);
       navigate('/');
       toast.success('Welcome back!');
     } catch (error: any) {
       toast.error(error.message || 'Failed to sign in');
       throw error;
     }
   };

  const signOut = async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate('/login');
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

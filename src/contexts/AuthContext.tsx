
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { toast } from "sonner";
import { Database } from '@/integrations/supabase/types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: any }) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  // Update the type to use any for the schema to avoid type conflicts
  supabase: SupabaseClient<Database, any, any>;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children, supabase }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Generate a proper redirect URL based on the current window location
  const getRedirectUrl = () => {
    return `${window.location.origin}/dashboard`;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password
      });
      if (error) throw error;
      toast.success("Signed in successfully!");
    } catch (error: any) {
      toast.error(error.message || "Error signing in");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: any }) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
          data: options?.data
        }
      });
      if (error) throw error;
      toast.success("Check your email for the confirmation link!");
    } catch (error: any) {
      toast.error(error.message || "Error signing up");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
    } catch (error: any) {
      toast.error(error.message || "Error signing out");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

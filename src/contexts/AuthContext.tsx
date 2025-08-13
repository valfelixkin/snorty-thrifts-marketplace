
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  redirectAfterLogin: string | null;
  setRedirectAfterLogin: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return profileData as UserProfile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state changes
          setTimeout(async () => {
            const profileData = await fetchUserProfile(session.user.id);
            setProfile(profileData);
            setLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const profileData = await fetchUserProfile(session.user.id);
        setProfile(profileData);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error);
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        throw new Error('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        throw new Error('Please check your email and click the confirmation link before signing in.');
      } else if (error.message?.includes('Too many requests')) {
        throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: name,
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' '),
          }
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Registration error:', error);
      // Provide more specific error messages
      if (error.message?.includes('User already registered')) {
        throw new Error('An account with this email already exists. Please use a different email or try logging in.');
      } else if (error.message?.includes('Password should be at least')) {
        throw new Error('Password must be at least 6 characters long.');
      } else if (error.message?.includes('Invalid email')) {
        throw new Error('Please enter a valid email address.');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Clear redirect after logout
      setRedirectAfterLogin(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signOut = logout; // Alias for logout

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      login,
      register,
      logout,
      signOut,
      loading,
      redirectAfterLogin,
      setRedirectAfterLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

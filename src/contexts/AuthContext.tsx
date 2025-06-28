import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthUser extends User {
  profile?: {
    nom?: string;
    prenom?: string;
  };
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('nom, prenom')
        .eq('id', authUser.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);
      }

      const userWithProfile: AuthUser = {
        ...authUser,
        profile: profile || undefined,
        name: profile?.nom ? `${profile.prenom || ''} ${profile.nom}`.trim() : authUser.email?.split('@')[0] || 'Utilisateur'
      };

      setUser(userWithProfile);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      // Créer un utilisateur de base même en cas d'erreur
      const basicUser: AuthUser = {
        ...authUser,
        name: authUser.email?.split('@')[0] || 'Utilisateur'
      };
      setUser(basicUser);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Configuration Supabase manquante. Veuillez vérifier vos variables d\'environnement.');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email avant de vous connecter');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          throw error;
        }
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw new Error(error.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error('Configuration Supabase manquante. Veuillez vérifier vos variables d\'environnement.');
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          throw new Error('Un compte existe déjà avec cette adresse email');
        } else if (error.message.includes('Failed to fetch')) {
          throw new Error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
          throw error;
        }
      }

      if (data.user) {
        // Créer le profil utilisateur
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
            });

          if (profileError && profileError.code !== '23505') { // Ignore duplicate key error
            console.error('Erreur création profil:', profileError);
          }
        } catch (profileError) {
          console.error('Erreur lors de la création du profil:', profileError);
        }

        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      throw new Error(error.message || 'Erreur de création de compte');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email.trim()) {
        throw new Error('Veuillez saisir votre adresse email');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Veuillez saisir une adresse email valide');
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error: any) {
      console.error('Erreur de déconnexion:', error);
      throw new Error(error.message || 'Erreur de déconnexion');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, resetPassword, loading }}>
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
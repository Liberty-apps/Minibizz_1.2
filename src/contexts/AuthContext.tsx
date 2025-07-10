import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';
import { onboardingService } from '../services/onboarding';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser extends User {
  profile?: {
    nom?: string;
    prenom?: string;
    telephone?: string;
    adresse?: string;
    code_postal?: string;
    ville?: string;
    pays?: string;
    siret?: string;
    siren?: string;
    activite_principale?: string;
    forme_juridique?: string;
    date_creation_entreprise?: string;
    taux_tva?: number;
    regime_fiscal?: string;
    logo_url?: string;
    signature_url?: string;
    iban?: string;
    bic?: string;
    onboarding_completed?: boolean;
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
    supabase.auth.getSession().then((response) => {
      const session = response?.data?.session;
      if (session && session.user) {
        loadUserProfile(session.user);
      }
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const authListener = supabase.auth.onAuthStateChange(
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

    return () => {
      if (authListener && authListener.data && authListener.data.subscription) {
        authListener.data.subscription.unsubscribe();
      }
    };
  }, []);

  const loadUserProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors du chargement du profil:', error);
      }

      // Si aucun profil n'existe, créer un profil de base
      if (!profile) {
        console.log('Aucun profil trouvé, création d\'un profil de base...');
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              onboarding_completed: false,
            })
            .select('*')
            .single();

          if (createError) {
            console.error('Erreur lors de la création du profil:', createError);
            // Continuer avec un profil de base même si la création échoue
            const userWithProfile: AuthUser = {
              ...authUser,
              name: authUser.email?.split('@')[0] || 'Utilisateur'
            };
            setUser(userWithProfile);
            return;
          }

          const userWithProfile: AuthUser = {
            ...authUser,
            profile: newProfile || undefined,
            name: newProfile?.nom ? `${newProfile.prenom || ''} ${newProfile.nom}`.trim() : authUser.email?.split('@')[0] || 'Utilisateur'
          };

          setUser(userWithProfile);

          // Rediriger vers l'onboarding pour le nouveau profil
          router.replace('/(auth)/onboarding');
          return;
        } catch (createError) {
          console.error('Erreur lors de la création du profil:', createError);
          // Continuer avec un profil de base même si la création échoue
          const userWithProfile: AuthUser = {
            ...authUser,
            name: authUser.email?.split('@')[0] || 'Utilisateur'
          };
          setUser(userWithProfile);
          return;
        }
      }

      const userWithProfile: AuthUser = {
        ...authUser,
        profile: profile || undefined,
        name: profile?.nom ? `${profile.prenom || ''} ${profile.nom}`.trim() : authUser.email?.split('@')[0] || 'Utilisateur'
      };

      setUser(userWithProfile);

      // Vérifier si l'onboarding est nécessaire
      if (profile && !profile.onboarding_completed) {
        router.replace('/(auth)/onboarding');
      }
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
              onboarding_completed: false,
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
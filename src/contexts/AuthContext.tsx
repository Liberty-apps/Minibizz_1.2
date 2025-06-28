import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      // Simulate checking for stored auth token
      const storedUser = await getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        await storeUser(mockUser);
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split('@')[0]
        };
        
        setUser(mockUser);
        await storeUser(mockUser);
      } else {
        throw new Error('Données invalides');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await removeStoredUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
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

// Mock storage functions (in a real app, use AsyncStorage or SecureStore)
const getStoredUser = async (): Promise<User | null> => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('minibizz_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  } catch {
    return null;
  }
};

const storeUser = async (user: User): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minibizz_user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('Failed to store user:', error);
  }
};

const removeStoredUser = async (): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('minibizz_user');
    }
  } catch (error) {
    console.error('Failed to remove user:', error);
  }
};
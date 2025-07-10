import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscription: any | null;
  hasAccess: (feature: string) => boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  getCurrentPlan: () => string;
  updatePlan: (planName: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    // Simuler le chargement d'un abonnement
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSubscription(null); // Pour l'instant, pas d'abonnement
    setIsLoading(false);
  };

  const updatePlan = async (planName: string): Promise<void> => {
    // Simuler la mise à jour d'un plan
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const getCurrentPlan = (): string => {
    // Pour l'instant, retourner Freemium
    return 'Freemium';
  };

  const hasAccess = (feature: string): boolean => {
    // Pour l'instant, accès à toutes les fonctionnalités de base
    const basicFeatures = [
      'dashboard',
      'clients',
      'devis',
      'factures',
      'planning',
      'calculs',
      'parametres',
      'aide'
    ];
    
    return basicFeatures.includes(feature);
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      hasAccess,
      isLoading,
      refreshSubscription,
      getCurrentPlan,
      updatePlan
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
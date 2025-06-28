import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { subscriptionService } from '../services/subscription';

interface SubscriptionContextType {
  subscription: any | null;
  plan: any | null;
  hasAccess: (feature: string) => boolean;
  canUse: (type: string) => Promise<boolean>;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<any | null>(null);
  const [plan, setPlan] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSubscription();
    } else {
      setSubscription(null);
      setPlan(null);
      setLoading(false);
    }
  }, [user]);

  const loadSubscription = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const subscriptionData = await subscriptionService.getCurrentSubscription(user.id);
      setSubscription(subscriptionData);
      setPlan(subscriptionData?.plan || null);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'abonnement:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAccess = (feature: string): boolean => {
    if (!user) return false;
    
    if (!subscription || subscription.statut !== 'actif') {
      // Plan gratuit par défaut
      return subscriptionService.checkFeatureAccess('freemium', feature);
    }

    return subscriptionService.checkFeatureAccess(
      subscription.plan.nom.toLowerCase(), 
      feature
    );
  };

  const canUse = async (type: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await subscriptionService.checkUsageLimit(user.id, type);
    } catch (error) {
      console.error('Erreur lors de la vérification des limites:', error);
      return false;
    }
  };

  const refreshSubscription = async () => {
    await loadSubscription();
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      plan,
      hasAccess,
      canUse,
      loading,
      refreshSubscription
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
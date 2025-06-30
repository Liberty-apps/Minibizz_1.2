import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { stripeService, type SubscriptionData } from '../services/stripe';
import { stripeConfig } from '../stripe-config';
import { subscriptionService } from '../services/subscription';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  hasAccess: (feature: string) => boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  getCurrentPlan: () => string;
  updatePlan: (planName: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
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
    if (!user) return;
    
    try {
      setIsLoading(true);
      const subscriptionData = await stripeService.getUserSubscription();
      console.log("Loaded subscription data:", subscriptionData);
      setSubscription(subscriptionData);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'abonnement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (planName: string): Promise<void> => {
    if (!user) throw new Error('Utilisateur non connecté');
    
    try {
      setIsLoading(true);
      await subscriptionService.updateUserPlan(user.id, planName);
      await loadSubscription();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plan:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPlan = (): string => {
    if (!subscription || !stripeService.isSubscriptionActive(subscription.subscription_status)) {
      return 'Freemium';
    }

    const currentProduct = stripeConfig.products.find(p => p.priceId === subscription.price_id);
    return currentProduct?.name || 'Premium Standard';
  };

  const hasAccess = (feature: string): boolean => {
    if (!user) return false;
    
    // For debugging
    console.log(`Checking access for feature: ${feature}`);
    console.log(`Current plan: ${getCurrentPlan()}`);
    
    // If no active subscription, user has freemium access
    if (!subscription || !stripeService.isSubscriptionActive(subscription.subscription_status)) {
      return checkFreemiumAccess(feature);
    }

    // Find the current product
    const currentProduct = stripeConfig.products.find(p => p.priceId === subscription.price_id);
    if (!currentProduct) return checkFreemiumAccess(feature);

    // For debugging
    console.log(`Current product: ${currentProduct.name}`);
    
    return checkPremiumAccess(currentProduct.name, feature);
  };

  const checkFreemiumAccess = (feature: string): boolean => {
    const freemiumFeatures = [
      'dashboard',
      'clients_basic',
      'devis_basic',
      'planning_basic',
      'calculs',
      'aide',
      'premium'
    ];
    return freemiumFeatures.includes(feature);
  };

  const checkPremiumAccess = (planName: string, feature: string): boolean => {
    // All premium plans have access to basic features
    const basicPremiumFeatures = [
      'dashboard',
      'clients',
      'devis',
      'factures',
      'planning',
      'calculs',
      'parametres',
      'aide',
      'premium'
    ];

    if (basicPremiumFeatures.includes(feature)) {
      return true;
    }

    // Plan-specific features
    if (planName.includes('Pack Pro')) {
      const packProFeatures = [
        'missions',
        'actualites',
        'analytics',
        'assistance_juridique',
        'assistance_marketing'
      ];
      return packProFeatures.includes(feature);
    }

    if (planName.includes('Site Vitrine')) {
      const siteVitrineFeatures = [
        'sites-vitrines',
        'domaine-personnalise'
      ];
      
      // For debugging
      console.log(`Checking if ${feature} is in Site Vitrine features`);
      console.log(`Site Vitrine features: ${siteVitrineFeatures}`);
      console.log(`Result: ${siteVitrineFeatures.includes(feature)}`);
      
      return siteVitrineFeatures.includes(feature);
    }

    return false;
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
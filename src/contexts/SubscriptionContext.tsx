import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { stripeService, type SubscriptionData } from '../services/stripe';
import { stripeConfig } from '../stripe-config';

interface SubscriptionContextType {
  subscription: SubscriptionData | null;
  hasAccess: (feature: string) => boolean;
  isLoading: boolean;
  refreshSubscription: () => Promise<void>;
  getCurrentPlan: () => string;
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

  const getCurrentPlan = (): string => {
    if (!subscription || !stripeService.isSubscriptionActive(subscription.subscription_status)) {
      return 'Freemium';
    }

    const currentProduct = stripeConfig.products.find(p => p.priceId === subscription.price_id);
    return currentProduct?.name || 'Premium';
  };

  const hasAccess = (feature: string): boolean => {
    if (!user) return false;
    
    // For debugging - log the feature being checked
    console.log(`Checking access for feature: ${feature}`);
    
    // If no active subscription, user has freemium access
    if (!subscription || !stripeService.isSubscriptionActive(subscription.subscription_status)) {
      const hasAccess = checkFreemiumAccess(feature);
      console.log(`Freemium access for ${feature}: ${hasAccess}`);
      return hasAccess;
    }

    // Find the current product
    const currentProduct = stripeConfig.products.find(p => p.priceId === subscription.price_id);
    if (!currentProduct) {
      const hasAccess = checkFreemiumAccess(feature);
      console.log(`No product found, defaulting to freemium access for ${feature}: ${hasAccess}`);
      return hasAccess;
    }

    // Log the current plan for debugging
    console.log(`Current plan: ${currentProduct.name}`);
    
    const hasAccess = checkPremiumAccess(currentProduct.name, feature);
    console.log(`Premium access for ${feature} with plan ${currentProduct.name}: ${hasAccess}`);
    return hasAccess;
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

    // Fix: Always grant access to sites-vitrines for any Premium plan
    // This is a temporary fix to ensure all premium users can access the site feature
    if (feature === 'sites-vitrines' && planName.includes('Premium')) {
      return true;
    }

    // Plan-specific features - original logic
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
      getCurrentPlan
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
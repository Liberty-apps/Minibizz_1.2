import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock, Crown } from 'lucide-react-native';
import { useSubscription } from '../src/contexts/SubscriptionContext';
import UpgradeButton from './UpgradeButton';

interface PremiumFeatureProps {
  feature: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  showUpgradeButton?: boolean;
}

export default function PremiumFeature({
  feature,
  children,
  title,
  description,
  showUpgradeButton = true
}: PremiumFeatureProps) {
  const { hasAccess, getCurrentPlan } = useSubscription();
  
  const hasFeatureAccess = hasAccess(feature);
  const currentPlan = getCurrentPlan();

  // For debugging
  console.log(`PremiumFeature check for ${feature}:`, { hasFeatureAccess, currentPlan });

  if (hasFeatureAccess) {
    return <>{children}</>;
  }

  // Déterminer quel plan est nécessaire pour cette fonctionnalité
  const getRequiredPlan = () => {
    switch (feature) {
      case 'sites-vitrines':
        return 'Premium + Site Vitrine';
      case 'missions':
      case 'actualites':
        return 'Premium + Pack Pro';
      default:
        return 'Premium Standard';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.lockIconContainer}>
        <Crown size={40} color="#9333ea" />
      </View>
      
      <Text style={styles.title}>{title || 'Fonctionnalité Premium'}</Text>
      
      <Text style={styles.description}>
        {description || 'Cette fonctionnalité est disponible uniquement avec un abonnement premium.'}
      </Text>
      
      <View style={styles.planInfo}>
        <Text style={styles.planInfoText}>
          Votre plan actuel : <Text style={styles.currentPlan}>{currentPlan}</Text>
        </Text>
        <Text style={styles.planInfoText}>
          Plan requis : <Text style={styles.requiredPlan}>{getRequiredPlan()}</Text>
        </Text>
      </View>
      
      {showUpgradeButton && (
        <View style={styles.buttonContainer}>
          <UpgradeButton 
            feature={feature}
            size="medium"
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#faf5ff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    margin: 16,
  },
  lockIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  planInfo: {
    backgroundColor: '#f5f3ff',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    marginBottom: 24,
  },
  planInfoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentPlan: {
    fontWeight: '600',
    color: '#6b7280',
  },
  requiredPlan: {
    fontWeight: '600',
    color: '#9333ea',
  },
  buttonContainer: {
    marginTop: 8,
  },
});
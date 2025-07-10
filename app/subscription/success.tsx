import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { CircleCheck as CheckCircle, ArrowRight, Chrome as Home } from 'lucide-react-native';
import { stripeService } from '../../src/services/stripe';
import Logo from '../../components/Logo';

export default function SubscriptionSuccess() {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      // Wait a moment for webhook processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const subscriptionData = await stripeService.getUserSubscription();
      setSubscription(subscriptionData);
    } catch (error: any) {
      console.error('Error loading subscription:', error);
      setError('Impossible de charger les informations d\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  const handleViewSubscription = () => {
    router.push('/(tabs)/abonnement');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.loadingText}>Finalisation de votre abonnement...</Text>
          <Text style={styles.loadingSubtext}>
            Nous mettons à jour votre compte avec les nouvelles fonctionnalités
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Erreur</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSubscriptionData}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <Logo size="large" showText={true} color="#2563eb" style={styles.logo} />
        <Logo size="medium" showText={true} color="#2563eb" style={styles.logo} />
        <Logo size="large" showText={true} color="#2563eb" style={styles.logo} />
        <View style={styles.iconContainer}>
          <CheckCircle size={80} color="#16a34a" />
        </View>

        {/* Success Message */}
        <Text style={styles.title}>Abonnement activé !</Text>
        <Text style={styles.subtitle}>
          Votre paiement a été traité avec succès et votre abonnement est maintenant actif.
        </Text>

        {/* Subscription Details */}
        {subscription && (
          <View style={styles.subscriptionCard}>
            <Text style={styles.cardTitle}>Détails de l'abonnement</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Statut :</Text>
              <View style={[styles.statusBadge, { backgroundColor: '#16a34a' }]}>
                <Text style={styles.statusText}>
                  {subscription.subscription_status === 'active' ? 'Actif' : subscription.subscription_status}
                </Text>
              </View>
            </View>
            
            {subscription.current_period_end && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prochaine facturation :</Text>
                <Text style={styles.detailValue}>
                  {stripeService.formatDate(subscription.current_period_end)}
                </Text>
              </View>
            )}

            {subscription.payment_method_brand && subscription.payment_method_last4 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Méthode de paiement :</Text>
                <Text style={styles.detailValue}>
                  {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Features Unlocked */}
        <View style={styles.featuresCard}>
          <Text style={styles.cardTitle}>Fonctionnalités débloquées</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color="#16a34a" />
              <Text style={styles.featureText}>Documents illimités</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color="#16a34a" />
              <Text style={styles.featureText}>Signature électronique</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color="#16a34a" />
              <Text style={styles.featureText}>Support prioritaire</Text>
            </View>
            <View style={styles.featureItem}>
              <CheckCircle size={16} color="#16a34a" />
              <Text style={styles.featureText}>Dashboard avancé</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleContinue}>
            <Home size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Accéder à l'application</Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleViewSubscription}>
            <Text style={styles.secondaryButtonText}>Gérer mon abonnement</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Besoin d'aide ? Contactez notre support à{' '}
          <Text style={styles.helpLink}>support@minibizz.fr</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    marginBottom: 24,
    alignSelf: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  subscriptionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  featuresCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  actions: {
    width: '100%',
    maxWidth: 400,
    gap: 12,
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  helpLink: {
    color: '#2563eb',
    fontWeight: '500',
  },
});
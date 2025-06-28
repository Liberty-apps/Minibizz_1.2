import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function SubscriptionCancel() {
  const handleGoBack = () => {
    router.back();
  };

  const handleTryAgain = () => {
    router.push('/(tabs)/abonnement');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Cancel Icon */}
        <View style={styles.iconContainer}>
          <XCircle size={80} color="#dc2626" />
        </View>

        {/* Cancel Message */}
        <Text style={styles.title}>Abonnement annulé</Text>
        <Text style={styles.subtitle}>
          Votre processus d'abonnement a été annulé. Aucun paiement n'a été effectué.
        </Text>

        {/* Information Card */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Que s'est-il passé ?</Text>
          <Text style={styles.cardText}>
            Vous avez annulé le processus de paiement avant sa finalisation. 
            Votre compte reste inchangé et vous pouvez réessayer à tout moment.
          </Text>
        </View>

        {/* Benefits Reminder */}
        <View style={styles.benefitsCard}>
          <Text style={styles.cardTitle}>Pourquoi passer Premium ?</Text>
          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>• Documents illimités</Text>
            <Text style={styles.benefitItem}>• Signature électronique</Text>
            <Text style={styles.benefitItem}>• Support prioritaire</Text>
            <Text style={styles.benefitItem}>• Dashboard avancé</Text>
            <Text style={styles.benefitItem}>• Fonctionnalités IA</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleTryAgain}>
            <RefreshCw size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>Réessayer l'abonnement</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleGoBack}>
            <ArrowLeft size={20} color="#6b7280" />
            <Text style={styles.secondaryButtonText}>Retour</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.tertiaryButton} onPress={handleGoHome}>
            <Text style={styles.tertiaryButtonText}>Continuer avec le plan gratuit</Text>
          </TouchableOpacity>
        </View>

        {/* Help Text */}
        <Text style={styles.helpText}>
          Des questions ? Contactez-nous à{' '}
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
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
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
    backgroundColor: '#2563eb',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  tertiaryButtonText: {
    color: '#6b7280',
    fontSize: 14,
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
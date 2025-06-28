import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { TEST_ACCOUNT } from '../../src/utils/testAccount';
import { TestTube, ArrowRight, User, Lock } from 'lucide-react-native';

export default function TestLogin() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleTestLogin = async () => {
    try {
      setLoading(true);
      await login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
      router.replace('/(tabs)');
    } catch (error: any) {
      // Si le compte n'existe pas, proposer de le créer
      if (error.message.includes('Email ou mot de passe incorrect')) {
        Alert.alert(
          'Compte de test non trouvé',
          'Le compte de test n\'existe pas encore. Voulez-vous le créer ?',
          [
            { text: 'Annuler', style: 'cancel' },
            {
              text: 'Créer le compte',
              onPress: () => router.push('/(auth)/register')
            }
          ]
        );
      } else {
        Alert.alert('Erreur', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <TestTube color="#ffffff" size={32} />
          </View>
          <Text style={styles.title}>Mode Test</Text>
          <Text style={styles.subtitle}>
            Découvrez MiniBizz avec un compte de démonstration
          </Text>
        </View>

        {/* Test Account Info */}
        <View style={styles.testAccountCard}>
          <Text style={styles.cardTitle}>Compte de test disponible</Text>
          <View style={styles.accountInfo}>
            <View style={styles.infoRow}>
              <User size={16} color="#6b7280" />
              <Text style={styles.infoText}>{TEST_ACCOUNT.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Lock size={16} color="#6b7280" />
              <Text style={styles.infoText}>{TEST_ACCOUNT.password}</Text>
            </View>
          </View>
          <Text style={styles.cardDescription}>
            Ce compte contient des données de démonstration pour tester toutes les fonctionnalités
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleTestLogin}
            disabled={loading}
          >
            <TestTube size={20} color="#ffffff" />
            <Text style={styles.primaryButtonText}>
              {loading ? 'Connexion...' : 'Utiliser le compte de test'}
            </Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleManualLogin}
          >
            <Text style={styles.secondaryButtonText}>Connexion manuelle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.tertiaryButton]}
            onPress={handleRegister}
          >
            <Text style={styles.tertiaryButtonText}>Créer un nouveau compte</Text>
          </TouchableOpacity>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresPreview}>
          <Text style={styles.featuresTitle}>Fonctionnalités à découvrir</Text>
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Gestion de clients et devis</Text>
            <Text style={styles.featureItem}>• Planning et rendez-vous</Text>
            <Text style={styles.featureItem}>• Calculateur de charges</Text>
            <Text style={styles.featureItem}>• Création de sites vitrines</Text>
            <Text style={styles.featureItem}>• Système d'abonnements</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  testAccountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
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
    marginBottom: 12,
  },
  accountInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actions: {
    gap: 12,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
  },
  tertiaryButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  featuresPreview: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  featuresList: {
    gap: 6,
  },
  featureItem: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
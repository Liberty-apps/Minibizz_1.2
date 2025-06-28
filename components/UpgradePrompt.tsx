import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Crown, X } from 'lucide-react-native';
import { router } from 'expo-router';

interface UpgradePromptProps {
  visible: boolean;
  onClose: () => void;
  feature: string;
  currentPlan?: string;
}

export default function UpgradePrompt({ visible, onClose, feature, currentPlan }: UpgradePromptProps) {
  const handleUpgrade = () => {
    onClose();
    router.push('/(tabs)/abonnement');
  };

  const getFeatureDescription = (feature: string) => {
    const descriptions = {
      'sites-vitrines': 'Créez des sites vitrines professionnels pour présenter votre activité en ligne',
      'missions': 'Accédez au réseau de missions partagées et collaborez avec d\'autres auto-entrepreneurs',
      'actualites': 'Restez informé des dernières actualités et opportunités d\'emploi dans votre secteur',
      'factures': 'Créez et gérez vos factures professionnelles avec suivi des paiements',
      'clients_advanced': 'Gérez un nombre illimité de clients avec fonctionnalités avancées',
      'analytics': 'Accédez aux statistiques détaillées de votre activité'
    };
    
    return descriptions[feature] || 'Cette fonctionnalité avancée vous aidera à développer votre activité';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Crown size={32} color="#9333ea" />
            </View>
            <Text style={styles.title}>Fonctionnalité Premium</Text>
          </View>
          
          <View style={styles.content}>
            <Text style={styles.description}>
              {getFeatureDescription(feature)}
            </Text>
            
            <View style={styles.currentPlanContainer}>
              <Text style={styles.currentPlanLabel}>Plan actuel :</Text>
              <Text style={styles.currentPlan}>{currentPlan || 'Gratuit'}</Text>
            </View>
            
            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Avec Premium, débloquez :</Text>
              <View style={styles.benefitsList}>
                <Text style={styles.benefitItem}>✓ Toutes les fonctionnalités avancées</Text>
                <Text style={styles.benefitItem}>✓ Support prioritaire</Text>
                <Text style={styles.benefitItem}>✓ Stockage illimité</Text>
                <Text style={styles.benefitItem}>✓ Rapports détaillés</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Plus tard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
              <Crown size={16} color="#ffffff" />
              <Text style={styles.upgradeText}>Voir les plans</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#faf5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  content: {
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  currentPlanContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#9ca3af',
  },
  currentPlan: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  benefitsContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    fontSize: 14,
    color: '#16a34a',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  upgradeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#9333ea',
    gap: 6,
  },
  upgradeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
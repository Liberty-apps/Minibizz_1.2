import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Modal } from 'react-native';
import { router } from 'expo-router';
import { Crown, X } from 'lucide-react-native';
import { useSubscription } from '../src/contexts/SubscriptionContext';

interface UpgradeButtonProps {
  feature: string;
  style?: any;
  textStyle?: any;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'text';
}

export default function UpgradeButton({ 
  feature, 
  style, 
  textStyle, 
  size = 'medium',
  variant = 'primary'
}: UpgradeButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { getCurrentPlan } = useSubscription();

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleUpgrade = () => {
    setModalVisible(false);
    router.push('/(tabs)/abonnement');
  };

  const getFeatureName = () => {
    const featureNames: Record<string, string> = {
      'sites-vitrines': 'Sites Vitrines',
      'missions': 'Missions Partagées',
      'actualites': 'Actualités & Emplois',
      'factures': 'Factures Avancées',
      'clients_advanced': 'Clients Avancés',
      'analytics': 'Statistiques Avancées',
      'assistance_juridique': 'Assistance Juridique',
      'assistance_marketing': 'Assistance Marketing'
    };
    
    return featureNames[feature] || 'Fonctionnalité Premium';
  };

  const getFeatureDescription = () => {
    const descriptions: Record<string, string> = {
      'sites-vitrines': 'Créez des sites vitrines professionnels pour présenter votre activité en ligne',
      'missions': 'Accédez au réseau de missions partagées et collaborez avec d\'autres auto-entrepreneurs',
      'actualites': 'Restez informé des dernières actualités et opportunités d\'emploi dans votre secteur',
      'factures': 'Créez et gérez vos factures professionnelles avec suivi des paiements',
      'clients_advanced': 'Gérez un nombre illimité de clients avec fonctionnalités avancées',
      'analytics': 'Accédez aux statistiques détaillées de votre activité'
    };
    
    return descriptions[feature] || 'Cette fonctionnalité avancée vous aidera à développer votre activité';
  };

  const getButtonStyles = () => {
    let buttonStyle = [styles.button];
    let buttonTextStyle = [styles.buttonText];
    
    // Size variations
    if (size === 'small') {
      buttonStyle.push(styles.buttonSmall);
      buttonTextStyle.push(styles.buttonTextSmall);
    } else if (size === 'large') {
      buttonStyle.push(styles.buttonLarge);
      buttonTextStyle.push(styles.buttonTextLarge);
    }
    
    // Variant styles
    if (variant === 'secondary') {
      buttonStyle.push(styles.buttonSecondary);
      buttonTextStyle.push(styles.buttonTextSecondary);
    } else if (variant === 'text') {
      buttonStyle.push(styles.buttonText);
      buttonTextStyle.push(styles.buttonTextOnly);
    }
    
    // Add custom styles
    if (style) buttonStyle.push(style);
    if (textStyle) buttonTextStyle.push(textStyle);
    
    return { buttonStyle, buttonTextStyle };
  };

  const { buttonStyle, buttonTextStyle } = getButtonStyles();

  return (
    <>
      <TouchableOpacity style={buttonStyle} onPress={handlePress}>
        {variant !== 'text' && <Crown size={size === 'small' ? 14 : 18} color={variant === 'secondary' ? "#9333ea" : "#ffffff"} />}
        <Text style={buttonTextStyle}>Passer Premium</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <X size={24} color="#6b7280" />
            </TouchableOpacity>
            
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Crown size={32} color="#9333ea" />
              </View>
              <Text style={styles.modalTitle}>Fonctionnalité Premium</Text>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.featureName}>{getFeatureName()}</Text>
              <Text style={styles.featureDescription}>
                {getFeatureDescription()}
              </Text>
              
              <View style={styles.currentPlanContainer}>
                <Text style={styles.currentPlanLabel}>Plan actuel :</Text>
                <Text style={styles.currentPlan}>{getCurrentPlan()}</Text>
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
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Plus tard</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.upgradeButton} 
                onPress={handleUpgrade}
              >
                <Crown size={16} color="#ffffff" />
                <Text style={styles.upgradeText}>Voir les plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9333ea',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  buttonSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonLarge: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonSecondary: {
    backgroundColor: '#f5f3ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  buttonText: {
    backgroundColor: 'transparent',
    paddingVertical: 4,
    paddingHorizontal: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  buttonTextSmall: {
    fontSize: 12,
  },
  buttonTextLarge: {
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#9333ea',
  },
  buttonTextOnly: {
    color: '#9333ea',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
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
    zIndex: 10,
  },
  modalHeader: {
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalContent: {
    marginBottom: 24,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9333ea',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
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
  modalActions: {
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
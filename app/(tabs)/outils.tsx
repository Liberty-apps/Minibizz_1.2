import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Calculator, Crown, Globe, CircleHelp as HelpCircle, Briefcase, Newspaper, ChevronRight, Zap, Target, Palette, Lock } from 'lucide-react-native';
import { useSubscription } from '../../src/contexts/SubscriptionContext';

export default function Outils() {
  const { hasAccess, plan } = useSubscription();

  const handleItemPress = (route: string, feature: string) => {
    if (!hasAccess(feature)) {
      Alert.alert(
        'Fonctionnalité Premium',
        `Cette fonctionnalité nécessite un abonnement Premium. Votre plan actuel : ${plan?.nom || 'Gratuit'}`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Voir les plans',
            onPress: () => router.push('/(tabs)/abonnement')
          }
        ]
      );
      return;
    }
    router.push(route as any);
  };

  const outilsCategories = [
    {
      title: 'Calculs & Finances',
      description: 'Outils de gestion financière',
      icon: Calculator,
      color: '#2563eb',
      bgColor: '#eff6ff',
      items: [
        {
          name: 'Calculateur de charges',
          description: 'Simulez vos charges sociales',
          route: '/(tabs)/calculs',
          feature: 'calculs',
          icon: Calculator
        }
      ]
    },
    {
      title: 'Abonnement & Plans',
      description: 'Gérez votre abonnement',
      icon: Crown,
      color: '#9333ea',
      bgColor: '#faf5ff',
      items: [
        {
          name: 'Mon abonnement',
          description: 'Plans et facturation',
          route: '/(tabs)/abonnement',
          feature: 'dashboard', // Toujours accessible
          icon: Crown
        }
      ]
    },
    {
      title: 'Présence en ligne',
      description: 'Créez votre présence web',
      icon: Globe,
      color: '#059669',
      bgColor: '#ecfdf5',
      items: [
        {
          name: 'Sites vitrines',
          description: 'Créez votre mini-site',
          route: '/(tabs)/sites-vitrines',
          feature: 'sites-vitrines',
          icon: Globe
        }
      ]
    },
    {
      title: 'Collaboration',
      description: 'Travaillez avec d\'autres',
      icon: Briefcase,
      color: '#dc2626',
      bgColor: '#fef2f2',
      items: [
        {
          name: 'Missions partagées',
          description: 'Collaborez avec d\'autres auto-entrepreneurs',
          route: '/(tabs)/missions',
          feature: 'missions',
          icon: Briefcase
        }
      ]
    },
    {
      title: 'Informations',
      description: 'Actualités et aide',
      icon: Newspaper,
      color: '#eab308',
      bgColor: '#fefce8',
      items: [
        {
          name: 'Actualités & Emplois',
          description: 'Restez informé',
          route: '/(tabs)/actualites',
          feature: 'actualites',
          icon: Newspaper
        },
        {
          name: 'Centre d\'aide',
          description: 'Support et documentation',
          route: '/(tabs)/aide',
          feature: 'aide',
          icon: HelpCircle
        }
      ]
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Outils</Text>
        <Text style={styles.subtitle}>
          Tous vos outils de gestion en un seul endroit
        </Text>
        {plan && (
          <View style={[styles.planBadge, { backgroundColor: plan.couleur || '#2563eb' }]}>
            <Crown size={16} color="#ffffff" />
            <Text style={styles.planText}>{plan.nom}</Text>
          </View>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {outilsCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          
          return (
            <View key={categoryIndex} style={styles.categorySection}>
              <View style={[styles.categoryHeader, { backgroundColor: category.bgColor }]}>
                <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                  <CategoryIcon size={24} color="#ffffff" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </View>

              <View style={styles.categoryItems}>
                {category.items.map((item, itemIndex) => {
                  const ItemIcon = item.icon;
                  const hasFeatureAccess = hasAccess(item.feature);
                  
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={[
                        styles.toolItem,
                        !hasFeatureAccess && styles.toolItemDisabled
                      ]}
                      onPress={() => handleItemPress(item.route, item.feature)}
                    >
                      <View style={styles.toolItemContent}>
                        <View style={[
                          styles.toolIcon, 
                          { backgroundColor: hasFeatureAccess ? category.bgColor : '#f3f4f6' }
                        ]}>
                          <ItemIcon 
                            size={20} 
                            color={hasFeatureAccess ? category.color : '#9ca3af'} 
                          />
                        </View>
                        <View style={styles.toolInfo}>
                          <View style={styles.toolNameRow}>
                            <Text style={[
                              styles.toolName,
                              !hasFeatureAccess && styles.toolNameDisabled
                            ]}>
                              {item.name}
                            </Text>
                            {!hasFeatureAccess && (
                              <Lock size={14} color="#9ca3af" />
                            )}
                          </View>
                          <Text style={[
                            styles.toolDescription,
                            !hasFeatureAccess && styles.toolDescriptionDisabled
                          ]}>
                            {item.description}
                          </Text>
                          {!hasFeatureAccess && (
                            <Text style={styles.premiumLabel}>Premium requis</Text>
                          )}
                        </View>
                      </View>
                      <ChevronRight 
                        size={20} 
                        color={hasFeatureAccess ? "#9ca3af" : "#d1d5db"} 
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.quickActionsTitle}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/calculs')}
          >
            <Zap size={24} color="#2563eb" />
            <Text style={styles.quickActionText}>Calculer charges</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.quickActionCard,
              !hasAccess('sites-vitrines') && styles.quickActionDisabled
            ]}
            onPress={() => handleItemPress('/(tabs)/sites-vitrines', 'sites-vitrines')}
          >
            <Target size={24} color={hasAccess('sites-vitrines') ? "#059669" : "#9ca3af"} />
            <Text style={[
              styles.quickActionText,
              !hasAccess('sites-vitrines') && styles.quickActionTextDisabled
            ]}>
              Créer un site
            </Text>
            {!hasAccess('sites-vitrines') && (
              <Lock size={12} color="#9ca3af" style={styles.quickActionLock} />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/abonnement')}
          >
            <Palette size={24} color="#9333ea" />
            <Text style={styles.quickActionText}>Upgrader plan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>💡 Conseil du jour</Text>
        <Text style={styles.tipsText}>
          Utilisez le calculateur de charges pour estimer vos revenus nets et mieux planifier votre activité d'auto-entrepreneur.
        </Text>
        <TouchableOpacity 
          style={styles.tipsButton}
          onPress={() => router.push('/(tabs)/calculs')}
        >
          <Text style={styles.tipsButtonText}>Essayer maintenant</Text>
          <ChevronRight size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Upgrade Banner */}
      {(!plan || plan.nom === 'Freemium') && (
        <View style={styles.upgradeBanner}>
          <Crown size={24} color="#9333ea" />
          <View style={styles.upgradeContent}>
            <Text style={styles.upgradeTitle}>Débloquez toutes les fonctionnalités</Text>
            <Text style={styles.upgradeText}>
              Accédez aux sites vitrines, missions partagées et bien plus encore
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.upgradeButton}
            onPress={() => router.push('/(tabs)/abonnement')}
          >
            <Text style={styles.upgradeButtonText}>Upgrader</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  planBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  planText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoriesContainer: {
    padding: 16,
  },
  categorySection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  categoryItems: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  toolItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  toolItemDisabled: {
    opacity: 0.6,
  },
  toolItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toolIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  toolInfo: {
    flex: 1,
  },
  toolNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toolName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  toolNameDisabled: {
    color: '#9ca3af',
  },
  toolDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  toolDescriptionDisabled: {
    color: '#9ca3af',
  },
  premiumLabel: {
    fontSize: 12,
    color: '#9333ea',
    fontWeight: '500',
    marginTop: 2,
  },
  quickActionsSection: {
    padding: 16,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  quickActionDisabled: {
    opacity: 0.6,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionTextDisabled: {
    color: '#9ca3af',
  },
  quickActionLock: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tipsSection: {
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  tipsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  tipsButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginRight: 6,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  upgradeContent: {
    flex: 1,
    marginLeft: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7c3aed',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 14,
    color: '#8b5cf6',
  },
  upgradeButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
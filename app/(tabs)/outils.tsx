import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Calculator, Crown, Globe, CircleHelp as HelpCircle, Briefcase, Newspaper, ChevronRight, Zap, Target, Palette } from 'lucide-react-native';

export default function Outils() {
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
          icon: Newspaper
        },
        {
          name: 'Centre d\'aide',
          description: 'Support et documentation',
          route: '/(tabs)/aide',
          icon: HelpCircle
        }
      ]
    }
  ];

  const handleItemPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Outils</Text>
        <Text style={styles.subtitle}>
          Tous vos outils de gestion en un seul endroit
        </Text>
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
                  
                  return (
                    <TouchableOpacity
                      key={itemIndex}
                      style={styles.toolItem}
                      onPress={() => handleItemPress(item.route)}
                    >
                      <View style={styles.toolItemContent}>
                        <View style={[styles.toolIcon, { backgroundColor: category.bgColor }]}>
                          <ItemIcon size={20} color={category.color} />
                        </View>
                        <View style={styles.toolInfo}>
                          <Text style={styles.toolName}>{item.name}</Text>
                          <Text style={styles.toolDescription}>{item.description}</Text>
                        </View>
                      </View>
                      <ChevronRight size={20} color="#9ca3af" />
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
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/sites-vitrines')}
          >
            <Target size={24} color="#059669" />
            <Text style={styles.quickActionText}>Créer un site</Text>
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
  toolName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  toolDescription: {
    fontSize: 14,
    color: '#6b7280',
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
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
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
});
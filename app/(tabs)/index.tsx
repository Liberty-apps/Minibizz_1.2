import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { router } from 'expo-router';
import { FileText, Users, Euro, TrendingUp, Calendar, Plus, ArrowRight, Calculator, Crown, Globe, CircleAlert as AlertCircle, Clock, CircleCheck as CheckCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { dashboardService } from '../../src/services/database';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    clients: 0,
    devis: 0,
    factures: 0,
    chiffreAffaires: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    devis: [],
    factures: [],
    clients: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    
    try {
      setError(null);
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(user.id),
        dashboardService.getRecentActivity(user.id)
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Erreur lors du chargement du dashboard:', error);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleRetry = () => {
    setLoading(true);
    loadDashboardData();
  };

  const statsCards = [
    {
      name: 'Clients',
      value: stats.clients.toString(),
      icon: Users,
      color: '#2563eb',
      bgColor: '#eff6ff',
      route: '/(tabs)/clients',
      description: 'Clients enregistrés'
    },
    {
      name: 'Devis',
      value: stats.devis.toString(),
      icon: FileText,
      color: '#eab308',
      bgColor: '#fefce8',
      route: '/(tabs)/devis',
      description: 'Devis créés'
    },
    {
      name: 'CA Mensuel',
      value: `${stats.chiffreAffaires.toLocaleString('fr-FR')}€`,
      icon: Euro,
      color: '#16a34a',
      bgColor: '#f0fdf4',
      route: '/(tabs)/calculs',
      description: 'Chiffre d\'affaires'
    },
    {
      name: 'Croissance',
      value: '+15%',
      icon: TrendingUp,
      color: '#9333ea',
      bgColor: '#faf5ff',
      route: '/(tabs)/calculs',
      description: 'Par rapport au mois dernier'
    }
  ];

  const quickActions = [
    { 
      title: 'Nouveau devis', 
      icon: FileText, 
      color: '#2563eb',
      route: '/(tabs)/devis',
      description: 'Créer un devis'
    },
    { 
      title: 'Ajouter client', 
      icon: Users, 
      color: '#16a34a',
      route: '/(tabs)/clients',
      description: 'Nouveau client'
    },
    { 
      title: 'Planifier RDV', 
      icon: Calendar, 
      color: '#eab308',
      route: '/(tabs)/planning',
      description: 'Organiser planning'
    },
    { 
      title: 'Calculer charges', 
      icon: Calculator, 
      color: '#dc2626',
      route: '/(tabs)/calculs',
      description: 'Simulateur charges'
    },
    { 
      title: 'Mon abonnement', 
      icon: Crown, 
      color: '#9333ea',
      route: '/(tabs)/abonnement',
      description: 'Gérer abonnement'
    },
    { 
      title: 'Créer un site', 
      icon: Globe, 
      color: '#059669',
      route: '/(tabs)/sites-vitrines',
      description: 'Site vitrine'
    }
  ];

  const handleStatPress = (route: string) => {
    router.push(route as any);
  };

  const handleActionPress = (route: string) => {
    router.push(route as any);
  };

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <TrendingUp size={48} color="#2563eb" />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour {user?.name || 'Utilisateur'} ! 👋</Text>
          <Text style={styles.title}>Tableau de bord</Text>
        </View>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short' 
            })}
          </Text>
        </View>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <TouchableOpacity 
              key={index} 
              style={[styles.statCard, { backgroundColor: stat.bgColor }]}
              onPress={() => handleStatPress(stat.route)}
              accessibilityLabel={`${stat.name}: ${stat.value}`}
              accessibilityHint={stat.description}
            >
              <View style={styles.statContent}>
                <View style={styles.statInfo}>
                  <Text style={styles.statLabel}>{stat.name}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={styles.statDescription}>{stat.description}</Text>
                </View>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Icon size={20} color="#ffffff" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <TouchableOpacity 
                key={index} 
                style={styles.quickAction}
                onPress={() => handleActionPress(action.route)}
                accessibilityLabel={action.title}
                accessibilityHint={action.description}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>{action.description}</Text>
                <ArrowRight size={16} color="#9ca3af" />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityCard}>
          {recentActivity.devis.length > 0 && recentActivity.devis.map((devis: any) => (
            <TouchableOpacity 
              key={`devis-${devis.id}`}
              style={styles.activityItem}
              onPress={() => router.push(`/devis/${devis.id}`)}
              accessibilityLabel={`Devis ${devis.numero}`}
            >
              <View style={styles.activityIcon}>
                <FileText size={16} color="#2563eb" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Devis {devis.numero}</Text>
                <Text style={styles.activitySubtitle}>
                  Client: {devis.client?.nom || 'Non défini'}
                </Text>
              </View>
              <Text style={styles.activityTime}>
                {formatActivityDate(devis.created_at)}
              </Text>
            </TouchableOpacity>
          ))}
          
          {recentActivity.clients.length > 0 && recentActivity.clients.map((client: any) => (
            <TouchableOpacity 
              key={`client-${client.id}`}
              style={styles.activityItem}
              onPress={() => router.push(`/clients/${client.id}`)}
              accessibilityLabel={`Nouveau client ${client.nom}`}
            >
              <View style={styles.activityIcon}>
                <Users size={16} color="#16a34a" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Nouveau client</Text>
                <Text style={styles.activitySubtitle}>{client.nom}</Text>
              </View>
              <Text style={styles.activityTime}>
                {formatActivityDate(client.created_at)}
              </Text>
            </TouchableOpacity>
          ))}

          {recentActivity.factures.length > 0 && recentActivity.factures.map((facture: any) => (
            <TouchableOpacity 
              key={`facture-${facture.id}`}
              style={styles.activityItem}
              onPress={() => router.push(`/factures/${facture.id}`)}
              accessibilityLabel={`Facture ${facture.numero}`}
            >
              <View style={styles.activityIcon}>
                <Euro size={16} color="#eab308" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Facture {facture.numero}</Text>
                <Text style={styles.activitySubtitle}>
                  Client: {facture.client?.nom || 'Non défini'}
                </Text>
              </View>
              <Text style={styles.activityTime}>
                {formatActivityDate(facture.created_at)}
              </Text>
            </TouchableOpacity>
          ))}

          {recentActivity.devis.length === 0 && 
           recentActivity.clients.length === 0 && 
           recentActivity.factures.length === 0 && (
            <View style={styles.noActivity}>
              <Clock size={32} color="#d1d5db" />
              <Text style={styles.noActivityText}>Aucune activité récente</Text>
              <Text style={styles.noActivitySubtext}>
                Commencez par créer un client ou un devis
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Revenue Chart Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Évolution du CA</Text>
        <TouchableOpacity 
          style={styles.chartCard}
          onPress={() => router.push('/(tabs)/calculs')}
          accessibilityLabel="Voir les calculs de revenus"
        >
          <View style={styles.chartPlaceholder}>
            <BarChart3 size={48} color="#d1d5db" />
            <Text style={styles.chartText}>Graphique des revenus</Text>
            <Text style={styles.chartSubtext}>Évolution mensuelle</Text>
            <View style={styles.chartButton}>
              <Text style={styles.chartButtonText}>Voir les calculs</Text>
              <ArrowRight size={16} color="#2563eb" />
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 20,
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginRight: 8,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  noActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noActivityText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  noActivitySubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chartPlaceholder: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  chartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  chartButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginRight: 6,
  },
});
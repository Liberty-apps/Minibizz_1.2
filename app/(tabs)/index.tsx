import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Bell, ChevronRight, TrendingUp, Calendar, Users, FileText, Plus, CreditCard } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { dashboardService } from '../../src/services/database';
import FloatingActionButton from '../../components/FloatingActionButton';
import UserLogo from '../../components/UserLogo';

export default function HomeScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      if (!user) return;
      
      const [statsData, activityData] = await Promise.all([
        dashboardService.getStats(user.id),
        dashboardService.getRecentActivity(user.id)
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <UserLogo />
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#0f172a" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Users size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>{stats.clients}</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
              <FileText size={20} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>{stats.devis}</Text>
            <Text style={styles.statLabel}>Devis</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
              <CreditCard size={20} color="#16a34a" />
            </View>
            <Text style={styles.statValue}>{stats.factures}</Text>
            <Text style={styles.statLabel}>Factures</Text>
          </View>
        </View>

        {/* CA Overview */}
        <View style={styles.caContainer}>
          <View style={styles.caHeader}>
            <Text style={styles.caTitle}>Chiffre d'affaires</Text>
            <Text style={styles.caSubtitle}>Ce mois-ci</Text>
          </View>
          <Text style={styles.caValue}>{stats.chiffreAffaires.toLocaleString('fr-FR')} €</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#dbeafe' }]}>
                <FileText size={20} color="#2563eb" />
              </View>
              <Text style={styles.actionText}>Nouveau devis</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#dcfce7' }]}>
                <Users size={20} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>Ajouter client</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Calendar size={20} color="#d97706" />
              </View>
              <Text style={styles.actionText}>Rendez-vous</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Clients */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Clients récents</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Voir tous</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {recentActivity.clients.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun client pour le moment</Text>
              <TouchableOpacity style={styles.emptyButton}>
                <Plus size={16} color="#3b82f6" />
                <Text style={styles.emptyButtonText}>Ajouter un client</Text>
              </TouchableOpacity>
            </View>
          ) : (
            recentActivity.clients.map((client, index) => (
              <TouchableOpacity key={client.id} style={styles.clientItem}>
                <View style={styles.clientAvatar}>
                  <Text style={styles.clientAvatarText}>{client.nom.charAt(0)}</Text>
                </View>
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.nom}</Text>
                  <Text style={styles.clientDate}>Ajouté le {formatDate(client.created_at)}</Text>
                </View>
                <ChevronRight size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Recent Documents */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Documents récents</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Voir tous</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          {recentActivity.devis.length === 0 && recentActivity.factures.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Aucun document pour le moment</Text>
              <TouchableOpacity style={styles.emptyButton}>
                <Plus size={16} color="#3b82f6" />
                <Text style={styles.emptyButtonText}>Créer un document</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {recentActivity.devis.map((devis, index) => (
                <TouchableOpacity key={devis.id} style={styles.documentItem}>
                  <View style={[styles.documentIcon, { backgroundColor: '#eff6ff' }]}>
                    <FileText size={20} color="#2563eb" />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{devis.numero}</Text>
                    <Text style={styles.documentClient}>{devis.client?.nom || 'Client inconnu'}</Text>
                    <Text style={styles.documentDate}>{formatDate(devis.created_at)}</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
              
              {recentActivity.factures.map((facture, index) => (
                <TouchableOpacity key={facture.id} style={styles.documentItem}>
                  <View style={[styles.documentIcon, { backgroundColor: '#f0fdf4' }]}>
                    <CreditCard size={20} color="#16a34a" />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{facture.numero}</Text>
                    <Text style={styles.documentClient}>{facture.client?.nom || 'Client inconnu'}</Text>
                    <Text style={styles.documentDate}>{formatDate(facture.created_at)}</Text>
                  </View>
                  <ChevronRight size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Astuce du jour</Text>
          <Text style={styles.tipsText}>
            Utilisez le calculateur de charges pour estimer vos revenus nets et mieux planifier votre activité.
          </Text>
        </View>
      </ScrollView>
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  caContainer: {
    backgroundColor: '#ffffff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  caHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  caTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
  },
  caSubtitle: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  caValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'Inter-Bold',
  },
  sectionContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#0f172a',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  clientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  clientDate: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
    fontFamily: 'Inter-Medium',
  },
  documentClient: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  documentDate: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  tipsContainer: {
    backgroundColor: '#eff6ff',
    margin: 20,
    marginTop: 8,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 30,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#1e40af',
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});
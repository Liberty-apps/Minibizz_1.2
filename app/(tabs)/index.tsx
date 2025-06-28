import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  FileText, 
  Users, 
  Euro, 
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight
} from 'lucide-react-native';

export default function Dashboard() {
  const stats = [
    {
      name: 'Clients',
      value: '12',
      icon: Users,
      color: '#2563eb',
      bgColor: '#eff6ff'
    },
    {
      name: 'Devis',
      value: '8',
      icon: FileText,
      color: '#eab308',
      bgColor: '#fefce8'
    },
    {
      name: 'CA Mensuel',
      value: '3 450€',
      icon: Euro,
      color: '#16a34a',
      bgColor: '#f0fdf4'
    },
    {
      name: 'Croissance',
      value: '+15%',
      icon: TrendingUp,
      color: '#9333ea',
      bgColor: '#faf5ff'
    }
  ];

  const quickActions = [
    { title: 'Nouveau devis', icon: FileText, color: '#2563eb' },
    { title: 'Ajouter client', icon: Users, color: '#16a34a' },
    { title: 'Planifier RDV', icon: Calendar, color: '#eab308' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour ! 👋</Text>
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

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <View key={index} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>{stat.name}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Icon size={20} color="#ffffff" />
                </View>
              </View>
            </View>
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
              <TouchableOpacity key={index} style={styles.quickAction}>
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <Icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
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
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <FileText size={16} color="#2563eb" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Devis DEV-2024-001</Text>
              <Text style={styles.activitySubtitle}>Client: Entreprise ABC</Text>
            </View>
            <Text style={styles.activityValue}>1 250€</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Users size={16} color="#16a34a" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nouveau client</Text>
              <Text style={styles.activitySubtitle}>Marie Dupont</Text>
            </View>
            <Text style={styles.activityTime}>Il y a 2h</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Calendar size={16} color="#eab308" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>RDV programmé</Text>
              <Text style={styles.activitySubtitle}>Demain 14h00</Text>
            </View>
            <Text style={styles.activityTime}>Il y a 1h</Text>
          </View>
        </View>
      </View>

      {/* Revenue Chart Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Évolution du CA</Text>
        <View style={styles.chartCard}>
          <View style={styles.chartPlaceholder}>
            <TrendingUp size={48} color="#d1d5db" />
            <Text style={styles.chartText}>Graphique des revenus</Text>
            <Text style={styles.chartSubtext}>Évolution mensuelle</Text>
          </View>
        </View>
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
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
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
  activityValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
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
});
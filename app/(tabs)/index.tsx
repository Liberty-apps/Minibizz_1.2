import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { 
  FileText, 
  Users, 
  Euro, 
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react-native';
import { getClients, getDevis, getFactures, getUserSettings } from '../../src/utils/storage';
import { formatCurrency, calculateNetRevenue } from '../../src/utils/calculations';
import { Client, Devis, Facture, UserSettings } from '../../src/types';

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [devis, setDevis] = useState<Devis[]>([]);
  const [factures, setFactures] = useState<Facture[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  useEffect(() => {
    setClients(getClients());
    setDevis(getDevis());
    setFactures(getFactures());
    setSettings(getUserSettings());
  }, []);

  const totalFacture = factures.reduce((sum, facture) => sum + facture.total, 0);
  const facturesPayees = factures.filter(f => f.statut === 'payee');
  const totalPaye = facturesPayees.reduce((sum, facture) => sum + facture.total, 0);
  
  const netRevenue = settings ? calculateNetRevenue(totalPaye, settings.activite) : 0;

  const recentDevis = devis.slice(0, 3);
  const recentFactures = factures.slice(0, 3);

  const stats = [
    {
      name: 'Clients',
      value: clients.length.toString(),
      icon: Users,
      color: '#2563eb',
    },
    {
      name: 'Devis',
      value: devis.length.toString(),
      icon: FileText,
      color: '#eab308',
    },
    {
      name: 'Factures',
      value: factures.length.toString(),
      icon: FileText,
      color: '#16a34a',
    },
    {
      name: 'CA Total',
      value: formatCurrency(totalPaye),
      icon: Euro,
      color: '#9333ea',
    }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'brouillon': return '#6b7280';
      case 'envoye': case 'envoyee': return '#2563eb';
      case 'accepte': case 'payee': return '#16a34a';
      case 'refuse': case 'en_retard': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'devis':
        router.push('/(tabs)/devis');
        break;
      case 'facture':
        router.push('/(tabs)/devis');
        break;
      case 'client':
        router.push('/(tabs)/clients');
        break;
      default:
        break;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Vue d'ensemble de votre activité</Text>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6b7280" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <View key={stat.name} style={styles.statCard}>
              <View style={styles.statContent}>
                <View>
                  <Text style={styles.statLabel}>{stat.name}</Text>
                  <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                </View>
                <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                  <Icon size={24} color="#ffffff" />
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Revenue Summary */}
      {settings && (
        <View style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <TrendingUp size={24} color="#2563eb" />
            <Text style={styles.revenueTitle}>Revenus estimés</Text>
          </View>
          <View style={styles.revenueGrid}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Chiffre d'affaires brut</Text>
              <Text style={styles.revenueValue}>{formatCurrency(totalPaye)}</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Charges sociales estimées</Text>
              <Text style={[styles.revenueValue, { color: '#dc2626' }]}>
                -{formatCurrency(totalPaye - netRevenue)}
              </Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueLabel}>Revenu net estimé</Text>
              <Text style={[styles.revenueValue, { color: '#16a34a' }]}>
                {formatCurrency(netRevenue)}
              </Text>
            </View>
          </View>
          <Text style={styles.revenueNote}>
            * Estimation basée sur le taux de charges sociales pour l'activité {settings.activite}
          </Text>
        </View>
      )}

      {/* Recent Activity */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Activité récente</Text>
        
        {/* Recent Devis */}
        <View style={styles.activityCard}>
          <Text style={styles.activityCardTitle}>Devis récents</Text>
          {recentDevis.length > 0 ? (
            recentDevis.map((devis) => (
              <View key={devis.id} style={styles.activityItem}>
                <View style={styles.activityItemContent}>
                  <Text style={styles.activityItemTitle}>{devis.numero}</Text>
                  <Text style={styles.activityItemSubtitle}>{devis.client.nom}</Text>
                </View>
                <View style={styles.activityItemRight}>
                  <Text style={styles.activityItemValue}>{formatCurrency(devis.total)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatutColor(devis.statut) }]}>
                    <Text style={styles.statusText}>{devis.statut}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FileText size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Aucun devis créé</Text>
            </View>
          )}
        </View>

        {/* Recent Factures */}
        <View style={styles.activityCard}>
          <Text style={styles.activityCardTitle}>Factures récentes</Text>
          {recentFactures.length > 0 ? (
            recentFactures.map((facture) => (
              <View key={facture.id} style={styles.activityItem}>
                <View style={styles.activityItemContent}>
                  <Text style={styles.activityItemTitle}>{facture.numero}</Text>
                  <Text style={styles.activityItemSubtitle}>{facture.client.nom}</Text>
                </View>
                <View style={styles.activityItemRight}>
                  <Text style={styles.activityItemValue}>{formatCurrency(facture.total)}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatutColor(facture.statut) }]}>
                    <Text style={styles.statusText}>{facture.statut}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <FileText size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Aucune facture créée</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsCard}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('devis')}
          >
            <FileText size={20} color="#6b7280" />
            <Text style={styles.quickActionText}>Nouveau devis</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('facture')}
          >
            <FileText size={20} color="#6b7280" />
            <Text style={styles.quickActionText}>Nouvelle facture</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => handleQuickAction('client')}
          >
            <Users size={20} color="#6b7280" />
            <Text style={styles.quickActionText}>Nouveau client</Text>
          </TouchableOpacity>
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
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revenueCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    margin: 16,
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  revenueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  revenueGrid: {
    gap: 16,
  },
  revenueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  revenueValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  revenueNote: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 12,
  },
  activitySection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  activityItemContent: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  activityItemSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  activityItemRight: {
    alignItems: 'flex-end',
  },
  activityItemValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 12,
  },
  quickActionsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderColor: '#d1d5db',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FileText, Plus, Search, Filter, Eye, CreditCard as Edit, Download, Send } from 'lucide-react-native';

export default function Devis() {
  const [activeTab, setActiveTab] = useState<'devis' | 'factures'>('devis');

  const devisList = [
    {
      id: '1',
      numero: 'DEV-2024-001',
      client: 'Entreprise ABC',
      date: '15/01/2024',
      montant: '1 250€',
      statut: 'En attente',
      statutColor: '#eab308'
    },
    {
      id: '2',
      numero: 'DEV-2024-002',
      client: 'Marie Dupont',
      date: '12/01/2024',
      montant: '850€',
      statut: 'Accepté',
      statutColor: '#16a34a'
    },
    {
      id: '3',
      numero: 'DEV-2024-003',
      client: 'Tech Solutions',
      date: '10/01/2024',
      montant: '2 100€',
      statut: 'Brouillon',
      statutColor: '#6b7280'
    }
  ];

  const facturesList = [
    {
      id: '1',
      numero: 'FAC-2024-001',
      client: 'Entreprise ABC',
      date: '20/01/2024',
      echeance: '20/02/2024',
      montant: '1 250€',
      statut: 'Payée',
      statutColor: '#16a34a'
    },
    {
      id: '2',
      numero: 'FAC-2024-002',
      client: 'Marie Dupont',
      date: '18/01/2024',
      echeance: '18/02/2024',
      montant: '850€',
      statut: 'Envoyée',
      statutColor: '#2563eb'
    }
  ];

  const currentList = activeTab === 'devis' ? devisList : facturesList;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Devis & Factures</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'devis' && styles.activeTab]}
          onPress={() => setActiveTab('devis')}
        >
          <Text style={[styles.tabText, activeTab === 'devis' && styles.activeTabText]}>
            Devis ({devisList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'factures' && styles.activeTab]}
          onPress={() => setActiveTab('factures')}
        >
          <Text style={[styles.tabText, activeTab === 'factures' && styles.activeTabText]}>
            Factures ({facturesList.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>Rechercher...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {currentList.map((item) => (
          <View key={item.id} style={styles.listItem}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.itemNumber}>{item.numero}</Text>
                <Text style={styles.itemClient}>{item.client}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text style={styles.itemAmount}>{item.montant}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.statutColor }]}>
                  <Text style={styles.statusText}>{item.statut}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.itemDetails}>
              <Text style={styles.itemDate}>Date: {item.date}</Text>
              {activeTab === 'factures' && 'echeance' in item && (
                <Text style={styles.itemDate}>Échéance: {item.echeance}</Text>
              )}
            </View>

            <View style={styles.itemActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Eye size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Edit size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Download size={16} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Send size={16} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#2563eb',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    color: '#9ca3af',
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#ffffff',
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  listItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemClient: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
  },
  itemAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemDate: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
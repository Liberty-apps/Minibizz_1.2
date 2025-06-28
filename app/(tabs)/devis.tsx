import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { FileText, Plus, Search, Filter, Eye, Edit3, Download, Send, Calendar, Euro } from 'lucide-react-native';

export default function Devis() {
  const [activeTab, setActiveTab] = useState<'devis' | 'factures'>('devis');
  const [searchTerm, setSearchTerm] = useState('');

  const devisList = [
    {
      id: '1',
      numero: 'DEV-2024-001',
      client: 'Entreprise ABC',
      date: '15/01/2024',
      montant: '1 250€',
      statut: 'En attente',
      statutColor: '#eab308',
      validite: '15/02/2024'
    },
    {
      id: '2',
      numero: 'DEV-2024-002',
      client: 'Marie Dupont',
      date: '12/01/2024',
      montant: '850€',
      statut: 'Accepté',
      statutColor: '#16a34a',
      validite: '12/02/2024'
    },
    {
      id: '3',
      numero: 'DEV-2024-003',
      client: 'Tech Solutions',
      date: '10/01/2024',
      montant: '2 100€',
      statut: 'Brouillon',
      statutColor: '#6b7280',
      validite: '10/02/2024'
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
    },
    {
      id: '3',
      numero: 'FAC-2024-003',
      client: 'Tech Solutions',
      date: '16/01/2024',
      echeance: '16/02/2024',
      montant: '2 100€',
      statut: 'En retard',
      statutColor: '#dc2626'
    }
  ];

  const currentList = activeTab === 'devis' ? devisList : facturesList;

  const filteredList = currentList.filter(item =>
    item.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    // Navigation vers la création d'un nouveau document
    console.log(`Créer nouveau ${activeTab}`);
  };

  const handleViewDocument = (id: string) => {
    console.log(`Voir ${activeTab} ${id}`);
  };

  const handleEditDocument = (id: string) => {
    console.log(`Modifier ${activeTab} ${id}`);
  };

  const handleDownloadDocument = (id: string) => {
    console.log(`Télécharger ${activeTab} ${id}`);
  };

  const handleSendDocument = (id: string) => {
    console.log(`Envoyer ${activeTab} ${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Devis & Factures</Text>
          <Text style={styles.subtitle}>
            Gérez vos documents commerciaux
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateNew}>
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
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Rechercher par client ou numéro..."
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredList.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>
              {searchTerm ? 'Aucun résultat' : `Aucun ${activeTab}`}
            </Text>
            <Text style={styles.emptyText}>
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés'
                : `Créez votre premier ${activeTab} en appuyant sur le bouton +`
              }
            </Text>
          </View>
        ) : (
          filteredList.map((item) => (
            <View key={item.id} style={styles.listItem}>
              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
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
                <View style={styles.detailRow}>
                  <Calendar size={14} color="#6b7280" />
                  <Text style={styles.itemDate}>Émis le {item.date}</Text>
                </View>
                {activeTab === 'devis' && 'validite' in item && (
                  <View style={styles.detailRow}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.itemDate}>Valide jusqu'au {item.validite}</Text>
                  </View>
                )}
                {activeTab === 'factures' && 'echeance' in item && (
                  <View style={styles.detailRow}>
                    <Euro size={14} color="#6b7280" />
                    <Text style={styles.itemDate}>Échéance: {item.echeance}</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleViewDocument(item.id)}
                >
                  <Eye size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditDocument(item.id)}
                >
                  <Edit3 size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDownloadDocument(item.id)}
                >
                  <Download size={16} color="#6b7280" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSendDocument(item.id)}
                >
                  <Send size={16} color="#6b7280" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Stats Footer */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {activeTab === 'devis' ? devisList.length : facturesList.length}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {activeTab === 'devis' 
              ? devisList.filter(d => d.statut === 'En attente').length
              : facturesList.filter(f => f.statut === 'Envoyée').length
            }
          </Text>
          <Text style={styles.statLabel}>
            {activeTab === 'devis' ? 'En attente' : 'En cours'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {activeTab === 'devis' 
              ? devisList.filter(d => d.statut === 'Accepté').length
              : facturesList.filter(f => f.statut === 'Payée').length
            }
          </Text>
          <Text style={styles.statLabel}>
            {activeTab === 'devis' ? 'Acceptés' : 'Payées'}
          </Text>
        </View>
      </View>
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
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
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
  itemInfo: {
    flex: 1,
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
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemDate: {
    fontSize: 12,
    color: '#6b7280',
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
  statsFooter: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
});
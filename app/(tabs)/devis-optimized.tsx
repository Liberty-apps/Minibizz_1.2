import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FileText, Plus, Search, Filter, Eye, CreditCard as Edit, Download, Send } from 'lucide-react-native';
import { OptimizedList } from '../../components/OptimizedList';
import { useOptimizedData, usePagination } from '../../hooks/useOptimizedData';

interface DevisItem {
  id: string;
  numero: string;
  client: string;
  date: string;
  montant: string;
  statut: string;
  statutColor: string;
  echeance?: string;
}

// Composant d'item memoizé
const DevisListItem = memo(({ item, isFacture }: { item: DevisItem; isFacture: boolean }) => (
  <View style={styles.listItem}>
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
      {isFacture && item.echeance && (
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
));

export default function DevisOptimized() {
  const [activeTab, setActiveTab] = useState<'devis' | 'factures'>('devis');

  // Données simulées plus importantes pour tester la performance
  const devisList: DevisItem[] = Array.from({ length: 100 }, (_, i) => ({
    id: `devis-${i}`,
    numero: `DEV-2024-${String(i + 1).padStart(3, '0')}`,
    client: `Client ${i + 1}`,
    date: new Date(2024, 0, i + 1).toLocaleDateString('fr-FR'),
    montant: `${(Math.random() * 5000 + 500).toFixed(0)}€`,
    statut: ['En attente', 'Accepté', 'Brouillon'][i % 3],
    statutColor: ['#eab308', '#16a34a', '#6b7280'][i % 3],
  }));

  const facturesList: DevisItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: `facture-${i}`,
    numero: `FAC-2024-${String(i + 1).padStart(3, '0')}`,
    client: `Client ${i + 1}`,
    date: new Date(2024, 0, i + 1).toLocaleDateString('fr-FR'),
    echeance: new Date(2024, 1, i + 1).toLocaleDateString('fr-FR'),
    montant: `${(Math.random() * 5000 + 500).toFixed(0)}€`,
    statut: ['Payée', 'Envoyée'][i % 2],
    statutColor: ['#16a34a', '#2563eb'][i % 2],
  }));

  const currentList = activeTab === 'devis' ? devisList : facturesList;
  
  // Utilisation des hooks optimisés
  const { data, searchTerm, isLoading, handleSearch } = useOptimizedData(
    currentList,
    'client'
  );

  const {
    data: paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNext,
    hasPrev,
  } = usePagination(data, 20);

  const renderItem = useCallback((item: DevisItem) => (
    <DevisListItem item={item} isFacture={activeTab === 'factures'} />
  ), [activeTab]);

  const keyExtractor = useCallback((item: DevisItem) => item.id, []);

  const handleEndReached = useCallback(() => {
    if (hasNext) {
      nextPage();
    }
  }, [hasNext, nextPage]);

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

      {/* Search optimisée */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un client..."
            value={searchTerm}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Liste optimisée */}
      <View style={styles.listContainer}>
        <OptimizedList
          data={paginatedData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          estimatedItemSize={120}
        />
      </View>

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity 
          style={[styles.paginationButton, !hasPrev && styles.disabledButton]}
          onPress={prevPage}
          disabled={!hasPrev}
        >
          <Text style={styles.paginationText}>Précédent</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageInfo}>
          Page {currentPage} sur {totalPages}
        </Text>
        
        <TouchableOpacity 
          style={[styles.paginationButton, !hasNext && styles.disabledButton]}
          onPress={nextPage}
          disabled={!hasNext}
        >
          <Text style={styles.paginationText}>Suivant</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 16,
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  paginationButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  paginationText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  pageInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
});
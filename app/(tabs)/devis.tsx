import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { FileText, Plus, Search, Filter, Eye, CreditCard as Edit3, Download, Send, Calendar, Euro, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { devisService, facturesService } from '../../src/services/database';

export default function Devis() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'devis' | 'factures'>('devis');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [devisList, setDevisList] = useState<any[]>([]);
  const [facturesList, setFacturesList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      // Rediriger vers la connexion si pas d'utilisateur
      router.replace('/(auth)/login');
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [devisData, facturesData] = await Promise.all([
        devisService.getAll(user.id),
        facturesService.getAll(user.id)
      ]);
      
      setDevisList(devisData);
      setFacturesList(facturesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setError('Impossible de charger les documents');
    } finally {
      setLoading(false);
    }
  };

  const currentList = activeTab === 'devis' ? devisList : facturesList;

  const filteredList = currentList.filter(item =>
    item.client?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un document');
      router.replace('/(auth)/login');
      return;
    }

    try {
      if (activeTab === 'devis') {
        const numero = await devisService.generateNumero(user.id);
        // Pour l'instant, on affiche juste une alerte
        Alert.alert('Création de devis', `Nouveau devis ${numero} - Fonctionnalité en cours de développement`);
      } else {
        const numero = await facturesService.generateNumero(user.id);
        // Pour l'instant, on affiche juste une alerte
        Alert.alert('Création de facture', `Nouvelle facture ${numero} - Fonctionnalité en cours de développement`);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le document');
    }
  };

  const handleViewDocument = (id: string) => {
    Alert.alert('Consultation', `Consultation du ${activeTab} ${id} - Fonctionnalité en cours de développement`);
  };

  const handleEditDocument = (id: string) => {
    Alert.alert('Modification', `Modification du ${activeTab} ${id} - Fonctionnalité en cours de développement`);
  };

  const handleDownloadDocument = (id: string) => {
    Alert.alert('Téléchargement', `Téléchargement du ${activeTab} ${id} en cours...`);
  };

  const handleSendDocument = (id: string) => {
    Alert.alert('Envoi', `Envoi du ${activeTab} ${id} - Fonctionnalité en cours de développement`);
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'accepte':
      case 'payee':
        return CheckCircle;
      case 'en_retard':
      case 'expire':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'accepte':
      case 'payee':
        return '#16a34a';
      case 'envoye':
      case 'envoyee':
        return '#2563eb';
      case 'en_attente':
        return '#eab308';
      case 'en_retard':
      case 'expire':
        return '#dc2626';
      case 'refuse':
      case 'annulee':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Vérifier l'authentification
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <FileText size={64} color="#d1d5db" />
        <Text style={styles.authTitle}>Connexion requise</Text>
        <Text style={styles.authText}>
          Vous devez être connecté pour accéder à vos documents
        </Text>
        <TouchableOpacity 
          style={styles.authButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.authButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <FileText size={48} color="#2563eb" />
        <Text style={styles.loadingText}>Chargement des documents...</Text>
      </View>
    );
  }

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

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

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
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
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
            {!searchTerm && (
              <TouchableOpacity style={styles.createFirstButton} onPress={handleCreateNew}>
                <Text style={styles.createFirstText}>Créer mon premier {activeTab}</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredList.map((item) => {
            const StatusIcon = getStatusIcon(item.statut);
            const statusColor = getStatusColor(item.statut);
            
            return (
              <TouchableOpacity 
                key={item.id} 
                style={styles.listItem}
                onPress={() => handleViewDocument(item.id)}
              >
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemNumber}>{item.numero}</Text>
                    <Text style={styles.itemClient}>
                      {item.client?.nom || 'Client non défini'}
                    </Text>
                  </View>
                  <View style={styles.itemRight}>
                    <Text style={styles.itemAmount}>
                      {item.montant_ttc?.toLocaleString('fr-FR')}€
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                      <StatusIcon size={12} color="#ffffff" />
                      <Text style={styles.statusText}>{item.statut}</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.itemDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.itemDate}>
                      Émis le {new Date(item.date_emission).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                  {activeTab === 'devis' && item.date_validite && (
                    <View style={styles.detailRow}>
                      <Clock size={14} color="#6b7280" />
                      <Text style={styles.itemDate}>
                        Valide jusqu'au {new Date(item.date_validite).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                  )}
                  {activeTab === 'factures' && item.date_echeance && (
                    <View style={styles.detailRow}>
                      <Euro size={14} color="#6b7280" />
                      <Text style={styles.itemDate}>
                        Échéance: {new Date(item.date_echeance).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleViewDocument(item.id);
                    }}
                  >
                    <Eye size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleEditDocument(item.id);
                    }}
                  >
                    <Edit3 size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDownloadDocument(item.id);
                    }}
                  >
                    <Download size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleSendDocument(item.id);
                    }}
                  >
                    <Send size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })
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
              ? devisList.filter(d => d.statut === 'en_attente').length
              : facturesList.filter(f => f.statut === 'envoyee').length
            }
          </Text>
          <Text style={styles.statLabel}>
            {activeTab === 'devis' ? 'En attente' : 'En cours'}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {activeTab === 'devis' 
              ? devisList.filter(d => d.statut === 'accepte').length
              : facturesList.filter(f => f.statut === 'payee').length
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
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  authText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  authButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
  clearSearch: {
    fontSize: 16,
    color: '#9ca3af',
    fontWeight: 'bold',
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
  createFirstButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createFirstText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
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
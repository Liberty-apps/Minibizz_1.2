import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Users, Plus, Search, Mail, Phone, MapPin, Building, User, Filter, AlertCircle, Edit3, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { clientsService } from '../../src/services/database';

export default function Clients() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'particulier' | 'entreprise'>('all');

  useEffect(() => {
    loadClients();
  }, [user]);

  const loadClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await clientsService.getAll(user.id);
      setClientsList(data);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      setError('Impossible de charger les clients');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clientsList.filter(client => {
    const matchesSearch = 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.prenom && client.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.entreprise && client.entreprise.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || client.type_client === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const handleAddClient = () => {
    Alert.alert('Ajouter un client', 'Fonctionnalité en cours de développement');
  };

  const handleClientPress = (clientId: string) => {
    Alert.alert('Voir le client', `Détails du client ${clientId}`);
  };

  const handleEditClient = (clientId: string) => {
    Alert.alert('Modifier le client', `Modification du client ${clientId}`);
  };

  const handleDeleteClient = (clientId: string, clientName: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le client "${clientName}" ?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await clientsService.delete(clientId);
              Alert.alert('Succès', 'Client supprimé avec succès');
              loadClients();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le client');
            }
          }
        }
      ]
    );
  };

  const getClientDisplayName = (client: any) => {
    if (client.type_client === 'entreprise') {
      return client.entreprise || client.nom;
    }
    return `${client.prenom || ''} ${client.nom}`.trim();
  };

  const getClientTypeIcon = (type: string) => {
    return type === 'entreprise' ? Building : User;
  };

  const getClientAvatar = (client: any) => {
    if (client.type_client === 'entreprise') {
      return (client.entreprise || client.nom).substring(0, 2).toUpperCase();
    }
    const prenom = client.prenom || '';
    const nom = client.nom || '';
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement des clients...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.subtitle}>
            {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddClient}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadClients}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Rechercher un client..."
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

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'all' && styles.activeFilterTab]}
          onPress={() => setFilterType('all')}
        >
          <Text style={[styles.filterTabText, filterType === 'all' && styles.activeFilterTabText]}>
            Tous ({clientsList.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'particulier' && styles.activeFilterTab]}
          onPress={() => setFilterType('particulier')}
        >
          <Text style={[styles.filterTabText, filterType === 'particulier' && styles.activeFilterTabText]}>
            Particuliers ({clientsList.filter(c => c.type_client === 'particulier').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, filterType === 'entreprise' && styles.activeFilterTab]}
          onPress={() => setFilterType('entreprise')}
        >
          <Text style={[styles.filterTabText, filterType === 'entreprise' && styles.activeFilterTabText]}>
            Entreprises ({clientsList.filter(c => c.type_client === 'entreprise').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Clients List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>
              {searchTerm ? 'Aucun client trouvé' : 'Aucun client'}
            </Text>
            <Text style={styles.emptyText}>
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés'
                : 'Ajoutez votre premier client en appuyant sur le bouton +'
              }
            </Text>
            {!searchTerm && (
              <TouchableOpacity style={styles.createFirstButton} onPress={handleAddClient}>
                <Text style={styles.createFirstText}>Ajouter mon premier client</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredClients.map((client) => {
            const TypeIcon = getClientTypeIcon(client.type_client);
            return (
              <TouchableOpacity 
                key={client.id} 
                style={styles.clientCard}
                onPress={() => handleClientPress(client.id)}
              >
                <View style={styles.clientHeader}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{getClientAvatar(client)}</Text>
                    </View>
                    <View style={styles.typeIndicator}>
                      <TypeIcon size={12} color="#6b7280" />
                    </View>
                  </View>
                  
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>
                      {getClientDisplayName(client)}
                    </Text>
                    
                    {client.email && (
                      <View style={styles.contactInfo}>
                        <Mail size={14} color="#6b7280" />
                        <Text style={styles.contactText}>{client.email}</Text>
                      </View>
                    )}
                    
                    {client.telephone && (
                      <View style={styles.contactInfo}>
                        <Phone size={14} color="#6b7280" />
                        <Text style={styles.contactText}>{client.telephone}</Text>
                      </View>
                    )}
                    
                    {(client.ville || client.adresse) && (
                      <View style={styles.contactInfo}>
                        <MapPin size={14} color="#6b7280" />
                        <Text style={styles.contactText}>
                          {client.ville || client.adresse}
                        </Text>
                      </View>
                    )}
                    
                    {client.siret && (
                      <View style={styles.contactInfo}>
                        <Building size={14} color="#6b7280" />
                        <Text style={styles.contactText}>SIRET: {client.siret}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.clientActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleEditClient(client.id);
                      }}
                    >
                      <Edit3 size={16} color="#6b7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDeleteClient(client.id, getClientDisplayName(client));
                      }}
                    >
                      <Trash2 size={16} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
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
            {clientsList.filter(c => c.type_client === 'particulier').length}
          </Text>
          <Text style={styles.statLabel}>Particuliers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {clientsList.filter(c => c.type_client === 'entreprise').length}
          </Text>
          <Text style={styles.statLabel}>Entreprises</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{clientsList.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
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
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Regular',
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
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  activeFilterTabText: {
    color: '#111827',
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
    fontFamily: 'Inter-SemiBold',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
  },
  clientCard: {
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
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    fontFamily: 'Inter-Regular',
  },
  clientActions: {
    flexDirection: 'row',
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
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
});
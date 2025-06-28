import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router } from 'expo-router';
import { 
  Users, 
  Plus, 
  Search, 
  Mail,
  Phone,
  MapPin,
  Building,
  User,
  Filter
} from 'lucide-react-native';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');

  const clientsList = [
    {
      id: '1',
      nom: 'Entreprise ABC',
      prenom: '',
      email: 'contact@abc.com',
      telephone: '01 23 45 67 89',
      adresse: 'Paris, France',
      siret: '12345678901234',
      type: 'entreprise',
      avatar: 'EA'
    },
    {
      id: '2',
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      adresse: 'Lyon, France',
      siret: '',
      type: 'particulier',
      avatar: 'MD'
    },
    {
      id: '3',
      nom: 'Tech Solutions',
      prenom: '',
      email: 'hello@techsolutions.fr',
      telephone: '04 56 78 90 12',
      adresse: 'Marseille, France',
      siret: '98765432109876',
      type: 'entreprise',
      avatar: 'TS'
    },
    {
      id: '4',
      nom: 'Martin',
      prenom: 'Jean',
      email: 'jean.martin@gmail.com',
      telephone: '02 34 56 78 90',
      adresse: 'Nantes, France',
      siret: '',
      type: 'particulier',
      avatar: 'JM'
    }
  ];

  const filteredClients = clientsList.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClient = () => {
    console.log('Ajouter un nouveau client');
  };

  const handleClientPress = (clientId: string) => {
    console.log('Voir client:', clientId);
  };

  const getClientDisplayName = (client: any) => {
    if (client.type === 'entreprise') {
      return client.nom;
    }
    return `${client.prenom} ${client.nom}`.trim();
  };

  const getClientTypeIcon = (type: string) => {
    return type === 'entreprise' ? Building : User;
  };

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
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
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
          </View>
        ) : (
          filteredClients.map((client) => {
            const TypeIcon = getClientTypeIcon(client.type);
            return (
              <TouchableOpacity 
                key={client.id} 
                style={styles.clientCard}
                onPress={() => handleClientPress(client.id)}
              >
                <View style={styles.clientHeader}>
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{client.avatar}</Text>
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
                    
                    {client.adresse && (
                      <View style={styles.contactInfo}>
                        <MapPin size={14} color="#6b7280" />
                        <Text style={styles.contactText}>{client.adresse}</Text>
                      </View>
                    )}
                    
                    {client.siret && (
                      <View style={styles.contactInfo}>
                        <Building size={14} color="#6b7280" />
                        <Text style={styles.contactText}>SIRET: {client.siret}</Text>
                      </View>
                    )}
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
            {clientsList.filter(c => c.type === 'particulier').length}
          </Text>
          <Text style={styles.statLabel}>Particuliers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {clientsList.filter(c => c.type === 'entreprise').length}
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
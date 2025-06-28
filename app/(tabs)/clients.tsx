import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Users, 
  Plus, 
  Search, 
  Mail,
  Phone,
  MapPin,
  Building
} from 'lucide-react-native';

export default function Clients() {
  const clientsList = [
    {
      id: '1',
      nom: 'Entreprise ABC',
      email: 'contact@abc.com',
      telephone: '01 23 45 67 89',
      adresse: 'Paris, France',
      siret: '12345678901234',
      avatar: 'EA'
    },
    {
      id: '2',
      nom: 'Marie Dupont',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      adresse: 'Lyon, France',
      siret: '',
      avatar: 'MD'
    },
    {
      id: '3',
      nom: 'Tech Solutions',
      email: 'hello@techsolutions.fr',
      telephone: '04 56 78 90 12',
      adresse: 'Marseille, France',
      siret: '98765432109876',
      avatar: 'TS'
    },
    {
      id: '4',
      nom: 'Jean Martin',
      email: 'jean.martin@gmail.com',
      telephone: '02 34 56 78 90',
      adresse: 'Nantes, France',
      siret: '',
      avatar: 'JM'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clients</Text>
          <Text style={styles.subtitle}>{clientsList.length} clients</Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9ca3af" />
          <Text style={styles.searchPlaceholder}>Rechercher un client...</Text>
        </View>
      </View>

      {/* Clients List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {clientsList.map((client) => (
          <TouchableOpacity key={client.id} style={styles.clientCard}>
            <View style={styles.clientHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{client.avatar}</Text>
              </View>
              <View style={styles.clientInfo}>
                <Text style={styles.clientName}>{client.nom}</Text>
                <View style={styles.contactInfo}>
                  <Mail size={14} color="#6b7280" />
                  <Text style={styles.contactText}>{client.email}</Text>
                </View>
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
    padding: 16,
  },
  searchBox: {
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
  listContainer: {
    flex: 1,
    padding: 16,
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
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
  },
});
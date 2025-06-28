import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Briefcase, Search, Filter, MapPin, Calendar, DollarSign, User, Plus, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import PremiumFeature from '../../components/PremiumFeature';

// Types
interface Mission {
  id: string;
  titre: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  localisation?: string;
  date_limite?: string;
  competences_requises?: string[];
  createur: {
    nom: string;
    prenom?: string;
  };
}

export default function Missions() {
  const { user } = useAuth();
  const { hasAccess } = useSubscription();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'nearby' | 'recent'>('all');
  const [loading, setLoading] = useState(true);

  const hasFeatureAccess = hasAccess('missions');

  useEffect(() => {
    // Simuler le chargement des missions
    const loadMissions = async () => {
      setLoading(true);
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données fictives pour la démo
      const mockMissions: Mission[] = [
        {
          id: '1',
          titre: 'Développement site e-commerce',
          description: 'Création d\'un site e-commerce pour une boutique de vêtements avec intégration de paiement Stripe et gestion des stocks.',
          budget_min: 1500,
          budget_max: 3000,
          localisation: 'Paris',
          date_limite: '2025-07-15',
          competences_requises: ['React', 'Node.js', 'Stripe'],
          createur: {
            nom: 'Dupont',
            prenom: 'Marie'
          }
        },
        {
          id: '2',
          titre: 'Rédaction de contenu SEO',
          description: 'Rédaction de 10 articles optimisés SEO pour un blog sur la finance personnelle.',
          budget_min: 300,
          budget_max: 500,
          localisation: 'Remote',
          date_limite: '2025-06-30',
          competences_requises: ['Rédaction', 'SEO', 'Finance'],
          createur: {
            nom: 'Martin',
            prenom: 'Thomas'
          }
        },
        {
          id: '3',
          titre: 'Logo et identité visuelle',
          description: 'Création d\'un logo et d\'une charte graphique complète pour une startup dans le domaine de la santé.',
          budget_min: 800,
          budget_max: 1200,
          localisation: 'Lyon',
          date_limite: '2025-07-05',
          competences_requises: ['Design', 'Illustrator', 'Branding'],
          createur: {
            nom: 'Petit',
            prenom: 'Sophie'
          }
        },
        {
          id: '4',
          titre: 'Formation Excel avancé',
          description: 'Animation d\'une formation Excel avancé (macros, tableaux croisés dynamiques) pour une équipe de 5 personnes.',
          budget_min: 600,
          budget_max: 800,
          localisation: 'Bordeaux',
          date_limite: '2025-08-10',
          competences_requises: ['Excel', 'Formation', 'VBA'],
          createur: {
            nom: 'Dubois',
            prenom: 'Jean'
          }
        },
        {
          id: '5',
          titre: 'Traduction de documents techniques',
          description: 'Traduction de documentation technique (environ 50 pages) de l\'anglais vers le français pour un logiciel de gestion.',
          budget_min: 400,
          budget_max: 700,
          localisation: 'Remote',
          date_limite: '2025-07-20',
          competences_requises: ['Traduction', 'Anglais', 'Technique'],
          createur: {
            nom: 'Leroy',
            prenom: 'Claire'
          }
        }
      ];
      
      setMissions(mockMissions);
      setLoading(false);
    };
    
    loadMissions();
  }, []);

  const filteredMissions = missions.filter(mission => {
    // Filtre de recherche
    const matchesSearch = 
      mission.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mission.localisation && mission.localisation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre par catégorie
    let matchesFilter = true;
    if (selectedFilter === 'nearby') {
      matchesFilter = mission.localisation !== 'Remote';
    } else if (selectedFilter === 'recent') {
      // Simuler les missions récentes (dans un vrai cas, on utiliserait la date de création)
      matchesFilter = ['1', '3', '5'].includes(mission.id);
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatBudget = (min?: number, max?: number) => {
    if (!min && !max) return 'À négocier';
    if (min && !max) return `À partir de ${min}€`;
    if (!min && max) return `Jusqu'à ${max}€`;
    return `${min}€ - ${max}€`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non spécifiée';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <PremiumFeature 
      feature="missions"
      title="Missions Partagées"
      description="Accédez à un réseau de missions et collaborez avec d'autres auto-entrepreneurs. Trouvez des opportunités ou partagez vos projets pour constituer des équipes."
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Missions</Text>
            <Text style={styles.subtitle}>
              Trouvez des opportunités de collaboration
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton}>
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
              placeholder="Rechercher une mission..."
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'all' && styles.activeFilterTabText]}>
              Toutes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'nearby' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('nearby')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'nearby' && styles.activeFilterTabText]}>
              Près de moi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterTab, selectedFilter === 'recent' && styles.activeFilterTab]}
            onPress={() => setSelectedFilter('recent')}
          >
            <Text style={[styles.filterTabText, selectedFilter === 'recent' && styles.activeFilterTabText]}>
              Récentes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Missions List */}
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {filteredMissions.map(mission => (
            <TouchableOpacity key={mission.id} style={styles.missionCard}>
              <View style={styles.missionHeader}>
                <Text style={styles.missionTitle}>{mission.titre}</Text>
                <View style={styles.budgetContainer}>
                  <DollarSign size={16} color="#16a34a" />
                  <Text style={styles.budgetText}>
                    {formatBudget(mission.budget_min, mission.budget_max)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.missionDescription} numberOfLines={2}>
                {mission.description}
              </Text>
              
              <View style={styles.missionDetails}>
                {mission.localisation && (
                  <View style={styles.detailItem}>
                    <MapPin size={14} color="#6b7280" />
                    <Text style={styles.detailText}>{mission.localisation}</Text>
                  </View>
                )}
                
                {mission.date_limite && (
                  <View style={styles.detailItem}>
                    <Calendar size={14} color="#6b7280" />
                    <Text style={styles.detailText}>
                      Échéance: {formatDate(mission.date_limite)}
                    </Text>
                  </View>
                )}
                
                <View style={styles.detailItem}>
                  <User size={14} color="#6b7280" />
                  <Text style={styles.detailText}>
                    {mission.createur.prenom} {mission.createur.nom}
                  </Text>
                </View>
              </View>
              
              {mission.competences_requises && mission.competences_requises.length > 0 && (
                <View style={styles.skillsContainer}>
                  {mission.competences_requises.map((skill, index) => (
                    <View key={index} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              <View style={styles.missionFooter}>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Voir les détails</Text>
                  <ChevronRight size={16} color="#2563eb" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Postuler</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredMissions.length === 0 && (
            <View style={styles.emptyState}>
              <Briefcase size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>
                {searchTerm ? 'Aucune mission trouvée' : 'Aucune mission disponible'}
              </Text>
              <Text style={styles.emptyText}>
                {searchTerm 
                  ? 'Essayez avec d\'autres mots-clés ou filtres'
                  : 'Revenez plus tard pour découvrir de nouvelles opportunités'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </PremiumFeature>
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
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterTabText: {
    color: '#111827',
  },
  listContainer: {
    flex: 1,
    padding: 16,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#16a34a',
    marginLeft: 4,
  },
  missionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  missionDetails: {
    marginBottom: 12,
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillBadge: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
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
});
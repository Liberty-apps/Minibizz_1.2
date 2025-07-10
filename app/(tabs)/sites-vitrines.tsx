import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Globe, Plus, Eye, CreditCard as Edit3, Settings, Trash2, ExternalLink, Palette, LayoutGrid as Layout, Image as ImageIcon, Search, Crown } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSubscription } from '../../src/contexts/SubscriptionContext';

export default function SitesVitrines() {
  const { user } = useAuth();
  const { hasAccess, getCurrentPlan } = useSubscription();
  const [sites, setSites] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [siteName, setSiteName] = useState('');
  const [sousdomaine, setSousdomaine] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  // Données de démonstration pour les sites
  const mockSites = [
    {
      id: '1',
      nom: 'Mon Site Professionnel',
      sous_domaine: 'monsite',
      statut: 'publie',
      updated_at: '2024-07-10T14:30:00Z'
    },
    {
      id: '2',
      nom: 'Portfolio Design',
      sous_domaine: 'portfolio-design',
      statut: 'brouillon',
      updated_at: '2024-07-08T09:15:00Z'
    }
  ];

  // Données de démonstration pour les templates
  const mockTemplates = [
    {
      id: '1',
      nom: 'Business Simple',
      description: 'Template épuré pour entreprises de services',
      preview_url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg'
    },
    {
      id: '2',
      nom: 'Portfolio Créatif',
      description: 'Template pour freelances créatifs',
      preview_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg'
    },
    {
      id: '3',
      nom: 'Boutique Minimaliste',
      description: 'Template e-commerce minimaliste',
      preview_url: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg'
    }
  ];

  useEffect(() => {
    // Simuler le chargement des données
    const loadData = async () => {
      setLoading(true);
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Charger les données de démonstration
        setSites(mockSites);
        setTemplates(mockTemplates);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const validateForm = () => {
    if (!siteName.trim()) {
      return 'Veuillez saisir un nom pour votre site';
    }
    if (!sousdomaine.trim()) {
      return 'Veuillez saisir un sous-domaine';
    }
    if (!/^[a-z0-9-]+$/.test(sousdomaine)) {
      return 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets';
    }
    if (!selectedTemplate) {
      return 'Veuillez sélectionner un template';
    }
    return null;
  };

  const handleCreateSite = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Erreur', validationError);
      return;
    }

    try {
      setLoading(true);
      
      // Simuler la création d'un site
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Ajouter le nouveau site à la liste
      const newSite = {
        id: Date.now().toString(),
        nom: siteName,
        sous_domaine: sousdomaine,
        statut: 'brouillon',
        updated_at: new Date().toISOString()
      };
      
      setSites([newSite, ...sites]);
      
      // Réinitialiser le formulaire
      setShowCreateModal(false);
      setSiteName('');
      setSousdomaine('');
      setSelectedTemplate('');
      
      Alert.alert('Succès', 'Site créé avec succès !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le site. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = (siteId, siteName) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le site "${siteName}" ?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            // Filtrer le site supprimé
            setSites(sites.filter(site => site.id !== siteId));
            Alert.alert('Succès', 'Site supprimé avec succès');
          }
        }
      ]
    );
  };

  const handlePublishSite = async (siteId, currentStatus) => {
    try {
      setLoading(true);
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour le statut du site
      const updatedSites = sites.map(site => {
        if (site.id === siteId) {
          return {
            ...site,
            statut: currentStatus === 'publie' ? 'brouillon' : 'publie'
          };
        }
        return site;
      });
      
      setSites(updatedSites);
      
      Alert.alert(
        'Succès', 
        currentStatus === 'publie' ? 'Site mis en brouillon' : 'Site publié avec succès'
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut du site');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'publie': return '#16a34a';
      case 'brouillon': return '#eab308';
      case 'suspendu': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (statut) => {
    switch (statut) {
      case 'publie': return 'Publié';
      case 'brouillon': return 'Brouillon';
      case 'suspendu': return 'Suspendu';
      default: return statut;
    }
  };

  const filteredSites = sites.filter(site =>
    site.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.sous_domaine.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && sites.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Chargement des sites...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sites Vitrines</Text>
          <Text style={styles.subtitle}>
            Créez et gérez vos mini-sites professionnels
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setError(null);
              setLoading(true);
              // Recharger les données
              setTimeout(() => {
                setSites(mockSites);
                setTemplates(mockTemplates);
                setLoading(false);
              }, 1000);
            }}
          >
            <Text style={styles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search */}
      {sites.length > 0 && (
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Search size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Rechercher un site..."
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
      )}

      {/* Sites List */}
      {filteredSites.length === 0 ? (
        <View style={styles.emptyState}>
          <Globe size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>
            {searchTerm ? 'Aucun site trouvé' : 'Aucun site créé'}
          </Text>
          <Text style={styles.emptyText}>
            {searchTerm 
              ? 'Essayez avec d\'autres mots-clés'
              : 'Créez votre premier site vitrine pour présenter votre activité en ligne'
            }
          </Text>
          {!searchTerm && (
            <TouchableOpacity 
              style={styles.createFirstButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createFirstText}>Créer mon premier site</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.sitesContainer}>
          {filteredSites.map((site) => (
            <View key={site.id} style={styles.siteCard}>
              <View style={styles.siteHeader}>
                <View style={styles.siteInfo}>
                  <Text style={styles.siteName}>{site.nom}</Text>
                  <Text style={styles.siteUrl}>
                    {site.sous_domaine}.minibizz.fr
                  </Text>
                  <View style={styles.statusContainer}>
                    <View style={[
                      styles.statusBadge, 
                      { backgroundColor: getStatusColor(site.statut) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(site.statut)}
                      </Text>
                    </View>
                    <Text style={styles.lastUpdate}>
                      Modifié le {new Date(site.updated_at).toLocaleDateString('fr-FR')}
                    </Text>
                  </View>
                </View>
                <View style={styles.siteActions}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Aperçu', 'Fonctionnalité en cours de développement')}
                  >
                    <Eye size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Éditer', `Édition du site ${site.id}`)}
                  >
                    <Edit3 size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Paramètres', 'Fonctionnalité en cours de développement')}
                  >
                    <Settings size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => handleDeleteSite(site.id, site.nom)}
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.siteFooter}>
                <TouchableOpacity 
                  style={[
                    styles.publishButton,
                    { backgroundColor: site.statut === 'publie' ? '#fef2f2' : '#f0fdf4' }
                  ]}
                  onPress={() => handlePublishSite(site.id, site.statut)}
                >
                  <Text style={[
                    styles.publishText,
                    { color: site.statut === 'publie' ? '#dc2626' : '#16a34a' }
                  ]}>
                    {site.statut === 'publie' ? 'Dépublier' : 'Publier'}
                  </Text>
                </TouchableOpacity>

                {site.statut === 'publie' && (
                  <TouchableOpacity 
                    style={styles.visitButton}
                    onPress={() => {
                      const url = `https://${site.sous_domaine}.minibizz.fr`;
                      Alert.alert('Visite du site', `Ouverture de ${url}`, [
                        { text: 'Annuler', style: 'cancel' },
                        { text: 'Visiter', onPress: () => window.open(url, '_blank') }
                      ]);
                    }}
                  >
                    <ExternalLink size={16} color="#2563eb" />
                    <Text style={styles.visitText}>Visiter</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Create Site Modal */}
      {showCreateModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Créer un nouveau site</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom du site *</Text>
              <TextInput
                style={styles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Mon entreprise"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sous-domaine *</Text>
              <View style={styles.urlInput}>
                <TextInput
                  style={styles.subdomainInput}
                  value={sousdomaine}
                  onChangeText={(text) => setSousdomaine(text.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="monentreprise"
                  placeholderTextColor="#9ca3af"
                />
                <Text style={styles.urlSuffix}>.minibizz.fr</Text>
              </View>
              <Text style={styles.helperText}>
                Lettres minuscules, chiffres et tirets uniquement
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Template *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.templatesContainer}>
                  {templates.map((template) => (
                    <TouchableOpacity
                      key={template.id}
                      style={[
                        styles.templateCard,
                        selectedTemplate === template.id && styles.templateCardSelected
                      ]}
                      onPress={() => setSelectedTemplate(template.id)}
                    >
                      <View style={styles.templatePreview}>
                        {template.preview_url ? (
                          <Image 
                            source={{ uri: template.preview_url }} 
                            style={styles.templateImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Layout size={32} color="#9ca3af" />
                        )}
                      </View>
                      <Text style={styles.templateName}>{template.nom}</Text>
                      <Text style={styles.templateDescription}>
                        {template.description}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowCreateModal(false);
                  setSiteName('');
                  setSousdomaine('');
                  setSelectedTemplate('');
                }}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, loading && styles.createButtonDisabled]}
                onPress={handleCreateSite}
                disabled={loading}
              >
                <Text style={styles.createText}>
                  {loading ? 'Création...' : 'Créer le site'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.featuresTitle}>Fonctionnalités incluses</Text>
        <View style={styles.featuresGrid}>
          <View style={styles.featureCard}>
            <Palette size={24} color="#2563eb" />
            <Text style={styles.featureTitle}>Personnalisation</Text>
            <Text style={styles.featureText}>
              Couleurs, polices et mise en page personnalisables
            </Text>
          </View>
          <View style={styles.featureCard}>
            <ImageIcon size={24} color="#16a34a" />
            <Text style={styles.featureTitle}>Galerie</Text>
            <Text style={styles.featureText}>
              Ajoutez vos photos et créez des galeries
            </Text>
          </View>
          <View style={styles.featureCard}>
            <Globe size={24} color="#9333ea" />
            <Text style={styles.featureTitle}>Domaine</Text>
            <Text style={styles.featureText}>
              Sous-domaine gratuit ou domaine personnalisé
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
    fontFamily: 'Inter-Regular',
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
    margin: 16,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
  retryButton: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    marginTop: 32,
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
    lineHeight: 24,
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
  sitesContainer: {
    padding: 16,
  },
  siteCard: {
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
  siteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  siteInfo: {
    flex: 1,
  },
  siteName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter-SemiBold',
  },
  siteUrl: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  lastUpdate: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'Inter-Regular',
  },
  siteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  publishButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  publishText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  visitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginLeft: 6,
    fontFamily: 'Inter-Medium',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    margin: 16,
    maxHeight: '80%',
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    fontFamily: 'Inter-Bold',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter-Regular',
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  subdomainInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Inter-Regular',
  },
  urlSuffix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
    fontFamily: 'Inter-Regular',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  templatesContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  templateCard: {
    width: 120,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  templateCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  templatePreview: {
    width: 96,
    height: 64,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  templateImage: {
    width: '100%',
    height: '100%',
  },
  templateName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  templateDescription: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: 'Inter-Medium',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'Inter-Medium',
  },
  featuresSection: {
    padding: 16,
    paddingBottom: 32,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
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
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
  },
});
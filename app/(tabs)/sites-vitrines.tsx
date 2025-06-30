import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Globe, Plus, Eye, CreditCard as Edit3, Settings, Trash2, ExternalLink, Palette, LayoutGrid as Layout, Image as ImageIcon, Search, Crown } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { sitesService } from '../../src/services/sites';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import PremiumFeature from '../../components/PremiumFeature';

interface SiteVitrine {
  id: string;
  nom: string;
  sous_domaine: string;
  domaine_personnalise?: string;
  statut: string;
  created_at: string;
  updated_at: string;
}

interface Template {
  id: string;
  nom: string;
  description: string;
  type_template: string;
  preview_url?: string;
}

export default function SitesVitrines() {
  const { user } = useAuth();
  const { hasAccess, getCurrentPlan } = useSubscription();
  const [sites, setSites] = useState<SiteVitrine[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [siteName, setSiteName] = useState('');
  const [sousdomaine, setSousdomaine] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const hasFeatureAccess = hasAccess('sites-vitrines');
  const currentPlan = getCurrentPlan();

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
      const [sitesData, templatesData] = await Promise.all([
        sitesService.getUserSites(user.id),
        sitesService.getTemplates()
      ]);
      
      setSites(sitesData);
      setTemplates(templatesData);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger les sites');
    } finally {
      setLoading(false);
    }
  };

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
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un site');
      router.replace('/(auth)/login');
      return;
    }

    // Vérifier si l'utilisateur a accès à cette fonctionnalité
    if (!hasFeatureAccess) {
      Alert.alert(
        'Fonctionnalité Premium',
        'La création de sites vitrines est disponible uniquement avec l\'abonnement Premium + Site Vitrine.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Voir les plans', onPress: () => router.push('/(tabs)/abonnement') }
        ]
      );
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Erreur', validationError);
      return;
    }

    try {
      setLoading(true);
      
      // Vérifier la disponibilité du sous-domaine
      const isAvailable = await sitesService.checkSubdomainAvailability(sousdomaine.trim().toLowerCase());
      if (!isAvailable) {
        Alert.alert('Erreur', 'Ce sous-domaine est déjà utilisé. Veuillez en choisir un autre.');
        return;
      }

      await sitesService.createSite({
        user_id: user.id,
        nom: siteName.trim(),
        sous_domaine: sousdomaine.trim().toLowerCase(),
        template_id: selectedTemplate,
        configuration: {},
        contenu: {},
        styles: {}
      });

      Alert.alert('Succès', 'Site créé avec succès !');
      setShowCreateModal(false);
      setSiteName('');
      setSousdomaine('');
      setSelectedTemplate('');
      loadData();
    } catch (error: any) {
      console.error('Erreur création site:', error);
      if (error.message.includes('duplicate')) {
        Alert.alert('Erreur', 'Ce sous-domaine est déjà utilisé');
      } else {
        Alert.alert('Erreur', 'Impossible de créer le site. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSite = (siteId: string, siteName: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le site "${siteName}" ?\n\nCette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await sitesService.deleteSite(siteId);
              Alert.alert('Succès', 'Site supprimé avec succès');
              loadData();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le site');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handlePublishSite = async (siteId: string, currentStatus: string) => {
    try {
      setLoading(true);
      if (currentStatus === 'publie') {
        await sitesService.unpublishSite(siteId);
        Alert.alert('Succès', 'Site mis en brouillon');
      } else {
        await sitesService.publishSite(siteId);
        Alert.alert('Succès', 'Site publié avec succès');
      }
      loadData();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut du site');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'publie': return '#16a34a';
      case 'brouillon': return '#eab308';
      case 'suspendu': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (statut: string) => {
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

  // Vérifier l'authentification
  if (!user) {
    return (
      <View style={styles.authContainer}>
        <Globe size={64} color="#d1d5db" />
        <Text style={styles.authTitle}>Connexion requise</Text>
        <Text style={styles.authText}>
          Vous devez être connecté pour créer et gérer vos sites vitrines
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

  return (
    <PremiumFeature 
      feature="sites-vitrines"
      title="Sites Vitrines"
      description="Créez facilement votre site vitrine professionnel pour présenter votre activité en ligne. Avec un éditeur simple, des templates prêts à l'emploi et un hébergement inclus."
    >
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
            style={[
              styles.addButton,
              !hasFeatureAccess && styles.addButtonDisabled
            ]}
            onPress={() => {
              if (hasFeatureAccess) {
                setShowCreateModal(true);
              } else {
                Alert.alert(
                  'Fonctionnalité Premium',
                  'La création de sites vitrines est disponible uniquement avec l\'abonnement Premium + Site Vitrine.',
                  [
                    { text: 'Annuler', style: 'cancel' },
                    { text: 'Voir les plans', onPress: () => router.push('/(tabs)/abonnement') }
                  ]
                );
              }
            }}
          >
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Plan Info Banner */}
        {!hasFeatureAccess && (
          <View style={styles.planInfoBanner}>
            <Crown size={20} color="#9333ea" />
            <Text style={styles.planInfoText}>
              La création de sites vitrines est disponible avec le plan <Text style={styles.planHighlight}>Premium + Site Vitrine</Text>
            </Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => router.push('/(tabs)/abonnement')}
            >
              <Text style={styles.upgradeButtonText}>Upgrader</Text>
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
            {!searchTerm && hasFeatureAccess && (
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => setShowCreateModal(true)}
              >
                <Text style={styles.createFirstText}>Créer mon premier site</Text>
              </TouchableOpacity>
            )}
            {!searchTerm && !hasFeatureAccess && (
              <TouchableOpacity 
                style={styles.createFirstButton}
                onPress={() => router.push('/(tabs)/abonnement')}
              >
                <Text style={styles.createFirstText}>Voir les plans premium</Text>
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
                      {site.domaine_personnalise || `${site.sous_domaine}.minibizz.fr`}
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
                      onPress={() => router.push(`/sites-vitrines/${site.id}/edit`)}
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
                      onPress={() => Alert.alert('Visite', 'Fonctionnalité en cours de développement')}
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
                          <Layout size={32} color="#9ca3af" />
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
    </PremiumFeature>
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
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  planInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#faf5ff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  planInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 12,
  },
  planHighlight: {
    fontWeight: 'bold',
    color: '#9333ea',
  },
  upgradeButton: {
    backgroundColor: '#9333ea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginLeft: 8,
  },
  upgradeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
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
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
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
  },
  siteUrl: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
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
  },
  lastUpdate: {
    fontSize: 12,
    color: '#9ca3af',
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
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
  },
  subdomainInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  urlSuffix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
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
    width: 60,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  templateDescription: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
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
  },
  featuresGrid: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  },
  featureText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
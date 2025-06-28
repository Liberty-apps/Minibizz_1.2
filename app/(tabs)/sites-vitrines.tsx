import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Globe, Plus, Eye, CreditCard as Edit3, Settings, Trash2, ExternalLink, Palette, LayoutGrid as Layout, Image as ImageIcon } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { sitesService } from '../../src/services/sites';

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
  const [sites, setSites] = useState<SiteVitrine[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [siteName, setSiteName] = useState('');
  const [sousdomaine, setSousdomaine] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSite = async () => {
    if (!user || !siteName.trim() || !sousdomaine.trim() || !selectedTemplate) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
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
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer le site');
    }
  };

  const handleDeleteSite = (siteId: string, siteName: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer le site "${siteName}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await sitesService.deleteSite(siteId);
              Alert.alert('Succès', 'Site supprimé avec succès');
              loadData();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le site');
            }
          }
        }
      ]
    );
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
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

      {/* Sites List */}
      {sites.length === 0 ? (
        <View style={styles.emptyState}>
          <Globe size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>Aucun site créé</Text>
          <Text style={styles.emptyText}>
            Créez votre premier site vitrine pour présenter votre activité en ligne
          </Text>
          <TouchableOpacity 
            style={styles.createFirstButton}
            onPress={() => setShowCreateModal(true)}
          >
            <Text style={styles.createFirstText}>Créer mon premier site</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.sitesContainer}>
          {sites.map((site) => (
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
                  <TouchableOpacity style={styles.actionButton}>
                    <Eye size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Edit3 size={18} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
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

              {site.statut === 'publie' && (
                <TouchableOpacity style={styles.visitButton}>
                  <ExternalLink size={16} color="#2563eb" />
                  <Text style={styles.visitText}>Visiter le site</Text>
                </TouchableOpacity>
              )}
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
              <Text style={styles.label}>Nom du site</Text>
              <TextInput
                style={styles.input}
                value={siteName}
                onChangeText={setSiteName}
                placeholder="Mon entreprise"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sous-domaine</Text>
              <View style={styles.urlInput}>
                <TextInput
                  style={styles.subdomainInput}
                  value={sousdomaine}
                  onChangeText={setSousdomaine}
                  placeholder="monentreprise"
                />
                <Text style={styles.urlSuffix}>.minibizz.fr</Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Template</Text>
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
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateSite}
              >
                <Text style={styles.createText}>Créer le site</Text>
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
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
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
  },
  urlSuffix: {
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#6b7280',
    backgroundColor: '#f9fafb',
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
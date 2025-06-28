import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Save, Trash2, Globe, Palette, Layout, Settings, Layers } from 'lucide-react-native';
import { useAuth } from '../../../src/contexts/AuthContext';
import { sitesService } from '../../../src/services/sites';

export default function EditSite() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [site, setSite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'design' | 'pages' | 'settings'>('general');
  
  // Formulaire général
  const [siteName, setSiteName] = useState('');
  const [sousdomaine, setSousdomaine] = useState('');
  const [domainePerso, setDomainePerso] = useState('');

  // Design
  const [couleurPrimaire, setCouleurPrimaire] = useState('#2563eb');
  const [couleurSecondaire, setCouleurSecondaire] = useState('#f0f9ff');
  const [couleurAccent, setCouleurAccent] = useState('#16a34a');
  const [police, setPolice] = useState('Inter');

  useEffect(() => {
    if (id) {
      loadSite(id as string);
    }
  }, [id]);

  const loadSite = async (siteId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const siteData = await sitesService.getSiteById(siteId);
      
      if (!siteData) {
        Alert.alert('Erreur', 'Site non trouvé');
        router.back();
        return;
      }
      
      setSite(siteData);
      
      // Remplir les champs du formulaire
      setSiteName(siteData.nom);
      setSousdomaine(siteData.sous_domaine || '');
      setDomainePerso(siteData.domaine_personnalise || '');
      
      // Remplir les champs de design
      if (siteData.styles) {
        setCouleurPrimaire(siteData.styles.couleur_primaire || '#2563eb');
        setCouleurSecondaire(siteData.styles.couleur_secondaire || '#f0f9ff');
        setCouleurAccent(siteData.styles.couleur_accent || '#16a34a');
        setPolice(siteData.styles.police_principale || 'Inter');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du site:', error);
      Alert.alert('Erreur', 'Impossible de charger les informations du site');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !site) return;
    
    // Validation
    if (!siteName.trim()) {
      Alert.alert('Erreur', 'Le nom du site est obligatoire');
      return;
    }
    
    if (!sousdomaine.trim()) {
      Alert.alert('Erreur', 'Le sous-domaine est obligatoire');
      return;
    }
    
    if (!/^[a-z0-9-]+$/.test(sousdomaine)) {
      Alert.alert('Erreur', 'Le sous-domaine ne peut contenir que des lettres minuscules, chiffres et tirets');
      return;
    }
    
    try {
      setSaving(true);
      
      // Vérifier si le sous-domaine a changé et s'il est disponible
      if (sousdomaine !== site.sous_domaine) {
        const isAvailable = await sitesService.checkSubdomainAvailability(sousdomaine);
        if (!isAvailable) {
          Alert.alert('Erreur', 'Ce sous-domaine est déjà utilisé. Veuillez en choisir un autre.');
          setSaving(false);
          return;
        }
      }
      
      // Mettre à jour le site
      await sitesService.updateSite(site.id, {
        nom: siteName.trim(),
        sous_domaine: sousdomaine.trim(),
        domaine_personnalise: domainePerso.trim() || null,
        styles: {
          couleur_primaire: couleurPrimaire,
          couleur_secondaire: couleurSecondaire,
          couleur_accent: couleurAccent,
          police_principale: police
        }
      });
      
      Alert.alert('Succès', 'Site mis à jour avec succès');
      router.back();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du site:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le site');
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom du site *</Text>
        <TextInput
          style={styles.input}
          value={siteName}
          onChangeText={setSiteName}
          placeholder="Mon entreprise"
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
          />
          <Text style={styles.urlSuffix}>.minibizz.fr</Text>
        </View>
        <Text style={styles.helperText}>
          Lettres minuscules, chiffres et tirets uniquement
        </Text>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Domaine personnalisé</Text>
        <TextInput
          style={styles.input}
          value={domainePerso}
          onChangeText={setDomainePerso}
          placeholder="www.monentreprise.com"
        />
        <Text style={styles.helperText}>
          Laissez vide si vous n'avez pas de domaine personnalisé
        </Text>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Le domaine personnalisé nécessite une configuration DNS supplémentaire.
        </Text>
      </View>
    </View>
  );

  const renderDesignTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Couleur principale</Text>
        <View style={styles.colorPickerRow}>
          <View style={[styles.colorPreview, { backgroundColor: couleurPrimaire }]} />
          <TextInput
            style={styles.colorInput}
            value={couleurPrimaire}
            onChangeText={setCouleurPrimaire}
            placeholder="#2563eb"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Couleur secondaire</Text>
        <View style={styles.colorPickerRow}>
          <View style={[styles.colorPreview, { backgroundColor: couleurSecondaire }]} />
          <TextInput
            style={styles.colorInput}
            value={couleurSecondaire}
            onChangeText={setCouleurSecondaire}
            placeholder="#f0f9ff"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Couleur d'accent</Text>
        <View style={styles.colorPickerRow}>
          <View style={[styles.colorPreview, { backgroundColor: couleurAccent }]} />
          <TextInput
            style={styles.colorInput}
            value={couleurAccent}
            onChangeText={setCouleurAccent}
            placeholder="#16a34a"
          />
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Police principale</Text>
        <View style={styles.selectContainer}>
          <TouchableOpacity 
            style={[styles.selectOption, police === 'Inter' && styles.selectOptionActive]}
            onPress={() => setPolice('Inter')}
          >
            <Text style={[styles.selectText, police === 'Inter' && styles.selectTextActive]}>
              Inter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.selectOption, police === 'Roboto' && styles.selectOptionActive]}
            onPress={() => setPolice('Roboto')}
          >
            <Text style={[styles.selectText, police === 'Roboto' && styles.selectTextActive]}>
              Roboto
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.selectOption, police === 'Poppins' && styles.selectOptionActive]}
            onPress={() => setPolice('Poppins')}
          >
            <Text style={[styles.selectText, police === 'Poppins' && styles.selectTextActive]}>
              Poppins
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>Aperçu</Text>
        <View style={[styles.previewContent, { backgroundColor: couleurSecondaire }]}>
          <View style={[styles.previewHeader, { backgroundColor: couleurPrimaire }]}>
            <Text style={styles.previewHeaderText}>{siteName || 'Mon Site'}</Text>
          </View>
          <View style={styles.previewBody}>
            <Text style={[styles.previewHeading, { color: couleurPrimaire }]}>
              Titre principal
            </Text>
            <Text style={styles.previewParagraph}>
              Ceci est un exemple de texte pour visualiser l'apparence de votre site.
            </Text>
            <View style={[styles.previewButton, { backgroundColor: couleurAccent }]}>
              <Text style={styles.previewButtonText}>Bouton d'action</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderPagesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.pagesHeader}>
        <Text style={styles.pagesTitle}>Pages du site</Text>
        <TouchableOpacity style={styles.addPageButton}>
          <Text style={styles.addPageText}>Ajouter une page</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pagesList}>
        <View style={styles.pageItem}>
          <View style={styles.pageInfo}>
            <Text style={styles.pageName}>Accueil</Text>
            <Text style={styles.pageUrl}>/{sousdomaine || 'monsite'}</Text>
          </View>
          <View style={styles.pageActions}>
            <TouchableOpacity style={styles.pageAction}>
              <Edit3 size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.pageItem}>
          <View style={styles.pageInfo}>
            <Text style={styles.pageName}>Services</Text>
            <Text style={styles.pageUrl}>/{sousdomaine || 'monsite'}/services</Text>
          </View>
          <View style={styles.pageActions}>
            <TouchableOpacity style={styles.pageAction}>
              <Edit3 size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageAction}>
              <Trash2 size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.pageItem}>
          <View style={styles.pageInfo}>
            <Text style={styles.pageName}>Contact</Text>
            <Text style={styles.pageUrl}>/{sousdomaine || 'monsite'}/contact</Text>
          </View>
          <View style={styles.pageActions}>
            <TouchableOpacity style={styles.pageAction}>
              <Edit3 size={16} color="#6b7280" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageAction}>
              <Trash2 size={16} color="#dc2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Vous pouvez ajouter jusqu'à 5 pages à votre site vitrine.
        </Text>
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Statut du site</Text>
        <View style={styles.selectContainer}>
          <TouchableOpacity 
            style={[styles.selectOption, site?.statut === 'brouillon' && styles.selectOptionActive]}
          >
            <Text style={[styles.selectText, site?.statut === 'brouillon' && styles.selectTextActive]}>
              Brouillon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.selectOption, site?.statut === 'publie' && styles.selectOptionActive]}
          >
            <Text style={[styles.selectText, site?.statut === 'publie' && styles.selectTextActive]}>
              Publié
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Référencement (SEO)</Text>
        <TextInput
          style={styles.input}
          placeholder="Titre SEO"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description pour les moteurs de recherche"
          multiline
          numberOfLines={3}
        />
        <TextInput
          style={styles.input}
          placeholder="Mots-clés (séparés par des virgules)"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Paramètres avancés</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Activer SSL</Text>
          <View style={[styles.switch, site?.ssl_actif && styles.switchActive]}>
            <View style={[styles.switchThumb, site?.ssl_actif && styles.switchThumbActive]} />
          </View>
        </View>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Activer Google Analytics</Text>
          <View style={[styles.switch, site?.analytics_actif && styles.switchActive]}>
            <View style={[styles.switchThumb, site?.analytics_actif && styles.switchThumbActive]} />
          </View>
        </View>
      </View>
      
      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>Zone de danger</Text>
        <TouchableOpacity style={styles.deleteButton}>
          <Trash2 size={16} color="#ffffff" />
          <Text style={styles.deleteText}>Supprimer ce site</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le site</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Site Info */}
      <View style={styles.siteInfo}>
        <Text style={styles.siteName}>{siteName || site?.nom || 'Site sans nom'}</Text>
        <Text style={styles.siteUrl}>
          {sousdomaine ? `${sousdomaine}.minibizz.fr` : (site?.sous_domaine ? `${site.sous_domaine}.minibizz.fr` : 'Sous-domaine non défini')}
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'general' && styles.activeTab]}
          onPress={() => setActiveTab('general')}
        >
          <Globe size={20} color={activeTab === 'general' ? "#2563eb" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === 'general' && styles.activeTabText]}>
            Général
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'design' && styles.activeTab]}
          onPress={() => setActiveTab('design')}
        >
          <Palette size={20} color={activeTab === 'design' ? "#2563eb" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === 'design' && styles.activeTabText]}>
            Design
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pages' && styles.activeTab]}
          onPress={() => setActiveTab('pages')}
        >
          <Layers size={20} color={activeTab === 'pages' ? "#2563eb" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === 'pages' && styles.activeTabText]}>
            Pages
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Settings size={20} color={activeTab === 'settings' ? "#2563eb" : "#6b7280"} />
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Paramètres
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'general' && renderGeneralTab()}
        {activeTab === 'design' && renderDesignTab()}
        {activeTab === 'pages' && renderPagesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#ffffff" />
          <Text style={styles.footerButtonText}>
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteInfo: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  siteName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  siteUrl: {
    fontSize: 14,
    color: '#2563eb',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
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
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  urlInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 8,
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
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  colorPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  colorInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  selectContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  selectOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  selectOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  selectText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectTextActive: {
    color: '#2563eb',
    fontWeight: '500',
  },
  previewBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    padding: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
  },
  previewContent: {
    height: 300,
  },
  previewHeader: {
    padding: 16,
  },
  previewHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  previewBody: {
    padding: 16,
  },
  previewHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewParagraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 16,
  },
  previewButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  pagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  addPageButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addPageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  pagesList: {
    gap: 12,
  },
  pageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  pageInfo: {
    flex: 1,
  },
  pageName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  pageUrl: {
    fontSize: 12,
    color: '#6b7280',
  },
  pageActions: {
    flexDirection: 'row',
    gap: 8,
  },
  pageAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#374151',
  },
  switch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#d1d5db',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#2563eb',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    transform: [{ translateX: 26 }],
  },
  dangerZone: {
    marginTop: 32,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    backgroundColor: '#fef2f2',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
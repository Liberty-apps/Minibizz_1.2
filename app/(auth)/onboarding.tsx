import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, User, Building, Upload, Briefcase, Check, Star } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { onboardingService } from '@/services/onboarding';

interface OnboardingData {
  nom: string;
  prenom: string;
  nomEntreprise: string;
  logoUrl: string;
  secteurActivite: string;
}

const SECTEURS_ACTIVITE = [
  'Conseil en informatique',
  'Développement web',
  'Design graphique',
  'Marketing digital',
  'Photographie',
  'Rédaction web',
  'Formation',
  'Coaching',
  'Traduction',
  'Comptabilité',
  'Architecture',
  'Ingénierie',
  'Artisanat',
  'Commerce',
  'Services à la personne',
  'Santé et bien-être',
  'Immobilier',
  'Transport',
  'Restauration',
  'Autre'
];

export default function Onboarding() {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    nom: '',
    prenom: '',
    nomEntreprise: '',
    logoUrl: '',
    secteurActivite: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!data.nom.trim()) {
          Alert.alert('Information manquante', 'Veuillez saisir votre nom');
          return false;
        }
        if (!data.prenom.trim()) {
          Alert.alert('Information manquante', 'Veuillez saisir votre prénom');
          return false;
        }
        return true;
      case 2:
        // Nom d'entreprise optionnel
        return true;
      case 3:
        // Logo optionnel
        return true;
      case 4:
        if (!data.secteurActivite) {
          Alert.alert('Information manquante', 'Veuillez sélectionner votre secteur d\'activité');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Sauvegarder les informations du profil
      await onboardingService.completeOnboarding(user.id, {
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        nom_entreprise: data.nomEntreprise.trim() || null,
        logo_url: data.logoUrl || null,
        activite_principale: data.secteurActivite
      });

      // Mettre à jour le contexte d'authentification
      await updateProfile();

      Alert.alert(
        'Bienvenue !',
        'Votre profil a été configuré avec succès. Vous pouvez maintenant découvrir MiniBizz.',
        [
          {
            text: 'Commencer',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder votre profil. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Passer l\'onboarding',
      'Vous pourrez compléter ces informations plus tard dans les paramètres.',
      [
        { text: 'Continuer l\'onboarding', style: 'cancel' },
        {
          text: 'Passer',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${(currentStep / totalSteps) * 100}%` }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>
        Étape {currentStep} sur {totalSteps}
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <User size={32} color="#2563eb" />
        </View>
        <Text style={styles.stepTitle}>Informations personnelles</Text>
        <Text style={styles.stepDescription}>
          Commençons par vos informations de base
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Prénom *</Text>
          <TextInput
            style={styles.input}
            value={data.prenom}
            onChangeText={(text) => setData({...data, prenom: text})}
            placeholder="Votre prénom"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom *</Text>
          <TextInput
            style={styles.input}
            value={data.nom}
            onChangeText={(text) => setData({...data, nom: text})}
            placeholder="Votre nom de famille"
            autoCapitalize="words"
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Ces informations apparaîtront sur vos documents professionnels (devis, factures).
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Building size={32} color="#2563eb" />
        </View>
        <Text style={styles.stepTitle}>Votre entreprise</Text>
        <Text style={styles.stepDescription}>
          Donnez un nom à votre activité (optionnel)
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nom de votre auto-entreprise</Text>
          <TextInput
            style={styles.input}
            value={data.nomEntreprise}
            onChangeText={(text) => setData({...data, nomEntreprise: text})}
            placeholder="Ex: Dupont Consulting, Martin Design..."
            autoCapitalize="words"
          />
          <Text style={styles.helperText}>
            Laissez vide si vous préférez utiliser votre nom personnel
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Vous pourrez toujours modifier ce nom plus tard dans vos paramètres.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Upload size={32} color="#2563eb" />
        </View>
        <Text style={styles.stepTitle}>Logo professionnel</Text>
        <Text style={styles.stepDescription}>
          Ajoutez votre logo pour personnaliser vos documents (optionnel)
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TouchableOpacity style={styles.uploadArea}>
          {data.logoUrl ? (
            <View style={styles.logoPreview}>
              <Image source={{ uri: data.logoUrl }} style={styles.logoImage} />
              <Text style={styles.logoText}>Logo sélectionné</Text>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <Upload size={48} color="#9ca3af" />
              <Text style={styles.uploadText}>Cliquez pour ajouter votre logo</Text>
              <Text style={styles.uploadSubtext}>
                Formats acceptés: PNG, JPG (max 2MB)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {data.logoUrl && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => setData({...data, logoUrl: ''})}
          >
            <Text style={styles.removeText}>Supprimer le logo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📄 Votre logo apparaîtra sur vos devis, factures et documents officiels.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIcon}>
          <Briefcase size={32} color="#2563eb" />
        </View>
        <Text style={styles.stepTitle}>Secteur d'activité</Text>
        <Text style={styles.stepDescription}>
          Sélectionnez votre domaine d'expertise principal
        </Text>
      </View>

      <View style={styles.formContainer}>
        <ScrollView style={styles.sectorsContainer} showsVerticalScrollIndicator={false}>
          {SECTEURS_ACTIVITE.map((secteur, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sectorItem,
                data.secteurActivite === secteur && styles.sectorItemSelected
              ]}
              onPress={() => setData({...data, secteurActivite: secteur})}
            >
              <Text style={[
                styles.sectorText,
                data.secteurActivite === secteur && styles.sectorTextSelected
              ]}>
                {secteur}
              </Text>
              {data.secteurActivite === secteur && (
                <Check size={20} color="#2563eb" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            🎯 Cette information nous aide à personnaliser votre expérience et vous proposer des contenus adaptés.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={currentStep === 1 ? handleSkip : handlePrevious}
        >
          <ChevronLeft size={24} color="#6b7280" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Configuration du profil</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.primaryButtonText}>
            {loading ? 'Finalisation...' : currentStep === totalSteps ? 'Terminer' : 'Continuer'}
          </Text>
          {currentStep < totalSteps && (
            <ChevronRight size={20} color="#ffffff" />
          )}
          {currentStep === totalSteps && (
            <Star size={20} color="#ffffff" />
          )}
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
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  logoPreview: {
    alignItems: 'center',
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#16a34a',
  },
  removeButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  removeText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: '500',
  },
  sectorsContainer: {
    maxHeight: 300,
  },
  sectorItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectorItemSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  sectorText: {
    fontSize: 16,
    color: '#374151',
  },
  sectorTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
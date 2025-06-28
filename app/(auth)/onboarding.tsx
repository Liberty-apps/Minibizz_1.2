import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { User, Building, Briefcase, Upload, Check, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { onboardingService, ACTIVITES_PROFESSIONNELLES, type OnboardingData } from '../../src/services/onboarding';

export default function Onboarding() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingData>({
    nom: '',
    prenom: '',
    nom_entreprise: '',
    activite_principale: '',
    logo_url: ''
  });

  const totalSteps = 4;

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.prenom.trim()) return 'Le prénom est obligatoire';
        if (!formData.nom.trim()) return 'Le nom est obligatoire';
        return null;
      case 2:
        // Nom d'entreprise optionnel
        return null;
      case 3:
        // Logo optionnel
        return null;
      case 4:
        if (!formData.activite_principale) return 'Veuillez sélectionner votre secteur d\'activité';
        return null;
      default:
        return null;
    }
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      Alert.alert('Erreur', error);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogoUpload = () => {
    // Créer un input file invisible
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return;
    }

    try {
      setLoading(true);

      let logoUrl = '';
      if (logoFile) {
        logoUrl = await onboardingService.uploadLogo(user.id, logoFile);
      }

      const onboardingData: OnboardingData = {
        ...formData,
        logo_url: logoUrl
      };

      await onboardingService.completeOnboarding(user.id, onboardingData);
      
      Alert.alert(
        'Bienvenue !',
        'Votre profil a été configuré avec succès. Vous pouvez maintenant utiliser toutes les fonctionnalités de MiniBizz.',
        [
          {
            text: 'Commencer',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      console.error('Erreur onboarding:', error);
      Alert.alert('Erreur', 'Impossible de finaliser la configuration. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <User size={32} color="#2563eb" />
              <Text style={styles.stepTitle}>Informations personnelles</Text>
              <Text style={styles.stepDescription}>
                Commençons par vos informations de base
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                value={formData.prenom}
                onChangeText={(text) => setFormData({...formData, prenom: text})}
                placeholder="Votre prénom"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={formData.nom}
                onChangeText={(text) => setFormData({...formData, nom: text})}
                placeholder="Votre nom de famille"
                autoCapitalize="words"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Building size={32} color="#2563eb" />
              <Text style={styles.stepTitle}>Nom de votre entreprise</Text>
              <Text style={styles.stepDescription}>
                Comment souhaitez-vous nommer votre auto-entreprise ? (optionnel)
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom d'entreprise</Text>
              <TextInput
                style={styles.input}
                value={formData.nom_entreprise}
                onChangeText={(text) => setFormData({...formData, nom_entreprise: text})}
                placeholder="Ex: JD Consulting, Martin Services..."
                autoCapitalize="words"
              />
              <Text style={styles.helperText}>
                Vous pourrez modifier ce nom à tout moment dans les paramètres
              </Text>
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Upload size={32} color="#2563eb" />
              <Text style={styles.stepTitle}>Logo de votre entreprise</Text>
              <Text style={styles.stepDescription}>
                Ajoutez un logo pour personnaliser vos documents (optionnel)
              </Text>
            </View>

            <View style={styles.logoUploadContainer}>
              {logoPreview ? (
                <View style={styles.logoPreview}>
                  <Image source={{ uri: logoPreview }} style={styles.logoImage} />
                  <TouchableOpacity style={styles.changeLogoButton} onPress={handleLogoUpload}>
                    <Text style={styles.changeLogoText}>Changer le logo</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.uploadButton} onPress={handleLogoUpload}>
                  <Upload size={24} color="#6b7280" />
                  <Text style={styles.uploadText}>Télécharger un logo</Text>
                  <Text style={styles.uploadSubtext}>PNG, JPG jusqu'à 2MB</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <Briefcase size={32} color="#2563eb" />
              <Text style={styles.stepTitle}>Secteur d'activité</Text>
              <Text style={styles.stepDescription}>
                Sélectionnez votre domaine d'activité principal
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Activité principale *</Text>
              <View style={styles.selectContainer}>
                <select
                  style={styles.select}
                  value={formData.activite_principale}
                  onChange={(e) => setFormData({...formData, activite_principale: e.target.value})}
                >
                  <option value="">Sélectionnez votre activité</option>
                  {ACTIVITES_PROFESSIONNELLES.map((activite) => (
                    <option key={activite} value={activite}>
                      {activite}
                    </option>
                  ))}
                </select>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
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

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuration de votre profil</Text>
          <Text style={styles.subtitle}>
            Quelques informations pour personnaliser votre expérience
          </Text>
        </View>

        {renderStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handlePrevious}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>Précédent</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Finalisation...' : currentStep === totalSteps ? 'Terminer' : 'Suivant'}
          </Text>
          {!loading && <ArrowRight size={16} color="#ffffff" />}
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
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  stepContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
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
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  select: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  logoUploadContainer: {
    alignItems: 'center',
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    width: '100%',
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  logoPreview: {
    alignItems: 'center',
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
  },
  changeLogoButton: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  changeLogoText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
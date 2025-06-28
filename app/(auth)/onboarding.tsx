import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { User, Building, Upload, ChevronDown, Check, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { onboardingService } from '../../src/services/onboarding';

export default function Onboarding() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showActiviteDropdown, setShowActiviteDropdown] = useState(false);
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    nom_entreprise: '',
    logo_url: '',
    activite_principale: ''
  });

  const activites = onboardingService.getActivites();
  const totalSteps = 4;

  useEffect(() => {
    loadExistingProfile();
  }, [user]);

  const loadExistingProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await onboardingService.getProfile(user.id);
      if (profile) {
        setFormData({
          nom: profile.nom || '',
          prenom: profile.prenom || '',
          nom_entreprise: '',
          logo_url: '',
          activite_principale: profile.activite_principale || ''
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.nom.trim().length > 0 && formData.prenom.trim().length > 0;
      case 2:
        return true; // Nom d'entreprise optionnel
      case 3:
        return true; // Logo optionnel
      case 4:
        return formData.activite_principale.length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
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

  const handleComplete = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Utilisateur non connecté');
      return;
    }

    try {
      setLoading(true);
      await onboardingService.updateProfile(user.id, formData);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Erreur lors de la finalisation:', error);
      Alert.alert('Erreur', 'Impossible de finaliser l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = () => {
    // Simulation d'upload de logo
    Alert.alert('Upload de logo', 'Fonctionnalité d\'upload en cours de développement');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            index + 1 <= currentStep && styles.stepCircleActive,
            index + 1 < currentStep && styles.stepCircleCompleted
          ]}>
            {index + 1 < currentStep ? (
              <Check size={16} color="#ffffff" />
            ) : (
              <Text style={[
                styles.stepNumber,
                index + 1 <= currentStep && styles.stepNumberActive
              ]}>
                {index + 1}
              </Text>
            )}
          </View>
          {index < totalSteps - 1 && (
            <View style={[
              styles.stepLine,
              index + 1 < currentStep && styles.stepLineCompleted
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
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
          placeholderTextColor="#9ca3af"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          value={formData.nom}
          onChangeText={(text) => setFormData({...formData, nom: text})}
          placeholder="Votre nom"
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Building size={32} color="#2563eb" />
        <Text style={styles.stepTitle}>Votre entreprise</Text>
        <Text style={styles.stepDescription}>
          Donnez un nom à votre auto-entreprise (optionnel)
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom de l'entreprise</Text>
        <TextInput
          style={styles.input}
          value={formData.nom_entreprise}
          onChangeText={(text) => setFormData({...formData, nom_entreprise: text})}
          placeholder="Ex: MonEntreprise SARL"
          placeholderTextColor="#9ca3af"
        />
        <Text style={styles.helperText}>
          Vous pourrez modifier cette information plus tard
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Upload size={32} color="#2563eb" />
        <Text style={styles.stepTitle}>Logo de l'entreprise</Text>
        <Text style={styles.stepDescription}>
          Ajoutez votre logo (optionnel)
        </Text>
      </View>

      <TouchableOpacity style={styles.uploadArea} onPress={handleLogoUpload}>
        <Upload size={48} color="#9ca3af" />
        <Text style={styles.uploadText}>Cliquez pour télécharger votre logo</Text>
        <Text style={styles.uploadSubtext}>PNG, JPG jusqu'à 5MB</Text>
      </TouchableOpacity>

      <Text style={styles.helperText}>
        Vous pourrez ajouter ou modifier votre logo plus tard dans les paramètres
      </Text>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Building size={32} color="#2563eb" />
        <Text style={styles.stepTitle}>Secteur d'activité</Text>
        <Text style={styles.stepDescription}>
          Sélectionnez votre domaine d'activité principal
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Activité principale *</Text>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowActiviteDropdown(!showActiviteDropdown)}
        >
          <Text style={[
            styles.dropdownText,
            !formData.activite_principale && styles.dropdownPlaceholder
          ]}>
            {formData.activite_principale || 'Sélectionnez votre activité'}
          </Text>
          <ChevronDown size={20} color="#9ca3af" />
        </TouchableOpacity>

        {showActiviteDropdown && (
          <View style={styles.dropdownList}>
            <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
              {activites.map((activite, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setFormData({...formData, activite_principale: activite});
                    setShowActiviteDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{activite}</Text>
                  {formData.activite_principale === activite && (
                    <Check size={16} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Finalisons votre profil</Text>
          <Text style={styles.subtitle}>
            Quelques informations pour personnaliser votre expérience
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton, currentStep === 1 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentStep === 1}
        >
          <Text style={[styles.navButtonText, styles.prevButtonText]}>Précédent</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !validateStep(currentStep) && styles.navButtonDisabled,
            loading && styles.navButtonDisabled
          ]}
          onPress={handleNext}
          disabled={!validateStep(currentStep) || loading}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === totalSteps ? (loading ? 'Finalisation...' : 'Terminer') : 'Suivant'}
          </Text>
          {currentStep < totalSteps && <ArrowRight size={16} color="#ffffff" />}
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    alignItems: 'center',
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  stepCircleActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  stepCircleCompleted: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9ca3af',
  },
  stepNumberActive: {
    color: '#ffffff',
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  stepLineCompleted: {
    backgroundColor: '#16a34a',
  },
  stepContent: {
    padding: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 16,
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
    marginTop: 8,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  uploadText: {
    fontSize: 16,
    color: '#374151',
    marginTop: 12,
    fontWeight: '500',
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111827',
    flex: 1,
  },
  dropdownPlaceholder: {
    color: '#9ca3af',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
    flex: 1,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 24,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  nextButton: {
    backgroundColor: '#2563eb',
    marginLeft: 12,
    flexDirection: 'row',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  prevButtonText: {
    color: '#6b7280',
  },
  nextButtonText: {
    color: '#ffffff',
  },
});
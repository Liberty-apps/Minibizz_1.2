import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { Building, User, MapPin, Phone, Mail, ArrowRight, CheckCircle, FileText } from 'lucide-react-native';

export default function Onboarding() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Informations personnelles
    nom: '',
    prenom: '',
    telephone: '',
    
    // Informations entreprise
    activite_principale: '',
    forme_juridique: 'Auto-entrepreneur',
    siret: '',
    
    // Adresse
    adresse: '',
    code_postal: '',
    ville: '',
    pays: 'France',
    
    // Paramètres fiscaux
    taux_tva: '0',
    regime_fiscal: 'Micro-entreprise'
  });

  const totalSteps = 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.nom.trim() && formData.prenom.trim();
      case 2:
        return formData.activite_principale.trim();
      case 3:
        return formData.ville.trim();
      default:
        return true;
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
    try {
      setLoading(true);
      
      // Ici vous pourriez sauvegarder les données du profil
      // await profileService.updateProfile(user.id, formData);
      
      Alert.alert(
        'Configuration terminée !',
        'Votre profil a été configuré avec succès.',
        [
          {
            text: 'Commencer',
            onPress: () => router.replace('/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder votre profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Passer la configuration',
      'Vous pourrez configurer votre profil plus tard dans les paramètres.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Passer',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            index + 1 <= currentStep && styles.stepCircleActive
          ]}>
            {index + 1 < currentStep ? (
              <CheckCircle size={16} color="#ffffff" />
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
              index + 1 < currentStep && styles.stepLineActive
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
          onChangeText={(value) => handleInputChange('prenom', value)}
          placeholder="Votre prénom"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          value={formData.nom}
          onChangeText={(value) => handleInputChange('nom', value)}
          placeholder="Votre nom"
          autoCapitalize="words"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={formData.telephone}
          onChangeText={(value) => handleInputChange('telephone', value)}
          placeholder="06 12 34 56 78"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <Building size={32} color="#2563eb" />
        <Text style={styles.stepTitle}>Votre activité</Text>
        <Text style={styles.stepDescription}>
          Décrivez votre activité professionnelle
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Activité principale *</Text>
        <TextInput
          style={styles.input}
          value={formData.activite_principale}
          onChangeText={(value) => handleInputChange('activite_principale', value)}
          placeholder="Ex: Développement web, Conseil, Design..."
          multiline
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Forme juridique</Text>
        <View style={styles.selectContainer}>
          {['Auto-entrepreneur', 'EURL', 'SASU', 'SAS', 'SARL'].map((forme) => (
            <TouchableOpacity
              key={forme}
              style={[
                styles.selectOption,
                formData.forme_juridique === forme && styles.selectOptionActive
              ]}
              onPress={() => handleInputChange('forme_juridique', forme)}
            >
              <Text style={[
                styles.selectOptionText,
                formData.forme_juridique === forme && styles.selectOptionTextActive
              ]}>
                {forme}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>SIRET (optionnel)</Text>
        <TextInput
          style={styles.input}
          value={formData.siret}
          onChangeText={(value) => handleInputChange('siret', value)}
          placeholder="12345678901234"
          keyboardType="numeric"
          maxLength={14}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MapPin size={32} color="#2563eb" />
        <Text style={styles.stepTitle}>Adresse</Text>
        <Text style={styles.stepDescription}>
          Où exercez-vous votre activité ?
        </Text>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={formData.adresse}
          onChangeText={(value) => handleInputChange('adresse', value)}
          placeholder="123 rue de la République"
        />
      </View>

      <View style={styles.formRow}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Code postal</Text>
          <TextInput
            style={styles.input}
            value={formData.code_postal}
            onChangeText={(value) => handleInputChange('code_postal', value)}
            placeholder="75001"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={[styles.formGroup, { flex: 2, marginLeft: 8 }]}>
          <Text style={styles.label}>Ville *</Text>
          <TextInput
            style={styles.input}
            value={formData.ville}
            onChangeText={(value) => handleInputChange('ville', value)}
            placeholder="Paris"
            autoCapitalize="words"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Pays</Text>
        <TextInput
          style={styles.input}
          value={formData.pays}
          onChangeText={(value) => handleInputChange('pays', value)}
          placeholder="France"
          autoCapitalize="words"
        />
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <FileText color="#ffffff" size={24} />
          </View>
          <Text style={styles.title}>Configuration du profil</Text>
          <Text style={styles.subtitle}>
            Étape {currentStep} sur {totalSteps}
          </Text>
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handlePrevious}
            >
              <Text style={styles.secondaryButtonText}>Précédent</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
          >
            <Text style={styles.skipButtonText}>Passer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              !validateStep(currentStep) && styles.primaryButtonDisabled,
              loading && styles.primaryButtonDisabled
            ]}
            onPress={handleNext}
            disabled={!validateStep(currentStep) || loading}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep === totalSteps ? (loading ? 'Finalisation...' : 'Terminer') : 'Suivant'}
            </Text>
            <ArrowRight size={16} color="#ffffff" />
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#2563eb',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
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
  stepLineActive: {
    backgroundColor: '#2563eb',
  },
  stepContent: {
    padding: 24,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 14,
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
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  selectContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  selectOptionActive: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  selectOptionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectOptionTextActive: {
    color: '#2563eb',
    fontWeight: '500',
  },
  navigation: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 16,
    ...Platform.select({
      ios: {
        paddingBottom: 32,
      },
    }),
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});
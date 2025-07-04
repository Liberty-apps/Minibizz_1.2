import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { FileText, Mail, Lock, CircleAlert as AlertCircle, CircleCheck as CheckCircle, Eye, EyeOff } from 'lucide-react-native';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      return 'Veuillez saisir votre adresse email';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Veuillez saisir une adresse email valide';
    }

    if (!password.trim()) {
      return 'Veuillez saisir un mot de passe';
    }

    if (password.length < 6) {
      return 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (!confirmPassword.trim()) {
      return 'Veuillez confirmer votre mot de passe';
    }

    if (password !== confirmPassword) {
      return 'Les mots de passe ne correspondent pas';
    }

    if (!acceptTerms) {
      return 'Veuillez accepter les conditions d\'utilisation';
    }

    return null;
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '#e5e7eb' };
    if (password.length < 6) return { strength: 25, label: 'Faible', color: '#dc2626' };
    if (password.length < 8) return { strength: 50, label: 'Moyen', color: '#eab308' };
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 100, label: 'Fort', color: '#16a34a' };
    }
    return { strength: 75, label: 'Bon', color: '#059669' };
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      console.log('Attempting to register with:', email);
      await register(email.trim(), password);
      console.log('Registration successful, navigating to dashboard');
      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Échec de la création du compte. Vérifiez vos informations.';
      
      if (error.message.includes('Configuration Supabase manquante')) {
        errorMessage = 'Erreur de configuration. Contactez le support technique.';
      } else if (error.message.includes('Un compte existe déjà')) {
        errorMessage = 'Un compte existe déjà avec cette adresse email';
      } else if (error.message.includes('Impossible de se connecter au serveur')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTermsPress = () => {
    if (Platform.OS === 'web') {
      window.open('https://minibizz.fr/terms', '_blank');
    } else {
      Linking.openURL('https://minibizz.fr/terms');
    }
  };

  const handlePrivacyPress = () => {
    if (Platform.OS === 'web') {
      window.open('https://minibizz.fr/privacy', '_blank');
    } else {
      Linking.openURL('https://minibizz.fr/privacy');
    }
  };

  const passwordStrength = getPasswordStrength();
  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <FileText color="#ffffff" size={32} />
          </View>
          <Text style={styles.title}>MiniBizz</Text>
          <Text style={styles.subtitle}>
            Créez votre compte auto-entrepreneur
          </Text>
        </View>
        
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              <AlertCircle color="#ef4444" size={20} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse email</Text>
            <View style={styles.inputContainer}>
              <Mail color="#9ca3af" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) setError('');
                }}
                placeholder="votre@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={!loading}
                accessibilityLabel="Adresse email"
                accessibilityHint="Saisissez votre adresse email"
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#9ca3af" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                editable={!loading}
                accessibilityLabel="Mot de passe"
                accessibilityHint="Saisissez votre mot de passe"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                accessibilityLabel={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthFill, 
                      { 
                        width: `${passwordStrength.strength}%`,
                        backgroundColor: passwordStrength.color
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.label}
                </Text>
              </View>
            )}
            
            <Text style={styles.helperText}>Au moins 6 caractères</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmer le mot de passe</Text>
            <View style={styles.inputContainer}>
              <Lock color="#9ca3af" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                autoComplete="new-password"
                editable={!loading}
                accessibilityLabel="Confirmer le mot de passe"
                accessibilityHint="Confirmez votre mot de passe"
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                accessibilityLabel={showConfirmPassword ? "Masquer la confirmation" : "Afficher la confirmation"}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#9ca3af" />
                ) : (
                  <Eye size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
              {isPasswordMatch && (
                <View style={styles.checkIcon}>
                  <CheckCircle color="#10b981" size={20} />
                </View>
              )}
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => setAcceptTerms(!acceptTerms)}
              accessibilityLabel="Accepter les conditions"
              accessibilityRole="checkbox"
              accessibilityState={{ checked: acceptTerms }}
            >
              <View style={[styles.checkboxBox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <CheckCircle size={16} color="#ffffff" />}
              </View>
            </TouchableOpacity>
            <View style={styles.termsText}>
              <Text style={styles.termsTextContent}>
                J'accepte les{' '}
                <Text style={styles.termsLink} onPress={handleTermsPress}>
                  conditions d'utilisation
                </Text>
                {' '}et la{' '}
                <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                  politique de confidentialité
                </Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityLabel="Créer mon compte"
            accessibilityHint="Appuyez pour créer votre compte"
          >
            <Text style={styles.buttonText}>
              {loading ? 'Création...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Déjà un compte ?{' '}
              <Link href="/(auth)/login" style={styles.link}>
                Se connecter
              </Link>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9ff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#ffffff',
    padding: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#dc2626',
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    padding: 12,
  },
  checkIcon: {
    marginRight: 12,
  },
  passwordStrength: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  checkbox: {
    marginTop: 2,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  termsText: {
    flex: 1,
  },
  termsTextContent: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#6b7280',
  },
  link: {
    color: '#2563eb',
    fontWeight: '500',
  },
});
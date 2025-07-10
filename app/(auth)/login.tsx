import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { FileText, Mail, Lock, CircleAlert as AlertCircle, Wifi, WifiOff, Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const validateForm = () => {
    if (!email.trim()) {
      return 'Veuillez saisir votre adresse email';
    }

    if (!password.trim()) {
      return 'Veuillez saisir votre mot de passe';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Veuillez saisir une adresse email valide';
    }

    return null;
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

      
      // Simuler un login réussi pour le mode démo
      setTimeout(() => {
        setLoading(false);
        router.replace('/(tabs)');
      }, 1500);
      
      // En mode production, on utiliserait:
      // await login(email.trim(), password);
      // router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Échec de la connexion. Vérifiez vos identifiants.';
      
      if (error.message.includes('Configuration Supabase manquante')) {
        errorMessage = 'Erreur de configuration. Contactez le support technique.';
      } else if (error.message.includes('Impossible de se connecter au serveur')) {
        errorMessage = 'Problème de connexion. Vérifiez votre connexion internet.';
      } else if (error.message.includes('Email ou mot de passe incorrect')) {
        errorMessage = 'Email ou mot de passe incorrect';
      } else if (error.message.includes('confirmer votre email')) {
        errorMessage = 'Veuillez confirmer votre email avant de vous connecter';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (Platform.OS === 'web') {
      // Sur web, on peut ouvrir une nouvelle page
      window.open('mailto:support@minibizz.fr?subject=Mot de passe oublié&body=Bonjour, j\'ai oublié mon mot de passe pour le compte : ' + email, '_blank');
    } else {
      // Sur mobile, utiliser Linking
      Linking.openURL('mailto:support@minibizz.fr?subject=Mot de passe oublié&body=Bonjour, j\'ai oublié mon mot de passe pour le compte : ' + email);
    }
  };

  const getErrorIcon = () => {
    if (error.includes('connexion') || error.includes('serveur')) {
      return <WifiOff color="#ef4444" size={20} />;
    }
    return <AlertCircle color="#ef4444" size={20} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <FileText color="#ffffff" size={32} />
          </View>
          <Text style={styles.title}>MiniBizz</Text>
          <Text style={styles.subtitle}>
            Connectez-vous à votre espace auto-entrepreneur
          </Text>
        </View>
        
        <View style={styles.form}>
          {error ? (
            <View style={styles.errorContainer}>
              {getErrorIcon()}
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
                autoComplete="password"
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
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityLabel="Se connecter"
            accessibilityHint="Appuyez pour vous connecter"
          >
            <Text style={styles.buttonText}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>
              Pas encore de compte ?{' '}
              <Link href="/(auth)/register" style={styles.link}>
                Créer un compte
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    ...Platform.select({
      web: {
        outlineWidth: 0,
      },
    }),
  },
  eyeButton: {
    padding: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
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
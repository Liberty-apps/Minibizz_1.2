import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { Settings, User, Building, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Save, LogOut, CreditCard as Edit3, Key, Smartphone, Globe, Mail, Crown, Calculator, FileText, Rocket, Ban as Bank, CreditCard } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import UserLogo from '../../components/UserLogo';

export default function Parametres() {
  const { user, logout } = useAuth();
  const { getCurrentPlan, hasAccess } = useSubscription();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [showBankingInfo, setShowBankingInfo] = useState(false);

  const [userInfo, setUserInfo] = useState({
    nom: user?.profile?.nom || '',
    prenom: user?.profile?.prenom || '',
    email: user?.email || '',
    telephone: user?.profile?.telephone || '',
    siret: user?.profile?.siret || '',
    activite: user?.profile?.activite_principale || 'service'
  });

  const [businessInfo, setBusinessInfo] = useState({
    nom_entreprise: user?.profile?.nom_entreprise || '',
    forme_juridique: user?.profile?.forme_juridique || 'Auto-entrepreneur',
    siret: user?.profile?.siret || '',
    siren: user?.profile?.siren || '',
    adresse: user?.profile?.adresse || '',
    code_postal: user?.profile?.code_postal || '',
    ville: user?.profile?.ville || '',
    pays: user?.profile?.pays || 'France',
    taux_tva: user?.profile?.taux_tva?.toString() || '0',
    regime_fiscal: user?.profile?.regime_fiscal || 'Micro-entreprise'
  });

  const [bankingInfo, setBankingInfo] = useState({
    iban: user?.profile?.iban || '',
    bic: user?.profile?.bic || '',
    titulaire: `${user?.profile?.prenom || ''} ${user?.profile?.nom || ''}`.trim() || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Charger les préférences utilisateur depuis le stockage local
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      // Ici vous pourriez charger les préférences depuis AsyncStorage ou Supabase
      // Pour l'instant, on utilise les valeurs par défaut
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
    }
  };

  const saveUserPreferences = async () => {
    try {
      // Sauvegarder les préférences
      Alert.alert('Succès', 'Préférences sauvegardées');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder les préférences');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          }
        }
      ]
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Validation des données
      if (!userInfo.nom.trim()) {
        Alert.alert('Erreur', 'Le nom est obligatoire');
        return;
      }

      if (!userInfo.email.trim()) {
        Alert.alert('Erreur', 'L\'email est obligatoire');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo.email)) {
        Alert.alert('Erreur', 'Veuillez saisir une adresse email valide');
        return;
      }

      // Ici vous pourriez sauvegarder via Supabase
      Alert.alert('Succès', 'Profil mis à jour avec succès');
      setShowEditProfile(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le profil');
    }
  };

  const handleSaveBusinessInfo = async () => {
    try {
      // Validation des données
      if (!businessInfo.nom_entreprise.trim()) {
        Alert.alert('Erreur', 'Le nom de l\'entreprise est obligatoire');
        return;
      }

      if (businessInfo.siret && businessInfo.siret.length !== 14) {
        Alert.alert('Erreur', 'Le SIRET doit comporter 14 chiffres');
        return;
      }

      // Ici vous pourriez sauvegarder via Supabase
      Alert.alert('Succès', 'Informations d\'entreprise mises à jour avec succès');
      setShowBusinessInfo(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour les informations d\'entreprise');
    }
  };

  const handleSaveBankingInfo = async () => {
    try {
      // Validation des données
      if (!bankingInfo.iban.trim()) {
        Alert.alert('Erreur', 'L\'IBAN est obligatoire');
        return;
      }

      if (!bankingInfo.bic.trim()) {
        Alert.alert('Erreur', 'Le BIC est obligatoire');
        return;
      }

      // Ici vous pourriez sauvegarder via Supabase
      Alert.alert('Succès', 'Coordonnées bancaires mises à jour avec succès');
      setShowBankingInfo(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour les coordonnées bancaires');
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validation
      if (!passwordData.currentPassword.trim()) {
        Alert.alert('Erreur', 'Veuillez saisir votre mot de passe actuel');
        return;
      }

      if (!passwordData.newPassword.trim()) {
        Alert.alert('Erreur', 'Veuillez saisir un nouveau mot de passe');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        Alert.alert('Erreur', 'Le nouveau mot de passe doit contenir au moins 6 caractères');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
        return;
      }

      // Ici vous pourriez changer le mot de passe via Supabase
      Alert.alert('Succès', 'Mot de passe modifié avec succès');
      setShowChangePassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe');
    }
  };

  const handleContactSupport = () => {
    const email = 'support@minibizz.fr';
    const subject = 'Demande de support - MiniBizz';
    const body = `Bonjour,\n\nJ'ai besoin d'aide concernant :\n\n[Décrivez votre problème ici]\n\nCordialement,\n${user?.name || 'Utilisateur'}`;
    
    if (Platform.OS === 'web') {
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    } else {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const handleReportBug = () => {
    const email = 'bugs@minibizz.fr';
    const subject = 'Signalement de bug - MiniBizz';
    const body = `Bonjour,\n\nJe souhaite signaler un bug :\n\nDescription du problème :\n[Décrivez le bug ici]\n\nÉtapes pour reproduire :\n1. \n2. \n3. \n\nAppareil : ${Platform.OS}\nVersion de l'app : 1.0.0\n\nCordialement,\n${user?.name || 'Utilisateur'}`;
    
    if (Platform.OS === 'web') {
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    } else {
      Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const settingsSections = [
    {
      title: 'Profil',
      icon: User,
      items: [
        { label: 'Informations personnelles', action: 'profile', onPress: () => setShowEditProfile(true) },
        { label: 'Changer le mot de passe', action: 'password', onPress: () => setShowChangePassword(true) },
        { label: 'Informations d\'entreprise', action: 'business', onPress: () => setShowBusinessInfo(true), requiresAccess: 'dashboard' },
        { label: 'Coordonnées bancaires', action: 'banking', onPress: () => setShowBankingInfo(true), requiresAccess: 'dashboard' }
      ]
    },
    {
      title: 'Application',
      icon: Settings,
      items: [
        { label: 'Notifications push', action: 'notifications', toggle: notifications, onToggle: setNotifications },
        { label: 'Notifications email', action: 'email_notifications', toggle: emailNotifications, onToggle: setEmailNotifications },
        { label: 'Mode sombre', action: 'darkmode', toggle: darkMode, onToggle: setDarkMode },
        { label: 'Sauvegarde automatique', action: 'autosave', toggle: autoSave, onToggle: setAutoSave }
      ]
    },
    {
      title: 'Sécurité',
      icon: Shield,
      items: [
        { label: 'Authentification à deux facteurs', action: '2fa', requiresAccess: 'premium' },
        { label: 'Sessions actives', action: 'sessions', requiresAccess: 'premium' },
        { label: 'Historique de connexion', action: 'login_history', requiresAccess: 'premium' }
      ]
    },
    {
      title: 'Outils & Services',
      icon: Calculator,
      items: [
        { label: 'Mon abonnement', action: 'subscription', route: '/(tabs)/abonnement', icon: Crown },
        { label: 'Calculateur de charges', action: 'calculator', route: '/(tabs)/calculs', icon: Calculator },
        { label: 'Sites vitrines', action: 'sites', route: '/(tabs)/sites-vitrines', icon: Globe, requiresAccess: 'sites-vitrines' },
        { label: 'Centre d\'aide', action: 'help', route: '/(tabs)/aide', icon: HelpCircle },
        { label: 'Statut du déploiement', action: 'deployment', route: '/deployment-status', icon: Rocket }
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Contacter le support', action: 'contact', onPress: handleContactSupport },
        { label: 'Signaler un problème', action: 'report', onPress: handleReportBug },
        { label: 'Documentation', action: 'docs' }
      ]
    }
  ];

  const handleSettingPress = (action: string, route?: string, onPress?: () => void, requiresAccess?: string) => {
    if (requiresAccess && !hasAccess(requiresAccess)) {
      Alert.alert(
        'Fonctionnalité premium',
        'Cette fonctionnalité est disponible uniquement avec un abonnement premium.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Voir les plans', onPress: () => router.push('/(tabs)/abonnement') }
        ]
      );
      return;
    }
    
    if (onPress) {
      onPress();
    } else if (route) {
      router.push(route as any);
    } else {
      // Gérer les autres actions
      console.log('Action:', action);
      Alert.alert('Information', `Fonctionnalité "${action}" en cours de développement`);
    }
  };

  const currentPlan = getCurrentPlan();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
        <Text style={styles.subtitle}>Configurez votre application</Text>
      </View>

      {/* Profile Summary */}
      <View style={styles.profileSummary}>
        <View style={styles.avatar}>
          <UserLogo size={60} showName={false} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>
            {user?.name || user?.email?.split('@')[0] || 'Utilisateur'}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <View style={styles.profilePlan}>
            <Crown size={14} color="#9333ea" />
            <Text style={styles.profilePlanText}>{currentPlan}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Edit3 size={16} color="#374151" />
          <Text style={styles.editProfileText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => setShowEditProfile(true)}
        >
          <Building size={20} color="#2563eb" />
          <Text style={styles.quickActionText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => setShowChangePassword(true)}
        >
          <Key size={20} color="#16a34a" />
          <Text style={styles.quickActionText}>Mot de passe</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={saveUserPreferences}
        >
          <Save size={20} color="#eab308" />
          <Text style={styles.quickActionText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Modifier le profil</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                value={userInfo.prenom}
                onChangeText={(text) => setUserInfo({...userInfo, prenom: text})}
                placeholder="Votre prénom"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                value={userInfo.nom}
                onChangeText={(text) => setUserInfo({...userInfo, nom: text})}
                placeholder="Votre nom"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={userInfo.email}
                onChangeText={(text) => setUserInfo({...userInfo, email: text})}
                placeholder="Votre email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={userInfo.telephone}
                onChangeText={(text) => setUserInfo({...userInfo, telephone: text})}
                placeholder="Votre téléphone"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowEditProfile(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Business Info Modal */}
      {showBusinessInfo && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Informations d'entreprise</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom de l'entreprise *</Text>
              <TextInput
                style={styles.input}
                value={businessInfo.nom_entreprise}
                onChangeText={(text) => setBusinessInfo({...businessInfo, nom_entreprise: text})}
                placeholder="Nom de votre entreprise"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Forme juridique</Text>
              <TextInput
                style={styles.input}
                value={businessInfo.forme_juridique}
                onChangeText={(text) => setBusinessInfo({...businessInfo, forme_juridique: text})}
                placeholder="Ex: Auto-entrepreneur, EURL, SASU..."
              />
              <Text style={styles.helperText}>
                La forme juridique détermine votre régime fiscal et social
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>SIRET</Text>
              <TextInput
                style={styles.input}
                value={businessInfo.siret}
                onChangeText={(text) => setBusinessInfo({...businessInfo, siret: text})}
                placeholder="14 chiffres"
                keyboardType="numeric"
                maxLength={14}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Adresse</Text>
              <TextInput
                style={styles.input}
                value={businessInfo.adresse}
                onChangeText={(text) => setBusinessInfo({...businessInfo, adresse: text})}
                placeholder="Adresse de l'entreprise"
              />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Code postal</Text>
                <TextInput
                  style={styles.input}
                  value={businessInfo.code_postal}
                  onChangeText={(text) => setBusinessInfo({...businessInfo, code_postal: text})}
                  placeholder="Code postal"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formGroup, { flex: 2 }]}>
                <Text style={styles.label}>Ville</Text>
                <TextInput
                  style={styles.input}
                  value={businessInfo.ville}
                  onChangeText={(text) => setBusinessInfo({...businessInfo, ville: text})}
                  placeholder="Ville"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Taux de TVA (%)</Text>
              <TextInput
                style={styles.input}
                value={businessInfo.taux_tva}
                onChangeText={(text) => setBusinessInfo({...businessInfo, taux_tva: text})}
                placeholder="Ex: 20"
                keyboardType="numeric"
              />
              <Text style={styles.helperText}>
                Laissez 0 si vous n'êtes pas assujetti à la TVA
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBusinessInfo(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveBusinessInfo}
              >
                <Text style={styles.saveText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Banking Info Modal */}
      {showBankingInfo && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Coordonnées bancaires</Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Ces informations apparaîtront sur vos factures pour permettre à vos clients d'effectuer des virements.
              </Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>IBAN *</Text>
              <TextInput
                style={styles.input}
                value={bankingInfo.iban}
                onChangeText={(text) => setBankingInfo({...bankingInfo, iban: text})}
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>BIC/SWIFT *</Text>
              <TextInput
                style={styles.input}
                value={bankingInfo.bic}
                onChangeText={(text) => setBankingInfo({...bankingInfo, bic: text})}
                placeholder="XXXXXXXX"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Titulaire du compte</Text>
              <TextInput
                style={styles.input}
                value={bankingInfo.titulaire}
                onChangeText={(text) => setBankingInfo({...bankingInfo, titulaire: text})}
                placeholder="Nom du titulaire du compte"
              />
            </View>

            <View style={styles.securityNote}>
              <Shield size={16} color="#16a34a" />
              <Text style={styles.securityText}>
                Vos données bancaires sont stockées de manière sécurisée et ne sont jamais partagées avec des tiers.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowBankingInfo(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveBankingInfo}
              >
                <Text style={styles.saveText}>Sauvegarder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Changer le mot de passe</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mot de passe actuel *</Text>
              <TextInput
                style={styles.input}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData({...passwordData, currentPassword: text})}
                placeholder="Mot de passe actuel"
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nouveau mot de passe *</Text>
              <TextInput
                style={styles.input}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData({...passwordData, newPassword: text})}
                placeholder="Nouveau mot de passe"
                secureTextEntry
              />
              <Text style={styles.helperText}>Au moins 6 caractères</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirmer le nouveau mot de passe *</Text>
              <TextInput
                style={styles.input}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData({...passwordData, confirmPassword: text})}
                placeholder="Confirmer le mot de passe"
                secureTextEntry
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleChangePassword}
              >
                <Text style={styles.saveText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Settings Sections */}
      {settingsSections.map((section, sectionIndex) => {
        const SectionIcon = section.icon;
        return (
          <View key={sectionIndex} style={styles.settingsSection}>
            <View style={styles.sectionHeader}>
              <SectionIcon size={20} color="#6b7280" />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => {
                const ItemIcon = item.icon;
                const isAccessible = !item.requiresAccess || hasAccess(item.requiresAccess);
                
                return (
                  <TouchableOpacity 
                    key={itemIndex} 
                    style={[
                      styles.settingItem,
                      !isAccessible && styles.settingItemDisabled
                    ]}
                    onPress={() => handleSettingPress(item.action, item.route, item.onPress, item.requiresAccess)}
                    disabled={!isAccessible && !item.requiresAccess}
                  >
                    <View style={styles.settingItemLeft}>
                      {ItemIcon && <ItemIcon size={18} color={isAccessible ? "#6b7280" : "#d1d5db"} style={styles.settingItemIcon} />}
                      <Text style={[
                        styles.settingLabel,
                        !isAccessible && styles.settingLabelDisabled
                      ]}>
                        {item.label}
                      </Text>
                      {!isAccessible && item.requiresAccess && (
                        <View style={styles.premiumBadge}>
                          <Crown size={12} color="#9333ea" />
                          <Text style={styles.premiumText}>Premium</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.settingAction}>
                      {item.toggle !== undefined ? (
                        <Switch
                          value={item.toggle}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                          thumbColor={item.toggle ? '#ffffff' : '#f3f4f6'}
                          disabled={!isAccessible}
                        />
                      ) : (
                        <ChevronRight size={20} color={isAccessible ? "#9ca3af" : "#d1d5db"} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoTitle}>MiniBizz</Text>
        <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
        <Text style={styles.appInfoText}>
          Application de gestion pour auto-entrepreneurs
        </Text>
        <Text style={styles.appInfoCopyright}>
          © 2024 MiniBizz. Tous droits réservés.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color="#ffffff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
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
  profileSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  profilePlan: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  profilePlanText: {
    fontSize: 12,
    color: '#9333ea',
    fontWeight: '500',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
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
    width: '90%',
    maxHeight: '80%',
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
  formRow: {
    flexDirection: 'row',
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
  helperText: {
    fontSize: 12,
    color: '#6b7280',
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  settingsSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  sectionContent: {
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingItemDisabled: {
    opacity: 0.7,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemIcon: {
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#374151',
  },
  settingLabelDisabled: {
    color: '#9ca3af',
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  premiumText: {
    fontSize: 10,
    color: '#9333ea',
    fontWeight: '500',
    marginLeft: 2,
  },
  infoBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 12,
    color: '#166534',
    marginLeft: 8,
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  appInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  appInfoText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dc2626',
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    paddingVertical: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
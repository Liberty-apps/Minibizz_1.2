import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { Settings, User, Building, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Save, LogOut, CreditCard as Edit3, Key, Smartphone, Globe, Mail, Crown, Calculator, FileText, Rocket, Ban as Bank, CreditCard } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { useSubscription } from '../../src/contexts/SubscriptionContext';
import UserLogo from '../../components/UserLogo';

export default function Parametres() {
  const { user, logout } = useAuth();
  const { getCurrentPlan } = useSubscription();
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
        { label: 'Informations d\'entreprise', action: 'business', onPress: () => setShowBusinessInfo(true) },
        { label: 'Coordonnées bancaires', action: 'banking', onPress: () => setShowBankingInfo(true) }
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
                
                return (
                  <TouchableOpacity 
                    key={itemIndex} 
                    style={styles.settingItem}
                    onPress={() => handleSettingPress(item.action, item.route, item.onPress, item.requiresAccess)}
                  >
                    <View style={styles.settingItemLeft}>
                      {ItemIcon && <ItemIcon size={18} color="#6b7280" style={styles.settingItemIcon} />}
                      <Text style={styles.settingLabel}>
                        {item.label}
                      </Text>
                    </View>
                    <View style={styles.settingAction}>
                      {item.toggle !== undefined ? (
                        <Switch
                          value={item.toggle}
                          onValueChange={item.onToggle}
                          trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                          thumbColor={item.toggle ? '#ffffff' : '#f3f4f6'}
                        />
                      ) : (
                        <ChevronRight size={20} color="#9ca3af" />
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
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Medium',
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
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
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
    fontFamily: 'Inter-Regular',
  },
  settingAction: {
    alignItems: 'center',
    justifyContent: 'center',
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
    fontFamily: 'Inter-Bold',
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  appInfoText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  appInfoCopyright: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-SemiBold',
  },
});
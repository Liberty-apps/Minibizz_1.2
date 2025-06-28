import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { Settings, User, Building, Bell, Shield, CircleHelp as HelpCircle, ChevronRight, Save, LogOut } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';

export default function Parametres() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const [userInfo, setUserInfo] = useState({
    nom: '',
    prenom: '',
    email: user?.email || '',
    telephone: '',
    siret: '',
    activite: 'service'
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  };

  const settingsSections = [
    {
      title: 'Profil',
      icon: User,
      items: [
        { label: 'Informations personnelles', action: 'profile' },
        { label: 'Informations d\'entreprise', action: 'business' },
        { label: 'Coordonnées bancaires', action: 'banking' }
      ]
    },
    {
      title: 'Application',
      icon: Settings,
      items: [
        { label: 'Notifications', action: 'notifications', toggle: notifications, onToggle: setNotifications },
        { label: 'Mode sombre', action: 'darkmode', toggle: darkMode, onToggle: setDarkMode },
        { label: 'Sauvegarde automatique', action: 'autosave', toggle: autoSave, onToggle: setAutoSave }
      ]
    },
    {
      title: 'Sécurité',
      icon: Shield,
      items: [
        { label: 'Changer le mot de passe', action: 'password' },
        { label: 'Authentification à deux facteurs', action: '2fa' },
        { label: 'Sessions actives', action: 'sessions' }
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Centre d\'aide', action: 'help' },
        { label: 'Contacter le support', action: 'contact' },
        { label: 'Signaler un problème', action: 'report' }
      ]
    }
  ];

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
          <Text style={styles.avatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || 'Utilisateur'}</Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <Text style={styles.profileStatus}>Auto-entrepreneur • Actif</Text>
        </View>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileText}>Modifier</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Building size={20} color="#2563eb" />
          <Text style={styles.quickActionText}>Infos entreprise</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Bell size={20} color="#16a34a" />
          <Text style={styles.quickActionText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
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
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity key={itemIndex} style={styles.settingItem}>
                  <Text style={styles.settingLabel}>{item.label}</Text>
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
              ))}
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
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
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
  profileStatus: {
    fontSize: 12,
    color: '#16a34a',
    marginTop: 4,
  },
  editProfileButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
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
  settingLabel: {
    fontSize: 16,
    color: '#374151',
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
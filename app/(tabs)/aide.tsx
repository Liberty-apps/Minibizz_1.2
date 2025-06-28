import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { router } from 'expo-router';
import { CircleHelp as HelpCircle, ChevronDown, ChevronRight, Mail, Phone, MessageCircle, Book, ExternalLink } from 'lucide-react-native';

export default function Aide() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqItems = [
    {
      id: '1',
      question: 'Comment créer mon premier devis ?',
      answer: 'Allez dans l\'onglet "Devis", appuyez sur le bouton "+" et remplissez les informations demandées. Vous pourrez ajouter vos prestations, définir les prix et envoyer le devis à votre client.',
      action: () => router.push('/(tabs)/devis')
    },
    {
      id: '2',
      question: 'Comment calculer mes charges sociales ?',
      answer: 'Utilisez l\'onglet "Calculs" pour simuler vos charges. Sélectionnez votre type d\'activité et saisissez votre chiffre d\'affaires pour obtenir une estimation de vos charges sociales et revenus nets.',
      action: () => router.push('/(tabs)/calculs')
    },
    {
      id: '3',
      question: 'Quels sont les seuils de chiffre d\'affaires ?',
      answer: 'Pour 2024, les seuils sont : 188 700€ pour la vente de marchandises, 77 700€ pour les prestations de services et activités libérales.'
    },
    {
      id: '4',
      question: 'Comment gérer mes clients ?',
      answer: 'Dans l\'onglet "Clients", vous pouvez ajouter, modifier et consulter les informations de vos clients. Ces données seront automatiquement utilisées lors de la création de devis et factures.',
      action: () => router.push('/(tabs)/clients')
    },
    {
      id: '5',
      question: 'Comment organiser mon planning ?',
      answer: 'L\'onglet "Planning" vous permet de planifier vos rendez-vous, suivre vos échéances et organiser votre emploi du temps professionnel.',
      action: () => router.push('/(tabs)/planning')
    },
    {
      id: '6',
      question: 'Comment créer un site vitrine ?',
      answer: 'Rendez-vous dans l\'onglet "Sites" pour créer votre mini-site professionnel. Choisissez un template, personnalisez-le et publiez-le en quelques clics.',
      action: () => router.push('/(tabs)/sites-vitrines')
    }
  ];

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleContactEmail = () => {
    Linking.openURL('mailto:support@minibizz.fr');
  };

  const handleContactPhone = () => {
    Linking.openURL('tel:+33123456789');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <HelpCircle size={32} color="#2563eb" />
        <Text style={styles.title}>Centre d'aide</Text>
        <Text style={styles.subtitle}>Trouvez rapidement les réponses à vos questions</Text>
      </View>

      {/* Quick Help Cards */}
      <View style={styles.quickHelpSection}>
        <Text style={styles.sectionTitle}>Aide rapide</Text>
        <View style={styles.quickHelpGrid}>
          <TouchableOpacity 
            style={styles.quickHelpCard}
            onPress={() => router.push('/(tabs)/devis')}
          >
            <Book size={24} color="#2563eb" />
            <Text style={styles.quickHelpTitle}>Guide de démarrage</Text>
            <Text style={styles.quickHelpText}>Premiers pas avec MiniBizz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickHelpCard}
            onPress={() => router.push('/(tabs)/parametres')}
          >
            <MessageCircle size={24} color="#16a34a" />
            <Text style={styles.quickHelpTitle}>Configuration</Text>
            <Text style={styles.quickHelpText}>Paramétrer votre profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        <View style={styles.faqContainer}>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(item.id)}
              >
                <Text style={styles.faqQuestionText}>{item.question}</Text>
                {expandedFAQ === item.id ? (
                  <ChevronDown size={20} color="#6b7280" />
                ) : (
                  <ChevronRight size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
              
              {expandedFAQ === item.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.answer}</Text>
                  {item.action && (
                    <TouchableOpacity 
                      style={styles.faqActionButton}
                      onPress={item.action}
                    >
                      <Text style={styles.faqActionText}>Aller à cette section</Text>
                      <ExternalLink size={14} color="#2563eb" />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Besoin d'aide supplémentaire ?</Text>
        <Text style={styles.contactDescription}>
          Notre équipe est là pour vous aider
        </Text>
        
        <View style={styles.contactOptions}>
          <TouchableOpacity style={styles.contactOption} onPress={handleContactEmail}>
            <View style={styles.contactIcon}>
              <Mail size={20} color="#2563eb" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Email</Text>
              <Text style={styles.contactText}>support@minibizz.fr</Text>
            </View>
            <ExternalLink size={16} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactOption} onPress={handleContactPhone}>
            <View style={styles.contactIcon}>
              <Phone size={20} color="#16a34a" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Téléphone</Text>
              <Text style={styles.contactText}>01 23 45 67 89</Text>
            </View>
            <ExternalLink size={16} color="#9ca3af" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactOption}
            onPress={() => router.push('/(tabs)/abonnement')}
          >
            <View style={styles.contactIcon}>
              <MessageCircle size={20} color="#eab308" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactTitle}>Chat en direct</Text>
              <Text style={styles.contactText}>Disponible 9h-18h</Text>
            </View>
            <ExternalLink size={16} color="#9ca3af" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tips Section */}
      <View style={styles.tipsSection}>
        <Text style={styles.sectionTitle}>Conseils utiles</Text>
        <TouchableOpacity 
          style={styles.tipCard}
          onPress={() => router.push('/(tabs)/parametres')}
        >
          <Text style={styles.tipTitle}>💡 Astuce du jour</Text>
          <Text style={styles.tipText}>
            Configurez d'abord vos informations dans "Paramètres" avant de créer vos premiers documents.
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.tipCard}
          onPress={() => router.push('/(tabs)/calculs')}
        >
          <Text style={styles.tipTitle}>📊 Bonne pratique</Text>
          <Text style={styles.tipText}>
            Utilisez le calculateur de charges pour estimer vos revenus nets et mieux planifier votre activité.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  quickHelpSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  quickHelpGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickHelpCard: {
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
  quickHelpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  quickHelpText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  faqSection: {
    padding: 16,
  },
  faqContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  faqActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  faqActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
    marginRight: 6,
  },
  contactSection: {
    padding: 16,
  },
  contactDescription: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  contactOptions: {
    gap: 12,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  contactText: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  tipsSection: {
    padding: 16,
    paddingBottom: 32,
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
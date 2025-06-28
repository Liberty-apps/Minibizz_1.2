import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { 
  Calculator, 
  Euro, 
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react-native';

export default function Calculs() {
  const [chiffreAffaires, setChiffreAffaires] = useState('');
  const [typeActivite, setTypeActivite] = useState<'vente' | 'service' | 'liberal'>('service');

  const tauxCharges = {
    vente: 0.123,      // 12.3%
    service: 0.211,    // 21.1%
    liberal: 0.22      // 22%
  };

  const ca = parseFloat(chiffreAffaires) || 0;
  const charges = ca * tauxCharges[typeActivite];
  const revenuNet = ca - charges;

  const activiteLabels = {
    vente: 'Vente de marchandises',
    service: 'Prestations de services',
    liberal: 'Activité libérale'
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calculs</Text>
        <Text style={styles.subtitle}>Simulateur de charges sociales</Text>
      </View>

      {/* Calculator Card */}
      <View style={styles.calculatorCard}>
        <View style={styles.cardHeader}>
          <Calculator size={24} color="#2563eb" />
          <Text style={styles.cardTitle}>Simulateur auto-entrepreneur</Text>
        </View>

        {/* Input CA */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Chiffre d'affaires mensuel (€)</Text>
          <TextInput
            style={styles.input}
            value={chiffreAffaires}
            onChangeText={setChiffreAffaires}
            placeholder="Ex: 3000"
            keyboardType="numeric"
          />
        </View>

        {/* Activity Type */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Type d'activité</Text>
          <View style={styles.activityButtons}>
            {Object.entries(activiteLabels).map(([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.activityButton,
                  typeActivite === key && styles.activeActivityButton
                ]}
                onPress={() => setTypeActivite(key as any)}
              >
                <Text style={[
                  styles.activityButtonText,
                  typeActivite === key && styles.activeActivityButtonText
                ]}>
                  {label}
                </Text>
                <Text style={[
                  styles.activityRate,
                  typeActivite === key && styles.activeActivityRate
                ]}>
                  {(tauxCharges[key as keyof typeof tauxCharges] * 100).toFixed(1)}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        {ca > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Résultats</Text>
            
            <View style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <Euro size={20} color="#16a34a" />
                <Text style={styles.resultLabel}>Chiffre d'affaires</Text>
              </View>
              <Text style={styles.resultValue}>{ca.toLocaleString('fr-FR')} €</Text>
            </View>

            <View style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <TrendingDown size={20} color="#dc2626" />
                <Text style={styles.resultLabel}>Charges sociales</Text>
              </View>
              <Text style={[styles.resultValue, { color: '#dc2626' }]}>
                -{charges.toLocaleString('fr-FR')} €
              </Text>
            </View>

            <View style={[styles.resultItem, styles.finalResult]}>
              <View style={styles.resultHeader}>
                <TrendingUp size={20} color="#2563eb" />
                <Text style={styles.resultLabel}>Revenu net estimé</Text>
              </View>
              <Text style={[styles.resultValue, { color: '#2563eb', fontSize: 24, fontWeight: 'bold' }]}>
                {revenuNet.toLocaleString('fr-FR')} €
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoHeader}>
          <Info size={20} color="#2563eb" />
          <Text style={styles.infoTitle}>Informations importantes</Text>
        </View>
        <View style={styles.infoContent}>
          <Text style={styles.infoText}>
            • Les taux de charges sociales varient selon le type d'activité
          </Text>
          <Text style={styles.infoText}>
            • Ces calculs sont indicatifs et peuvent varier selon votre situation
          </Text>
          <Text style={styles.infoText}>
            • Les seuils de chiffre d'affaires pour 2024 :
          </Text>
          <Text style={styles.infoText}>
            - Vente : 188 700 € / an
          </Text>
          <Text style={styles.infoText}>
            - Services : 77 700 € / an
          </Text>
          <Text style={styles.infoText}>
            - Libéral : 77 700 € / an
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{(tauxCharges[typeActivite] * 100).toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Taux de charges</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{ca > 0 ? ((revenuNet / ca) * 100).toFixed(1) : '0'}%</Text>
          <Text style={styles.statLabel}>Taux de marge</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{ca > 0 ? (revenuNet * 12).toLocaleString('fr-FR', { maximumFractionDigits: 0 }) : '0'}</Text>
          <Text style={styles.statLabel}>Revenu annuel</Text>
        </View>
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
  calculatorCard: {
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
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
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
    backgroundColor: '#ffffff',
  },
  activityButtons: {
    gap: 8,
  },
  activityButton: {
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
  activeActivityButton: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  activityButtonText: {
    fontSize: 14,
    color: '#374151',
  },
  activeActivityButtonText: {
    color: '#2563eb',
    fontWeight: '500',
  },
  activityRate: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeActivityRate: {
    color: '#2563eb',
  },
  resultsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  finalResult: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  resultValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoCard: {
    backgroundColor: '#eff6ff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginLeft: 8,
  },
  infoContent: {
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    margin: 16,
    gap: 12,
  },
  statCard: {
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
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});
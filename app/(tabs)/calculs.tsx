import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { 
  Calculator, 
  Euro, 
  TrendingUp,
  TrendingDown,
  Info,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react-native';

export default function Calculs() {
  const [chiffreAffaires, setChiffreAffaires] = useState('');
  const [typeActivite, setTypeActivite] = useState<'vente' | 'service' | 'liberal'>('service');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const tauxCharges = {
    vente: 0.123,      // 12.3%
    service: 0.211,    // 21.1%
    liberal: 0.22      // 22%
  };

  const seuilsCA = {
    vente: 188700,
    service: 77700,
    liberal: 77700
  };

  const ca = parseFloat(chiffreAffaires.replace(',', '.')) || 0;
  const charges = ca * tauxCharges[typeActivite];
  const revenuNet = ca - charges;
  const caAnnuel = ca * 12;
  const seuilAtteint = (caAnnuel / seuilsCA[typeActivite]) * 100;

  const activiteLabels = {
    vente: 'Vente de marchandises',
    service: 'Prestations de services',
    liberal: 'Activité libérale'
  };

  const handleSimulationAnnuelle = () => {
    if (ca === 0) {
      Alert.alert('Information', 'Veuillez saisir un chiffre d\'affaires pour voir la simulation annuelle');
      return;
    }
    setShowAdvanced(!showAdvanced);
  };

  const getSeuilColor = () => {
    if (seuilAtteint < 70) return '#16a34a';
    if (seuilAtteint < 90) return '#eab308';
    return '#dc2626';
  };

  const getSeuilIcon = () => {
    if (seuilAtteint < 70) return CheckCircle;
    if (seuilAtteint < 90) return AlertTriangle;
    return AlertTriangle;
  };

  const validateInput = (text: string) => {
    // Permettre seulement les chiffres, virgules et points
    const cleanText = text.replace(/[^0-9.,]/g, '');
    setChiffreAffaires(cleanText);
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
          <View style={styles.inputContainer}>
            <Euro size={20} color="#9ca3af" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={chiffreAffaires}
              onChangeText={validateInput}
              placeholder="Ex: 3000"
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helperText}>
            Saisissez votre chiffre d'affaires mensuel estimé
          </Text>
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
                <View style={styles.activityButtonContent}>
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
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        {ca > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>Résultats mensuels</Text>
            
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

            {/* Seuil Progress */}
            <View style={styles.seuilSection}>
              <View style={styles.seuilHeader}>
                {React.createElement(getSeuilIcon(), { size: 16, color: getSeuilColor() })}
                <Text style={styles.seuilTitle}>Seuil de chiffre d'affaires</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${Math.min(seuilAtteint, 100)}%`,
                      backgroundColor: getSeuilColor()
                    }
                  ]} 
                />
              </View>
              <Text style={styles.seuilText}>
                {caAnnuel.toLocaleString('fr-FR')} € / {seuilsCA[typeActivite].toLocaleString('fr-FR')} € 
                ({seuilAtteint.toFixed(1)}%)
              </Text>
              {seuilAtteint > 90 && (
                <Text style={styles.seuilWarning}>
                  ⚠️ Attention : Vous approchez du seuil limite !
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Advanced Simulation Button */}
      {ca > 0 && (
        <TouchableOpacity 
          style={styles.advancedButton}
          onPress={handleSimulationAnnuelle}
        >
          <BarChart3 size={20} color="#2563eb" />
          <Text style={styles.advancedButtonText}>
            {showAdvanced ? 'Masquer' : 'Voir'} la simulation annuelle
          </Text>
        </TouchableOpacity>
      )}

      {/* Advanced Results */}
      {showAdvanced && ca > 0 && (
        <View style={styles.advancedCard}>
          <View style={styles.cardHeader}>
            <PieChart size={24} color="#9333ea" />
            <Text style={styles.cardTitle}>Projection annuelle</Text>
          </View>

          <View style={styles.annualResults}>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>CA annuel projeté</Text>
              <Text style={styles.annualValue}>{caAnnuel.toLocaleString('fr-FR')} €</Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Charges annuelles</Text>
              <Text style={[styles.annualValue, { color: '#dc2626' }]}>
                {(charges * 12).toLocaleString('fr-FR')} €
              </Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Revenu net annuel</Text>
              <Text style={[styles.annualValue, { color: '#16a34a', fontSize: 20, fontWeight: 'bold' }]}>
                {(revenuNet * 12).toLocaleString('fr-FR')} €
              </Text>
            </View>
            <View style={styles.annualItem}>
              <Text style={styles.annualLabel}>Taux de marge net</Text>
              <Text style={styles.annualValue}>
                {ca > 0 ? ((revenuNet / ca) * 100).toFixed(1) : '0'}%
              </Text>
            </View>
          </View>
        </View>
      )}

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
          <Text style={styles.infoText}>
            • Au-delà de ces seuils, vous basculez vers le régime réel
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
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
  helperText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  activityButtons: {
    gap: 8,
  },
  activityButton: {
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
  activityButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  seuilSection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  seuilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  seuilTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  seuilText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  seuilWarning: {
    fontSize: 12,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  advancedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  advancedButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
    marginLeft: 8,
  },
  advancedCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  annualResults: {
    gap: 12,
  },
  annualItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  annualLabel: {
    fontSize: 16,
    color: '#374151',
  },
  annualValue: {
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
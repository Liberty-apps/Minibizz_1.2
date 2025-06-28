import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Save, Plus, Trash2, User, Calendar, Clock, FileText, CreditCard as Edit3, Euro } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { facturesService, clientsService, devisService } from '../../src/services/database';

export default function CreateFacture() {
  const { numero } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [devis, setDevis] = useState<any[]>([]);
  
  // Formulaire
  const [factureData, setFactureData] = useState({
    numero: numero as string || '',
    client_id: '',
    devis_id: '',
    date_emission: new Date().toISOString().split('T')[0],
    date_echeance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    objet: '',
    statut: 'brouillon',
    mode_paiement: 'virement'
  });
  
  // Lignes de facture
  const [lignes, setLignes] = useState<any[]>([
    {
      description: '',
      quantite: 1,
      prix_unitaire: 0,
      taux_tva: 0
    }
  ]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [clientsData, devisData] = await Promise.all([
        clientsService.getAll(user.id),
        devisService.getAll(user.id)
      ]);
      
      setClients(clientsData);
      setDevis(devisData.filter(d => d.statut === 'accepte'));
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données nécessaires');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLine = () => {
    setLignes([...lignes, {
      description: '',
      quantite: 1,
      prix_unitaire: 0,
      taux_tva: 0
    }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lignes.length === 1) {
      Alert.alert('Information', 'Vous devez conserver au moins une ligne');
      return;
    }
    
    const newLignes = [...lignes];
    newLignes.splice(index, 1);
    setLignes(newLignes);
  };

  const updateLigne = (index: number, field: string, value: any) => {
    const newLignes = [...lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    setLignes(newLignes);
  };

  const handleSelectDevis = async (devisId: string) => {
    try {
      const selectedDevis = devis.find(d => d.id === devisId);
      if (!selectedDevis) return;
      
      // Mettre à jour les informations de la facture
      setFactureData({
        ...factureData,
        devis_id: devisId,
        client_id: selectedDevis.client_id,
        objet: selectedDevis.objet || factureData.objet
      });
      
      // Récupérer les lignes du devis
      const devisLignes = await devisService.getLines(devisId);
      if (devisLignes && devisLignes.length > 0) {
        setLignes(devisLignes.map(ligne => ({
          description: ligne.description,
          quantite: ligne.quantite,
          prix_unitaire: ligne.prix_unitaire,
          taux_tva: ligne.taux_tva
        })));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des lignes du devis:', error);
      Alert.alert('Erreur', 'Impossible de récupérer les informations du devis');
    }
  };

  const calculateTotals = () => {
    let totalHT = 0;
    let totalTVA = 0;
    
    lignes.forEach(ligne => {
      const quantite = parseFloat(ligne.quantite.toString()) || 0;
      const prixUnitaire = parseFloat(ligne.prix_unitaire.toString()) || 0;
      const tauxTVA = parseFloat(ligne.taux_tva.toString()) || 0;
      
      const montantHT = quantite * prixUnitaire;
      const montantTVA = montantHT * (tauxTVA / 100);
      
      totalHT += montantHT;
      totalTVA += montantTVA;
    });
    
    const totalTTC = totalHT + totalTVA;
    
    return {
      totalHT: totalHT.toFixed(2),
      totalTVA: totalTVA.toFixed(2),
      totalTTC: totalTTC.toFixed(2)
    };
  };

  const validateForm = () => {
    if (!factureData.client_id) {
      return 'Veuillez sélectionner un client';
    }
    
    if (!factureData.numero) {
      return 'Le numéro de facture est obligatoire';
    }
    
    if (!factureData.date_emission) {
      return 'La date d\'émission est obligatoire';
    }
    
    // Vérifier que les lignes sont valides
    for (let i = 0; i < lignes.length; i++) {
      const ligne = lignes[i];
      if (!ligne.description.trim()) {
        return `La description de la ligne ${i + 1} est obligatoire`;
      }
      
      if (isNaN(parseFloat(ligne.prix_unitaire.toString())) || parseFloat(ligne.prix_unitaire.toString()) < 0) {
        return `Le prix unitaire de la ligne ${i + 1} doit être un nombre positif`;
      }
    }
    
    return null;
  };

  const handleSave = async () => {
    if (!user) return;
    
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Erreur', validationError);
      return;
    }
    
    try {
      setSaving(true);
      
      // Créer la facture
      const facture = await facturesService.create({
        user_id: user.id,
        client_id: factureData.client_id,
        devis_id: factureData.devis_id || null,
        numero: factureData.numero,
        date_emission: factureData.date_emission,
        date_echeance: factureData.date_echeance,
        objet: factureData.objet,
        statut: factureData.statut,
        mode_paiement: factureData.mode_paiement
      });
      
      // Ajouter les lignes
      for (const ligne of lignes) {
        await facturesService.addLine(facture.id, {
          description: ligne.description,
          quantite: parseFloat(ligne.quantite.toString()) || 1,
          prix_unitaire: parseFloat(ligne.prix_unitaire.toString()) || 0,
          taux_tva: parseFloat(ligne.taux_tva.toString()) || 0
        });
      }
      
      Alert.alert(
        'Succès',
        'Facture créée avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.replace(`/factures/${facture.id}`)
          }
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      Alert.alert('Erreur', 'Impossible de créer la facture');
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle facture</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Informations générales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations générales</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Client *</Text>
            <View style={styles.selectContainer}>
              {clients.map(client => (
                <TouchableOpacity
                  key={client.id}
                  style={[
                    styles.clientOption,
                    factureData.client_id === client.id && styles.clientOptionSelected
                  ]}
                  onPress={() => setFactureData({...factureData, client_id: client.id})}
                >
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>
                      {client.prenom ? client.prenom.charAt(0) : ''}
                      {client.nom ? client.nom.charAt(0) : ''}
                    </Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>
                      {client.type_client === 'entreprise' 
                        ? client.entreprise 
                        : `${client.prenom || ''} ${client.nom || ''}`.trim()}
                    </Text>
                    {client.email && (
                      <Text style={styles.clientEmail}>{client.email}</Text>
                    )}
                  </View>
                  {factureData.client_id === client.id && (
                    <View style={styles.clientSelected}>
                      <Text style={styles.clientSelectedText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                style={styles.addClientButton}
                onPress={() => router.push('/clients/create?returnTo=factures/create')}
              >
                <Plus size={20} color="#2563eb" />
                <Text style={styles.addClientText}>Ajouter un client</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {devis.length > 0 && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Basé sur un devis (optionnel)</Text>
              <View style={styles.selectContainer}>
                {devis.map(d => (
                  <TouchableOpacity
                    key={d.id}
                    style={[
                      styles.devisOption,
                      factureData.devis_id === d.id && styles.devisOptionSelected
                    ]}
                    onPress={() => handleSelectDevis(d.id)}
                  >
                    <FileText size={20} color="#6b7280" />
                    <View style={styles.devisInfo}>
                      <Text style={styles.devisNumber}>{d.numero}</Text>
                      <Text style={styles.devisClient}>
                        {d.client?.nom || 'Client non défini'}
                      </Text>
                    </View>
                    <Text style={styles.devisAmount}>
                      {d.montant_ttc?.toLocaleString('fr-FR')}€
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Numéro *</Text>
              <TextInput
                style={styles.input}
                value={factureData.numero}
                onChangeText={(text) => setFactureData({...factureData, numero: text})}
                placeholder="FAC-2024-001"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Date d'émission *</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.dateText}>
                  {new Date(factureData.date_emission).toLocaleDateString('fr-FR')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Date d'échéance</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.dateText}>
                  {new Date(factureData.date_echeance).toLocaleDateString('fr-FR')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Mode de paiement</Text>
              <View style={styles.paymentContainer}>
                <TouchableOpacity 
                  style={[
                    styles.paymentOption,
                    factureData.mode_paiement === 'virement' && styles.paymentOptionSelected
                  ]}
                  onPress={() => setFactureData({...factureData, mode_paiement: 'virement'})}
                >
                  <Text style={[
                    styles.paymentText,
                    factureData.mode_paiement === 'virement' && styles.paymentTextSelected
                  ]}>
                    Virement
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.paymentOption,
                    factureData.mode_paiement === 'cb' && styles.paymentOptionSelected
                  ]}
                  onPress={() => setFactureData({...factureData, mode_paiement: 'cb'})}
                >
                  <Text style={[
                    styles.paymentText,
                    factureData.mode_paiement === 'cb' && styles.paymentTextSelected
                  ]}>
                    CB
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Objet</Text>
            <TextInput
              style={styles.input}
              value={factureData.objet}
              onChangeText={(text) => setFactureData({...factureData, objet: text})}
              placeholder="Objet de la facture"
            />
          </View>
        </View>

        {/* Lignes de facture */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prestations</Text>
          
          {lignes.map((ligne, index) => (
            <View key={index} style={styles.lineItem}>
              <View style={styles.lineHeader}>
                <Text style={styles.lineTitle}>Prestation {index + 1}</Text>
                <TouchableOpacity 
                  style={styles.removeLineButton}
                  onPress={() => handleRemoveLine(index)}
                >
                  <Trash2 size={16} color="#dc2626" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={styles.input}
                  value={ligne.description}
                  onChangeText={(text) => updateLigne(index, 'description', text)}
                  placeholder="Description de la prestation"
                />
              </View>
              
              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Quantité</Text>
                  <TextInput
                    style={styles.input}
                    value={ligne.quantite.toString()}
                    onChangeText={(text) => updateLigne(index, 'quantite', text)}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                
                <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                  <Text style={styles.label}>Prix unitaire (€) *</Text>
                  <TextInput
                    style={styles.input}
                    value={ligne.prix_unitaire.toString()}
                    onChangeText={(text) => updateLigne(index, 'prix_unitaire', text)}
                    keyboardType="numeric"
                    placeholder="0.00"
                  />
                </View>
              </View>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Taux TVA (%)</Text>
                <TextInput
                  style={styles.input}
                  value={ligne.taux_tva.toString()}
                  onChangeText={(text) => updateLigne(index, 'taux_tva', text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              </View>
              
              <View style={styles.lineTotal}>
                <Text style={styles.lineTotalLabel}>Total HT:</Text>
                <Text style={styles.lineTotalValue}>
                  {((parseFloat(ligne.quantite) || 0) * (parseFloat(ligne.prix_unitaire) || 0)).toFixed(2)}€
                </Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={styles.addLineButton}
            onPress={handleAddLine}
          >
            <Plus size={20} color="#2563eb" />
            <Text style={styles.addLineText}>Ajouter une prestation</Text>
          </TouchableOpacity>
        </View>

        {/* Totaux */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total HT</Text>
            <Text style={styles.totalValue}>{totals.totalHT}€</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total TVA</Text>
            <Text style={styles.totalValue}>{totals.totalTVA}€</Text>
          </View>
          
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalLabelFinal}>Total TTC</Text>
            <Text style={styles.totalValueFinal}>{totals.totalTTC}€</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Save size={20} color="#ffffff" />
          <Text style={styles.footerButtonText}>
            {saving ? 'Enregistrement...' : 'Enregistrer la facture'}
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  selectContainer: {
    gap: 8,
  },
  clientOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  clientOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  clientAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  clientEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  clientSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientSelectedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addClientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#eff6ff',
  },
  addClientText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
    marginLeft: 8,
  },
  devisOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#ffffff',
  },
  devisOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  devisInfo: {
    flex: 1,
    marginLeft: 12,
  },
  devisNumber: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  devisClient: {
    fontSize: 14,
    color: '#6b7280',
  },
  devisAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  dateText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  paymentContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  paymentOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  paymentText: {
    fontSize: 14,
    color: '#6b7280',
  },
  paymentTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
  },
  lineItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  lineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  removeLineButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineTotal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  lineTotalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginRight: 8,
  },
  lineTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  addLineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#eff6ff',
  },
  addLineText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2563eb',
    marginLeft: 8,
  },
  totalsSection: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  totalRowFinal: {
    borderBottomWidth: 0,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  totalLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  totalLabelFinal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  totalValueFinal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Save, Plus, Trash2, User, Calendar, Clock, FileText, CreditCard as Edit3 } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { devisService, clientsService } from '../../src/services/database';
import { supabase } from '../../src/lib/supabase';

export default function CreateDevis() {
  const { numero } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  
  // Formulaire
  const [devisData, setDevisData] = useState({
    numero: numero as string || '',
    client_id: '',
    date_emission: new Date().toISOString().split('T')[0],
    date_validite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    objet: '',
    conditions_particulieres: '',
    statut: 'brouillon'
  });
  
  // Lignes de devis
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
      loadClients();
      generateDevisNumero();
    }
  }, [user]);

  const loadClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const clientsData = await clientsService.getAll(user.id);
      setClients(clientsData);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      Alert.alert('Erreur', 'Impossible de charger la liste des clients');
    } finally {
      setLoading(false);
    }
  };

  const generateDevisNumero = async () => {
    if (!user) return;
    
    try {
      if (!devisData.numero) {
        const newNumero = await devisService.generateNumero(user.id);
        setDevisData(prev => ({ ...prev, numero: newNumero }));
      }
    } catch (error) {
      console.error('Erreur lors de la génération du numéro de devis:', error);
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
    if (!devisData.client_id) {
      return 'Veuillez sélectionner un client';
    }
    
    if (!devisData.numero) {
      return 'Le numéro de devis est obligatoire';
    }
    
    if (!devisData.date_emission) {
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
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un devis');
      return;
    }
    
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Erreur', validationError);
      return;
    }
    
    try {
      setSaving(true);
      
      // Créer le devis
      const { data: devis, error } = await supabase
        .from('devis')
        .insert({
          user_id: user.id,
          client_id: devisData.client_id,
          numero: devisData.numero,
          date_emission: devisData.date_emission,
          date_validite: devisData.date_validite,
          objet: devisData.objet,
          conditions_particulieres: devisData.conditions_particulieres,
          statut: devisData.statut
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Ajouter les lignes
      for (const ligne of lignes) {
        const { error: ligneError } = await supabase
          .from('devis_lignes')
          .insert({
            devis_id: devis.id,
            description: ligne.description,
            quantite: parseFloat(ligne.quantite.toString()) || 1,
            prix_unitaire: parseFloat(ligne.prix_unitaire.toString()) || 0,
            taux_tva: parseFloat(ligne.taux_tva.toString()) || 0
          });
        
        if (ligneError) throw ligneError;
      }
      
      Alert.alert(
        'Succès',
        'Devis créé avec succès',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/devis')
          }
        ]
      );
    } catch (error: any) {
      console.error('Erreur lors de la création du devis:', error);
      Alert.alert('Erreur', 'Impossible de créer le devis: ' + error.message);
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
        <Text style={styles.headerTitle}>Nouveau devis</Text>
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
              {clients.length === 0 ? (
                <Text style={styles.noClientsText}>Aucun client disponible. Veuillez d'abord créer un client.</Text>
              ) : (
                clients.map(client => (
                  <TouchableOpacity
                    key={client.id}
                    style={[
                      styles.clientOption,
                      devisData.client_id === client.id && styles.clientOptionSelected
                    ]}
                    onPress={() => setDevisData({...devisData, client_id: client.id})}
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
                    {devisData.client_id === client.id && (
                      <View style={styles.clientSelected}>
                        <Text style={styles.clientSelectedText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))
              )}
              
              <TouchableOpacity 
                style={styles.addClientButton}
                onPress={() => router.push('/clients/create?returnTo=devis/create')}
              >
                <Plus size={20} color="#2563eb" />
                <Text style={styles.addClientText}>Ajouter un client</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Numéro *</Text>
              <TextInput
                style={styles.input}
                value={devisData.numero}
                onChangeText={(text) => setDevisData({...devisData, numero: text})}
                placeholder="DEV-2024-001"
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Date d'émission *</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Calendar size={16} color="#6b7280" />
                <Text style={styles.dateText}>
                  {new Date(devisData.date_emission).toLocaleDateString('fr-FR')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Date de validité</Text>
              <TouchableOpacity style={styles.dateInput}>
                <Clock size={16} color="#6b7280" />
                <Text style={styles.dateText}>
                  {new Date(devisData.date_validite).toLocaleDateString('fr-FR')}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Statut</Text>
              <View style={styles.statusContainer}>
                <TouchableOpacity 
                  style={[
                    styles.statusOption,
                    devisData.statut === 'brouillon' && styles.statusOptionSelected
                  ]}
                  onPress={() => setDevisData({...devisData, statut: 'brouillon'})}
                >
                  <Text style={[
                    styles.statusText,
                    devisData.statut === 'brouillon' && styles.statusTextSelected
                  ]}>
                    Brouillon
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statusOption,
                    devisData.statut === 'envoye' && styles.statusOptionSelected
                  ]}
                  onPress={() => setDevisData({...devisData, statut: 'envoye'})}
                >
                  <Text style={[
                    styles.statusText,
                    devisData.statut === 'envoye' && styles.statusTextSelected
                  ]}>
                    Envoyé
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Objet</Text>
            <TextInput
              style={styles.input}
              value={devisData.objet}
              onChangeText={(text) => setDevisData({...devisData, objet: text})}
              placeholder="Objet du devis"
            />
          </View>
        </View>

        {/* Lignes de devis */}
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

        {/* Conditions particulières */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions particulières</Text>
          
          <View style={styles.formGroup}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={devisData.conditions_particulieres}
              onChangeText={(text) => setDevisData({...devisData, conditions_particulieres: text})}
              placeholder="Conditions particulières, modalités de paiement, etc."
              multiline
              numberOfLines={4}
            />
          </View>
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
            {saving ? 'Enregistrement...' : 'Enregistrer le devis'}
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  selectContainer: {
    gap: 8,
  },
  noClientsText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 12,
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
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  statusOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusTextSelected: {
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
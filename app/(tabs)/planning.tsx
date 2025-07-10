import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Calendar, Plus, Clock, User, MapPin, ChevronLeft, ChevronRight, Filter, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Circle as XCircle, Phone, Video, Users as UsersIcon } from 'lucide-react-native';
import { useAuth } from '../../src/contexts/AuthContext';
import { planningService } from '../../src/services/database';
import { supabase } from '../../src/lib/supabase';

export default function Planning() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week' | 'month'>('today');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titre: '',
    description: '',
    date_debut: new Date().toISOString(),
    date_fin: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
    lieu: '',
    type_evenement: 'rdv',
    statut: 'planifie'
  });

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    // Simuler le chargement des événements pour le mode démo
    setLoading(true);
    
    // Données de démo
    const demoEvents = [
      {
        id: '1',
        titre: 'Rendez-vous client',
        description: 'Présentation du devis pour le site web',
        date_debut: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        date_fin: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        lieu: 'Bureau client - Paris',
        type_evenement: 'rdv',
        statut: 'planifie'
      },
      {
        id: '2',
        titre: 'Livraison projet',
        description: 'Finalisation et livraison du projet TechSolutions',
        date_debut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        date_fin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
        lieu: 'En ligne',
        type_evenement: 'prestation',
        statut: 'confirme'
      }
    ];
    
    setTimeout(() => {
      setEvents(demoEvents);
      setError(null);
      setLoading(false);
    }, 1000);
    
    // En mode production, on utiliserait:
    // if (!user) return;
    // try {
    //   setLoading(true);
    //   setError(null);
    //   const data = await planningService.getAll(user.id);
    //   setEvents(data);
    // } catch (error) {
    //   console.error('Erreur lors du chargement du planning:', error);
    //   setError('Impossible de charger le planning');
    // } finally {
    //   setLoading(false);
    // }
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (selectedFilter) {
      case 'today':
        return events.filter(event => {
          const eventDate = new Date(event.date_debut);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return events.filter(event => {
          const eventDate = new Date(event.date_debut);
          return eventDate >= weekStart && eventDate <= weekEnd;
        });
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        return events.filter(event => {
          const eventDate = new Date(event.date_debut);
          return eventDate >= monthStart && eventDate <= monthEnd;
        });
      default:
        return events;
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'confirme':
      case 'termine':
        return CheckCircle;
      case 'reporte':
        return AlertCircle;
      case 'annule':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'confirme':
        return '#16a34a';
      case 'termine':
        return '#059669';
      case 'reporte':
        return '#eab308';
      case 'annule':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rdv':
        return User;
      case 'prestation':
        return UsersIcon;
      case 'relance':
        return Phone;
      case 'autre':
        return Video;
      default:
        return Calendar;
    }
  };

  const handleAddEvent = () => {
    setShowAddEvent(true);
  };

  const handleSaveEvent = async () => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un événement');
      return;
    }
    
    if (!newEvent.titre.trim()) {
      Alert.alert('Erreur', 'Le titre est obligatoire');
      return;
    }
    
    try {
      setLoading(true);
      
      // Créer l'événement
      const { data, error } = await supabase
        .from('planning')
        .insert({
          user_id: user.id,
          titre: newEvent.titre,
          description: newEvent.description,
          date_debut: newEvent.date_debut,
          date_fin: newEvent.date_fin,
          lieu: newEvent.lieu,
          type_evenement: newEvent.type_evenement,
          statut: newEvent.statut
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Réinitialiser le formulaire
      setNewEvent({
        titre: '',
        description: '',
        date_debut: new Date().toISOString(),
        date_fin: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        lieu: '',
        type_evenement: 'rdv',
        statut: 'planifie'
      });
      
      // Fermer le modal
      setShowAddEvent(false);
      
      // Recharger les événements
      loadEvents();
      
      Alert.alert('Succès', 'Événement créé avec succès');
    } catch (error: any) {
      console.error('Erreur lors de la création de l\'événement:', error);
      Alert.alert('Erreur', 'Impossible de créer l\'événement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventPress = (eventId: string) => {
    router.push(`/planning/${eventId}`);
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/planning/${eventId}/edit`);
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer l'événement "${eventTitle}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await planningService.delete(eventId);
              Alert.alert('Succès', 'Événement supprimé avec succès');
              loadEvents();
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'événement');
            }
          }
        }
      ]
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const filteredEvents = getFilteredEvents();

  if (loading && !showAddEvent) {
    return (
      <View style={styles.loadingContainer}>
        <Calendar size={48} color="#2563eb" />
        <Text style={styles.loadingText}>Chargement du planning...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Planning</Text>
          <Text style={styles.subtitle}>
            Organisez votre emploi du temps
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
          <Plus size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <AlertCircle size={20} color="#dc2626" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadEvents}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Calendar Navigation */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <ChevronLeft size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{currentMonth}</Text>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <ChevronRight size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Week Days */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'today' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('today')}
        >
          <Text style={[styles.filterText, selectedFilter === 'today' && styles.activeFilterText]}>
            Aujourd'hui
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'week' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('week')}
        >
          <Text style={[styles.filterText, selectedFilter === 'week' && styles.activeFilterText]}>
            Semaine
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'month' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('month')}
        >
          <Text style={[styles.filterText, selectedFilter === 'month' && styles.activeFilterText]}>
            Mois
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.filterTab, selectedFilter === 'all' && styles.activeFilterTab]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            Tout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Event Modal */}
      {showAddEvent && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvel événement</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Titre *</Text>
              <TextInput
                style={styles.input}
                value={newEvent.titre}
                onChangeText={(text) => setNewEvent({...newEvent, titre: text})}
                placeholder="Titre de l'événement"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newEvent.description}
                onChangeText={(text) => setNewEvent({...newEvent, description: text})}
                placeholder="Description de l'événement"
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity style={styles.dateInput}>
                  <Calendar size={16} color="#6b7280" />
                  <Text style={styles.dateText}>
                    {new Date(newEvent.date_debut).toLocaleDateString('fr-FR')}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={[styles.formGroup, { flex: 1, marginLeft: 12 }]}>
                <Text style={styles.label}>Heure</Text>
                <TouchableOpacity style={styles.dateInput}>
                  <Clock size={16} color="#6b7280" />
                  <Text style={styles.dateText}>
                    {new Date(newEvent.date_debut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Lieu</Text>
              <TextInput
                style={styles.input}
                value={newEvent.lieu}
                onChangeText={(text) => setNewEvent({...newEvent, lieu: text})}
                placeholder="Lieu de l'événement"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Type d'événement</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity 
                  style={[
                    styles.typeOption,
                    newEvent.type_evenement === 'rdv' && styles.typeOptionSelected
                  ]}
                  onPress={() => setNewEvent({...newEvent, type_evenement: 'rdv'})}
                >
                  <Text style={[
                    styles.typeText,
                    newEvent.type_evenement === 'rdv' && styles.typeTextSelected
                  ]}>
                    Rendez-vous
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.typeOption,
                    newEvent.type_evenement === 'prestation' && styles.typeOptionSelected
                  ]}
                  onPress={() => setNewEvent({...newEvent, type_evenement: 'prestation'})}
                >
                  <Text style={[
                    styles.typeText,
                    newEvent.type_evenement === 'prestation' && styles.typeTextSelected
                  ]}>
                    Prestation
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddEvent(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveEvent}
              >
                <Text style={styles.saveText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Events List */}
      <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#d1d5db" />
            <Text style={styles.emptyTitle}>Aucun événement</Text>
            <Text style={styles.emptyText}>
              {selectedFilter === 'today' 
                ? 'Aucun événement prévu aujourd\'hui'
                : selectedFilter === 'week'
                ? 'Aucun événement cette semaine'
                : selectedFilter === 'month'
                ? 'Aucun événement ce mois-ci'
                : 'Votre planning est vide'
              }
            </Text>
            <TouchableOpacity style={styles.createFirstButton} onPress={handleAddEvent}>
              <Text style={styles.createFirstText}>Planifier un événement</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const StatutIcon = getStatutIcon(event.statut);
            const TypeIcon = getTypeIcon(event.type_evenement);
            const statutColor = getStatutColor(event.statut);
            const eventDate = new Date(event.date_debut);
            const eventTime = eventDate.toLocaleTimeString('fr-FR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            });
            const eventEndTime = event.date_fin ? 
              new Date(event.date_fin).toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              }) : null;
            
            return (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
              >
                <View style={[styles.eventIndicator, { backgroundColor: statutColor }]} />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <View style={styles.eventTitleRow}>
                      <TypeIcon size={16} color="#6b7280" />
                      <Text style={styles.eventTitle}>{event.titre}</Text>
                    </View>
                    <View style={styles.eventStatus}>
                      <StatutIcon size={16} color={statutColor} />
                      <Text style={[styles.eventTime, { color: statutColor }]}>
                        {eventTime}{eventEndTime ? ` - ${eventEndTime}` : ''}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <Calendar size={14} color="#6b7280" />
                      <Text style={styles.eventDetailText}>
                        {eventDate.toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    
                    {event.client && (
                      <View style={styles.eventDetail}>
                        <User size={14} color="#6b7280" />
                        <Text style={styles.eventDetailText}>{event.client.nom}</Text>
                      </View>
                    )}
                    
                    {event.lieu && (
                      <View style={styles.eventDetail}>
                        <MapPin size={14} color="#6b7280" />
                        <Text style={styles.eventDetailText}>{event.lieu}</Text>
                      </View>
                    )}
                    
                    {event.description && (
                      <Text style={styles.eventDescription}>{event.description}</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Calendar size={20} color="#2563eb" />
          <Text style={styles.statNumber}>
            {events.filter(e => {
              const today = new Date();
              const eventDate = new Date(e.date_debut);
              return eventDate.toDateString() === today.toDateString();
            }).length}
          </Text>
          <Text style={styles.statLabel}>Aujourd'hui</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={20} color="#16a34a" />
          <Text style={styles.statNumber}>
            {events.filter(e => e.statut === 'confirme').length}
          </Text>
          <Text style={styles.statLabel}>Confirmés</Text>
        </View>
        <View style={styles.statItem}>
          <CheckCircle size={20} color="#059669" />
          <Text style={styles.statNumber}>
            {events.filter(e => e.statut === 'termine').length}
          </Text>
          <Text style={styles.statLabel}>Terminés</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  addButton: {
    backgroundColor: '#2563eb',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#dc2626',
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textTransform: 'capitalize',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeFilterTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeFilterText: {
    color: '#111827',
  },
  eventsContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  createFirstButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createFirstText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  eventCard: {
    flexDirection: 'row',
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
  eventIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventDetails: {
    gap: 4,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventDetailText: {
    fontSize: 14,
    color: '#6b7280',
  },
  eventDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
  typeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  typeOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  typeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  typeTextSelected: {
    color: '#2563eb',
    fontWeight: '500',
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
});
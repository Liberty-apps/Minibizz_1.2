import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { 
  Calendar, 
  Plus, 
  Clock,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react-native';

export default function Planning() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'week'>('today');

  const events = [
    {
      id: '1',
      title: 'RDV Client ABC',
      time: '09:00 - 10:30',
      client: 'Entreprise ABC',
      location: 'Bureau client',
      type: 'meeting',
      statut: 'confirme',
      color: '#2563eb',
      date: new Date()
    },
    {
      id: '2',
      title: 'Présentation projet',
      time: '14:00 - 15:00',
      client: 'Marie Dupont',
      location: 'Visioconférence',
      type: 'presentation',
      statut: 'planifie',
      color: '#16a34a',
      date: new Date()
    },
    {
      id: '3',
      title: 'Suivi projet',
      time: '16:30 - 17:30',
      client: 'Tech Solutions',
      location: 'Téléphone',
      type: 'call',
      statut: 'reporte',
      color: '#eab308',
      date: new Date(Date.now() + 86400000) // Demain
    },
    {
      id: '4',
      title: 'Formation client',
      time: '10:00 - 12:00',
      client: 'Jean Martin',
      location: 'Sur site',
      type: 'formation',
      statut: 'termine',
      color: '#9333ea',
      date: new Date(Date.now() - 86400000) // Hier
    }
  ];

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const getFilteredEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (selectedFilter) {
      case 'today':
        return events.filter(event => {
          const eventDate = new Date(event.date);
          eventDate.setHours(0, 0, 0, 0);
          return eventDate.getTime() === today.getTime();
        });
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay() + 1);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= weekStart && eventDate <= weekEnd;
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

  const handleAddEvent = () => {
    console.log('Ajouter un événement');
  };

  const handleEventPress = (eventId: string) => {
    console.log('Voir événement:', eventId);
  };

  const filteredEvents = getFilteredEvents();

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

      {/* Calendar Navigation */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.navButton}>
          <ChevronLeft size={20} color="#6b7280" />
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{currentMonth}</Text>
        <TouchableOpacity style={styles.navButton}>
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
            Cette semaine
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
                : 'Votre planning est vide'
              }
            </Text>
          </View>
        ) : (
          filteredEvents.map((event) => {
            const StatutIcon = getStatutIcon(event.statut);
            const statutColor = getStatutColor(event.statut);
            
            return (
              <TouchableOpacity 
                key={event.id} 
                style={styles.eventCard}
                onPress={() => handleEventPress(event.id)}
              >
                <View style={[styles.eventIndicator, { backgroundColor: event.color }]} />
                <View style={styles.eventContent}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <View style={styles.eventStatus}>
                      <StatutIcon size={16} color={statutColor} />
                      <Text style={[styles.eventTime, { color: statutColor }]}>
                        {event.time}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.eventDetails}>
                    <View style={styles.eventDetail}>
                      <User size={14} color="#6b7280" />
                      <Text style={styles.eventDetailText}>{event.client}</Text>
                    </View>
                    <View style={styles.eventDetail}>
                      <MapPin size={14} color="#6b7280" />
                      <Text style={styles.eventDetailText}>{event.location}</Text>
                    </View>
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
              const eventDate = new Date(e.date);
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
    alignItems: 'center',
    marginBottom: 8,
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
});
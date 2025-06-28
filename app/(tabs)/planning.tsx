import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Calendar, 
  Plus, 
  Clock,
  User,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react-native';

export default function Planning() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    {
      id: '1',
      title: 'RDV Client ABC',
      time: '09:00 - 10:30',
      client: 'Entreprise ABC',
      location: 'Bureau client',
      type: 'meeting',
      color: '#2563eb'
    },
    {
      id: '2',
      title: 'Présentation projet',
      time: '14:00 - 15:00',
      client: 'Marie Dupont',
      location: 'Visioconférence',
      type: 'presentation',
      color: '#16a34a'
    },
    {
      id: '3',
      title: 'Suivi projet',
      time: '16:30 - 17:30',
      client: 'Tech Solutions',
      location: 'Téléphone',
      type: 'call',
      color: '#eab308'
    }
  ];

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const currentMonth = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Planning</Text>
        <TouchableOpacity style={styles.addButton}>
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

      {/* Today's Events */}
      <View style={styles.todaySection}>
        <View style={styles.todayHeader}>
          <Text style={styles.todayTitle}>Aujourd'hui</Text>
          <Text style={styles.todayDate}>
            {new Date().toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long' 
            })}
          </Text>
        </View>

        <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
          {events.map((event) => (
            <TouchableOpacity key={event.id} style={styles.eventCard}>
              <View style={[styles.eventIndicator, { backgroundColor: event.color }]} />
              <View style={styles.eventContent}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventTime}>{event.time}</Text>
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
          ))}
        </ScrollView>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Calendar size={20} color="#2563eb" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Aujourd'hui</Text>
        </View>
        <View style={styles.statItem}>
          <Clock size={20} color="#16a34a" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Cette semaine</Text>
        </View>
        <View style={styles.statItem}>
          <User size={20} color="#eab308" />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Ce mois</Text>
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
  todaySection: {
    flex: 1,
    padding: 16,
  },
  todayHeader: {
    marginBottom: 16,
  },
  todayTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  todayDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  eventsContainer: {
    flex: 1,
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
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563eb',
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
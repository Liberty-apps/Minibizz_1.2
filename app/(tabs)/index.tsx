import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Bell, ChevronRight, TrendingUp, Calendar, Users, FileText } from 'lucide-react-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.username}>Alex</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#0f172a" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={20} color="#3b82f6" />
            </View>
            <Text style={styles.statValue}>$2,458</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dbeafe' }]}>
              <Users size={20} color="#2563eb" />
            </View>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#dcfce7' }]}>
              <FileText size={20} color="#16a34a" />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Projects</Text>
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>15</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Client Meeting</Text>
              <Text style={styles.eventDescription}>Project discussion with ABC Corp</Text>
              <View style={styles.eventTimeContainer}>
                <Calendar size={14} color="#64748b" />
                <Text style={styles.eventTime}>10:00 AM - 11:30 AM</Text>
              </View>
            </View>
          </View>

          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>JUN</Text>
              <Text style={styles.eventDay}>18</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Project Deadline</Text>
              <Text style={styles.eventDescription}>Website redesign final delivery</Text>
              <View style={styles.eventTimeContainer}>
                <Calendar size={14} color="#64748b" />
                <Text style={styles.eventTime}>11:59 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Projects */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Projects</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>See All</Text>
              <ChevronRight size={16} color="#3b82f6" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.projectsScrollView}
          >
            <View style={styles.projectCard}>
              <Image 
                source={{ uri: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600" }} 
                style={styles.projectImage} 
              />
              <View style={styles.projectContent}>
                <Text style={styles.projectTitle}>Mobile App Design</Text>
                <View style={styles.projectProgress}>
                  <View style={[styles.progressBar, { width: '75%' }]} />
                </View>
                <Text style={styles.projectStatus}>75% Complete</Text>
              </View>
            </View>

            <View style={styles.projectCard}>
              <Image 
                source={{ uri: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600" }} 
                style={styles.projectImage} 
              />
              <View style={styles.projectContent}>
                <Text style={styles.projectTitle}>Website Redesign</Text>
                <View style={styles.projectProgress}>
                  <View style={[styles.progressBar, { width: '40%' }]} />
                </View>
                <Text style={styles.projectStatus}>40% Complete</Text>
              </View>
            </View>

            <View style={styles.projectCard}>
              <Image 
                source={{ uri: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600" }} 
                style={styles.projectImage} 
              />
              <View style={styles.projectContent}>
                <Text style={styles.projectTitle}>Brand Identity</Text>
                <View style={styles.projectProgress}>
                  <View style={[styles.progressBar, { width: '90%' }]} />
                </View>
                <Text style={styles.projectStatus}>90% Complete</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#dbeafe' }]}>
                <FileText size={20} color="#2563eb" />
              </View>
              <Text style={styles.actionText}>New Project</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#dcfce7' }]}>
                <Users size={20} color="#16a34a" />
              </View>
              <Text style={styles.actionText}>Add Client</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Calendar size={20} color="#d97706" />
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Inter-Bold',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  eventDateContainer: {
    width: 50,
    height: 60,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventMonth: {
    fontSize: 12,
    color: '#3b82f6',
    fontFamily: 'Inter-Medium',
  },
  eventDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    fontFamily: 'Inter-Bold',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  eventTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTime: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
    marginLeft: 6,
  },
  projectsScrollView: {
    marginBottom: 8,
  },
  projectCard: {
    width: 200,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  projectImage: {
    width: '100%',
    height: 120,
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  projectProgress: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  projectStatus: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Inter-Regular',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#0f172a',
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});
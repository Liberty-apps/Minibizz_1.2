import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import { Home, FileText, Calendar, Users, Settings, Plus } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabLayout() {
  const activeIndex = useSharedValue(0);
  const windowWidth = Dimensions.get('window').width;
  const tabWidth = windowWidth / 5; // 5 tabs

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(activeIndex.value * tabWidth) }],
    };
  });

  const handleTabPress = (index) => {
    activeIndex.value = index;
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#64748b',
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarShowLabel: true,
        tabBarBackground: () => (
          <View style={styles.tabBarBackground}>
            <AnimatedView style={[styles.activeIndicator, indicatorStyle]} />
          </View>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Home size={size} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(0),
        }}
      />
      <Tabs.Screen
        name="clients"
        options={{
          title: 'Clients',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Users size={size} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(1),
        }}
      />
      <Tabs.Screen
        name="devis"
        options={{
          title: 'Devis',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <FileText size={size} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(2),
        }}
      />
      <Tabs.Screen
        name="planning"
        options={{
          title: 'Planning',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Calendar size={size} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(3),
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.iconContainer}>
              <Settings size={size} color={color} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
        listeners={{
          tabPress: () => handleTabPress(4),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#e2e8f0',
    height: 70,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    position: 'relative',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: Dimensions.get('window').width / 5,
    height: 3,
    backgroundColor: '#3b82f6',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
  tabBarItem: {
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  activeDot: {
    position: 'absolute',
    bottom: -12,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
  },
  fabContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 25,
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 999,
  },
});
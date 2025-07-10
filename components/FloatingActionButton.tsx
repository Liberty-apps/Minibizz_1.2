import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Animated, Dimensions } from 'react-native';
import { Plus, FileText, Users, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

interface FABAction {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  color: string;
}

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    
    Animated.spring(animation, {
      toValue,
      tension: 80,
      friction: 8,
      useNativeDriver: true,
    }).start();
    
    setIsOpen(!isOpen);
  };

  const actions: FABAction[] = [
    {
      icon: <FileText size={20} color="#ffffff" />,
      label: 'Devis',
      onPress: () => router.push('/devis/create'),
      color: '#2563eb',
    },
    {
      icon: <Users size={20} color="#ffffff" />,
      label: 'Client',
      onPress: () => router.push('/clients/create'),
      color: '#16a34a',
    },
    {
      icon: <Calendar size={20} color="#ffffff" />,
      label: 'Événement',
      onPress: () => router.push('/planning/create'),
      color: '#eab308',
    },
  ];

  const actionStyle = (index: number) => {
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -60 * (index + 1)],
    });

    const scale = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    });

    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  };

  const labelStyle = (index: number) => {
    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0],
    });

    const opacity = animation.interpolate({
      inputRange: [0, 0.8, 1],
      outputRange: [0, 0, 1],
    });

    return {
      transform: [{ translateX }],
      opacity,
    };
  };

  const rotation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const bgOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <>
      {isOpen && (
        <Animated.View 
          style={[
            styles.backdrop, 
            { opacity: bgOpacity }
          ]}
          pointerEvents={isOpen ? 'auto' : 'none'}
          onTouchStart={() => setIsOpen(false)}
        />
      )}
      
      <View style={styles.container} pointerEvents="box-none">
        {actions.map((action, index) => (
          <Animated.View 
            key={index} 
            style={[styles.actionContainer, actionStyle(index)]}
            pointerEvents={isOpen ? 'auto' : 'none'}
          >
            <Animated.View style={[styles.actionLabel, labelStyle(index)]}>
              <View style={[styles.labelBg, { backgroundColor: action.color }]}>
                <Text style={styles.labelText}>{action.label}</Text>
              </View>
            </Animated.View>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: action.color }]}
              onPress={() => {
                toggleMenu();
                action.onPress();
              }}
            >
              {action.icon}
            </TouchableOpacity>
          </Animated.View>
        ))}
        
        <TouchableOpacity 
          style={styles.fab}
          onPress={toggleMenu}
          activeOpacity={0.8}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Plus size={24} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 25,
    right: 25,
    zIndex: 999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 998,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  actionContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 0,
    right: 0,
  },
  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  actionLabel: {
    marginRight: 8,
  },
  labelBg: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  labelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
});
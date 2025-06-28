import { Tabs } from 'expo-router';
import { LayoutDashboard, FileText, Users, Calendar, Settings, Calculator } from 'lucide-react-native';
import { useSubscription } from '../../src/contexts/SubscriptionContext';

export default function TabLayout() {
  const { hasAccess } = useSubscription();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <LayoutDashboard size={size} color={color} />
          ),
        }}
      />
      
      {hasAccess('devis') && (
        <Tabs.Screen
          name="devis"
          options={{
            title: 'Documents',
            tabBarIcon: ({ size, color }) => (
              <FileText size={size} color={color} />
            ),
          }}
        />
      )}
      
      {hasAccess('clients') && (
        <Tabs.Screen
          name="clients"
          options={{
            title: 'Clients',
            tabBarIcon: ({ size, color }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
      )}
      
      {hasAccess('planning') && (
        <Tabs.Screen
          name="planning"
          options={{
            title: 'Planning',
            tabBarIcon: ({ size, color }) => (
              <Calendar size={size} color={color} />
            ),
          }}
        />
      )}
      
      <Tabs.Screen
        name="outils"
        options={{
          title: 'Outils',
          tabBarIcon: ({ size, color }) => (
            <Calculator size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="parametres"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      
      {/* Pages cachées de la navigation principale */}
      <Tabs.Screen
        name="calculs"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="abonnement"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="sites-vitrines"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="aide"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="actualites"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
      <Tabs.Screen
        name="devis-optimized"
        options={{
          href: null, // Cache cet onglet de la navigation
        }}
      />
    </Tabs>
  );
}
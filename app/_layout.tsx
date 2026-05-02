import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { solicitarPermisos } from '../hooks/useNotificaciones';
import { TareasProvider } from '../context/TareasContext';

export default function RootLayout() {
  useEffect(() => {
    solicitarPermisos().catch(() => {});
  }, []);

  return (
    <TareasProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#4A90D9',
          tabBarInactiveTintColor: '#BDC3C7',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopColor: '#F0F3F7',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Inicio',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="tareas"
          options={{
            title: 'Mis Tareas',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="agregar" options={{ href: null }} />
        <Tabs.Screen name="editar/[id]" options={{ href: null }} />
      </Tabs>
    </TareasProvider>
  );
}

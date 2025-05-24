import React from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index" // This will point to app/(app)/(tabs)/index.tsx
        options={{
          title: 'Executions',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-checks" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="pending" // This will point to app/(app)/(tabs)/pending.tsx
        options={{
          title: 'Pending',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cloud-upload-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

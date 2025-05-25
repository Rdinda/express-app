import { useAuth } from '@/src/contexts/AuthContext'; // Adjusted path
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function AppStackLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)" // This refers to the directory app/(app)/(tabs)
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="new-record" // This refers to app/(app)/new-record.tsx
        options={{
          title: 'Novo Registro',
          // You might want to add presentation: 'modal' for a modal look
        }}
      />
    </Stack>
  );
}

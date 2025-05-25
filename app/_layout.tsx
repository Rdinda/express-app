import { AuthProvider, useAuth } from '@/src/contexts/AuthContext'; // Adjusted path
import { SyncProvider } from '@/src/contexts/SyncContext'; // Import SyncProvider
import theme from '@/src/theme/theme'; // Import the custom theme
import { Slot, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PaperProvider } from 'react-native-paper';

// Main layout component that decides which navigator to show
const MainLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAppGroup = segments[0] === '(app)';
    if (isAuthenticated && !inAppGroup) {
      router.replace('/');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Slot />;
};

// Root layout wraps everything with PaperProvider and AuthProvider
export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <SyncProvider>
          <MainLayout />
        </SyncProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AuthProvider } from '@/src/contexts/AuthContext';
import { SyncProvider } from '@/src/contexts/SyncContext';


export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';

  return (
    <AuthProvider>
      <SyncProvider>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Slot />
      </SyncProvider>
    </AuthProvider>
  );
}

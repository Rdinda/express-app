import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSync } from '../src/contexts/SyncContext';

export default function PendingScreen() {
  const { state } = useSync();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sync Status</Text>

      <View style={styles.statusItem}>
        <Text style={styles.label}>Status: </Text>
        <Text style={state.isOnline ? styles.online : styles.offline}>
          {state.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>

      <View style={styles.statusItem}>
        <Text style={styles.label}>Pending Items: </Text>
        <Text style={styles.value}>{state.pendingItems}</Text>
      </View>

      {state.isSyncing && (
        <View style={styles.syncingContainer}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.syncingText}>Syncing...</Text>
        </View>
      )}

      {state.lastSyncDate && (
        <View style={styles.statusItem}>
          <Text style={styles.label}>Last Sync: </Text>
          <Text style={styles.value}>
            {new Date(state.lastSyncDate).toLocaleString()}
          </Text>
        </View>
      )}

      {state.error && (
        <View style={styles.statusItem}>
          <Text style={styles.labelError}>Error: </Text>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}

      {/* Placeholder for future list of pending items */}
      <View style={styles.placeholder}>
        <Text>List of pending items will be displayed here.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  labelError: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
    color: 'red',
  },
  value: {
    fontSize: 16,
  },
  online: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  offline: {
    fontSize: 16,
    color: 'darkorange',
    fontWeight: 'bold',
  },
  syncingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#e0e0ff',
    borderRadius: 5,
  },
  syncingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#0000ff',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    flexShrink: 1, // Allows error text to wrap
  },
  placeholder: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    alignItems: 'center',
  }
});

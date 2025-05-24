import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, List, Divider } from 'react-native-paper';
import { useAuth } from '../../../src/contexts/AuthContext'; // Adjusted path
import { Link } from 'expo-router'; // Import Link for navigation

interface ExecutionRecord {
  id: string;
  vehicle: string;
  service: string;
  date: string;
  status: string;
}

const MOCK_EXECUTIONS: ExecutionRecord[] = [
  { id: '1', vehicle: 'Toyota Camry - ABC123', service: 'Oil Change', date: '2024-05-20', status: 'Completed' },
  { id: '2', vehicle: 'Honda Civic - XYZ789', service: 'Tire Rotation', date: '2024-05-22', status: 'Completed' },
  { id: '3', vehicle: 'Ford F-150 - QWE456', service: 'Brake Inspection', date: '2024-05-25', status: 'Pending' },
  { id: '4', vehicle: 'Chevrolet Malibu - JKL321', service: 'Air Filter Replacement', date: '2024-05-28', status: 'In Progress' },
  { id: '5', vehicle: 'Nissan Altima - MNO654', service: 'Battery Check', date: '2024-06-01', status: 'Scheduled' },
];

export default function ExecutionsScreen() {
  const { logout } = useAuth();

  const renderItem = ({ item }: { item: ExecutionRecord }) => (
    <List.Item
      title={`${item.vehicle} - ${item.service}`}
      description={`Date: ${item.date} - Status: ${item.status}`}
      left={props => <List.Icon {...props} icon="car-wrench" />}
      onPress={() => console.log('Pressed execution:', item.id)} // Placeholder action
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Executions Screen</Text>
      
      <Link href="/(app)/new-record" asChild>
        <Button mode="elevated" icon="plus-circle-outline" style={styles.newRecordButton}>
          Novo Registro
        </Button>
      </Link>
      
      <FlatList
        data={MOCK_EXECUTIONS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={Divider}
      />
      <Button mode="contained" onPress={logout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 0,
  },
  title: {
    fontSize: 24,
    marginBottom: 10, // Reduced margin
    textAlign: 'center',
  },
  newRecordButton: {
    marginBottom: 10, // Space between new record button and list
    width: '90%', // Make button wider
  },
  list: {
    width: '100%',
  },
  button: { // Style for Logout button
    marginTop: 20,
    marginBottom: 20,
    width: '90%', // Make button wider
  }
});

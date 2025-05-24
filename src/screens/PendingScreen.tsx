import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Icon } from 'react-native-paper';
import CustomCard from '../components/CustomCard'; // Corrected relative path

const PendingScreen = () => {
  const cardContent = (
    <View style={styles.cardContentView}>
      <Icon source="cloud-sync-outline" size={48} />
      <Text style={styles.message}>
        Pending synchronization items will be displayed here.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomCard
        title="Pending Items"
        content={cardContent}
        style={styles.customCardStyle} // Example of passing custom style
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the card on the screen
    alignItems: 'center',
    padding: 16, // Padding for the screen
  },
  customCardStyle: {
    width: '90%', // Make the card take up most of the width
    maxWidth: 400, // Max width for larger screens
  },
  cardContentView: { // Styles for the content passed to the card
    alignItems: 'center', // Center icon and message within the card's content area
    paddingVertical: 20,
  },
  message: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 16, // Space between icon and message
  },
  // title style is now handled by CustomCard's Card.Title
});

export default PendingScreen;

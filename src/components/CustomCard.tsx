import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface CustomCardProps {
  title?: string;
  subtitle?: string;
  content?: ReactNode; // Content can be a string or JSX
  onPress?: () => void;
  // Add any other props you might want to pass to the Paper Card
  // e.g., elevation, mode, etc.
  style?: object; // To allow passing custom styles to the card
}

const CustomCard: React.FC<CustomCardProps> = ({
  title,
  subtitle,
  content,
  onPress,
  style,
}) => {
  return (
    <Card onPress={onPress} style={[styles.card, style]}>
      {title && <Card.Title title={title} subtitle={subtitle} />}
      {content && (
        <Card.Content>
          {typeof content === 'string' ? <Text>{content}</Text> : content}
        </Card.Content>
      )}
      {/* You can also add Card.Actions here if needed in the future */}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8, // Default margin
    // Add other default styles here if needed
    // e.g., elevation: 2,
  },
});

export default CustomCard;

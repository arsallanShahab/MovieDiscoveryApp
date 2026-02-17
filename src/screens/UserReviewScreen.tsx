import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
const UserReviewScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>review</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
});

export default UserReviewScreen;

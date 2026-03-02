import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Review as ReviewType } from '../types';
import { useState } from 'react';

const Review = ({ data }: { data: ReviewType }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <View key={data.id} style={styles.reviewCard}>
      <Text style={styles.reviewAuthor}>{data.author}</Text>
      <Text
        style={styles.reviewContent}
        numberOfLines={isExpanded ? undefined : 5}
      >
        {data.content}
      </Text>
      <TouchableOpacity
        onPress={() => setIsExpanded(true)}
        style={{
          padding: 10,
          borderRadius: 5,
          backgroundColor: '#eee',
        }}
      >
        <Text>Show More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewCard: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  reviewAuthor: { fontWeight: 'bold', marginBottom: 5 },
  reviewContent: { fontSize: 14, color: '#444' },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Review;

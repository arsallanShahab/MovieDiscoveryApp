import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getMovieDetails } from '../services/api';
import { IMAGE_BASE_URL } from '../utils/constants';
import CustomHeader from '../components/CustomHeader';

const MovieDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { movieId } = route.params;
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [movieId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (!movie) return <Text>Error loading movie details</Text>;

  const renderCast = ({ item }: { item: any }) => (
    <View style={styles.castCard}>
      <Image
        source={{
          uri: item.profile_path
            ? `${IMAGE_BASE_URL.W200}${item.profile_path}`
            : 'https://via.placeholder.com/100x150',
        }}
        style={styles.castImage}
      />
      <Text style={styles.castName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.character} numberOfLines={1}>
        {item.character}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Movie Details" showBack />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{
            uri: `${IMAGE_BASE_URL.W500}${
              movie.backdrop_path || movie.poster_path
            }`,
          }}
          style={styles.backdrop}
        />
        <View style={styles.content}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.subtitle}>
            {movie.release_date} •{' '}
            {movie.runtime ? `${movie.runtime} min` : 'N/A'}
          </Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          <Text style={styles.sectionTitle}>Cast</Text>
          <FlatList
            data={movie.credits?.cast || []}
            renderItem={renderCast}
            keyExtractor={item => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.castList}
          />

          <View style={styles.reviewHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <Button
              title="Add Review"
              onPress={() => navigation.navigate('UserReview', { movieId })}
            />
          </View>

          {movie.reviews?.results?.length > 0 ? (
            movie.reviews.results.map((item: any) => (
              <View key={item.id} style={styles.reviewCard}>
                <Text style={styles.reviewAuthor}>{item.author}</Text>
                <Text style={styles.reviewContent}>{item.content}</Text>
              </View>
            ))
          ) : (
            <Text>No reviews available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 20 },
  backdrop: { width: '100%', height: 250 },
  content: { padding: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 15 },
  overview: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  castList: { marginBottom: 20 },
  castCard: { width: 100, marginRight: 15 },
  castImage: {
    width: 100,
    height: 150,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
  castName: { fontSize: 12, fontWeight: 'bold', marginTop: 5 },
  character: { fontSize: 10, color: '#666' },
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

export default MovieDetailsScreen;

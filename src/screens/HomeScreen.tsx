import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getPopularMovies } from '../services/api';
import { Movie } from '../types';
import { IMAGE_BASE_URL } from '../utils/constants';
import CustomHeader from '../components/CustomHeader';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Search01Icon,
  StarIcon,
  Calendar03Icon,
  Film01Icon,
  LayoutGridIcon,
  Menu01Icon,
} from '@hugeicons/core-free-icons';

const { width } = Dimensions.get('window');
const COLUMN_count = 2;
const SPACING = 16;
const GRID_CARD_WIDTH = (width - (COLUMN_count + 1) * SPACING) / COLUMN_count;
const LIST_CARD_HEIGHT = 170;
const POSTER_ASPECT_RATIO = 1.5;

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(true);

  const fetchMovies = useCallback(
    async (pageNum: number, shouldRefresh = false) => {
      if (loading && !shouldRefresh) return;

      setLoading(true);
      if (shouldRefresh) setError(null);

      try {
        const response = await getPopularMovies(pageNum);

        if (response && response.results) {
          setMovies(prev =>
            shouldRefresh ? response.results : [...prev, ...response.results],
          );
          setHasMore(response.page < response.total_pages);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        setError('Failed to load movies. Pull to refresh.');
        console.error(err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [loading],
  );

  useEffect(() => {
    fetchMovies(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadMore = () => {
    if (hasMore && !loading && !error) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchMovies(1, true);
  };

  const toggleView = () => setIsGridView(prev => !prev);

  const renderItem = ({ item }: { item: Movie }) => {
    if (isGridView) {
      return (
        <TouchableOpacity
          style={styles.gridCard}
          onPress={() => navigation.navigate('Details', { movieId: item.id })}
          activeOpacity={0.7}
          accessibilityLabel={`View details for ${item.title}`}
        >
          <View style={styles.posterContainer}>
            {item.poster_path ? (
              <Image
                source={{
                  uri: `${IMAGE_BASE_URL.W500}${item.poster_path}`,
                }}
                style={styles.poster}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.poster, styles.placeholderPoster]}>
                <HugeiconsIcon icon={Film01Icon} size={40} color="#ccc" />
              </View>
            )}

            <View style={styles.ratingBadge}>
              <HugeiconsIcon icon={StarIcon} size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>

            <View style={styles.metaRow}>
              <HugeiconsIcon icon={Calendar03Icon} size={12} color="#666" />
              <Text style={styles.date}>
                {item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : 'N/A'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // List View Render
    return (
      <TouchableOpacity
        style={styles.listCard}
        onPress={() => navigation.navigate('Details', { movieId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.listPosterContainer}>
          {item.poster_path ? (
            <Image
              source={{
                uri: `${IMAGE_BASE_URL.W500}${item.poster_path}`,
              }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.poster, styles.placeholderPoster]}>
              <HugeiconsIcon icon={Film01Icon} size={30} color="#ccc" />
            </View>
          )}
        </View>

        <View style={styles.listCardContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <View style={styles.listMetaContainer}>
            <View style={styles.metaRow}>
              <HugeiconsIcon icon={Calendar03Icon} size={14} color="#666" />
              <Text style={styles.listMetaText}>
                {item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : 'N/A'}
              </Text>
            </View>

            <View style={styles.listRatingBadge}>
              <HugeiconsIcon icon={StarIcon} size={12} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.vote_average.toFixed(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.listOverview} numberOfLines={3}>
            {item.overview}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading) return <View style={styles.footerSpacer} />;

    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color="#E50914" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <CustomHeader
        title="Discover"
        showBack={false}
        rightComponent={
          <TouchableOpacity
            onPress={toggleView}
            style={styles.viewToggle}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HugeiconsIcon
              icon={isGridView ? Menu01Icon : LayoutGridIcon}
              size={24}
              color="#1a1a1a"
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.listContainer}>
        <FlatList
          key={isGridView ? 'grid' : 'list'}
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={isGridView ? styles.columnWrapper : undefined}
          showsVerticalScrollIndicator={false}
          numColumns={isGridView ? COLUMN_count : 1}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#E50914']}
              tintColor="#E50914"
              progressViewOffset={20}
            />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !loading && error ? (
              <View style={styles.centerContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  onPress={() => fetchMovies(1, true)}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : loading && movies.length === 0 ? (
              <ActivityIndicator
                size="large"
                color="#E50914"
                style={styles.centerLoader}
              />
            ) : null
          }
        />
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Search')}
        activeOpacity={0.9}
        accessibilityRole="button"
        accessibilityLabel="Search movies"
      >
        <HugeiconsIcon
          icon={Search01Icon}
          size={24}
          color="#fff"
          strokeWidth={2.5}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    padding: SPACING,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  gridCard: {
    width: GRID_CARD_WIDTH,
    marginBottom: SPACING,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  posterContainer: {
    width: '100%',
    height: GRID_CARD_WIDTH * POSTER_ASPECT_RATIO,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  listCard: {
    width: '100%',
    height: LIST_CARD_HEIGHT,
    marginBottom: SPACING,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  listPosterContainer: {
    width: LIST_CARD_HEIGHT * 0.66,
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  listCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    flexShrink: 1,
  },
  listMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  listMetaText: {
    fontSize: 13,
    color: '#666',
  },
  listRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  listOverview: {
    fontSize: 13,
    color: '#4A4A4A',
    lineHeight: 18,
    flexShrink: 1,
  },

  poster: {
    width: '100%',
    height: '100%',
  },
  placeholderPoster: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 4,
  },
  ratingText: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  loaderFooter: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerSpacer: {
    height: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  centerLoader: {
    marginTop: 50,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#E50914',
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E50914',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E50914',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default HomeScreen;

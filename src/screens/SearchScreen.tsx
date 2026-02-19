import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { searchMovies } from '../services/api';
import { debounce } from 'lodash';
import { IMAGE_BASE_URL, DEBOUNCE_TIME } from '../utils/constants';
import CustomHeader from '../components/CustomHeader';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Search01Icon,
  Cancel01Icon,
  Calendar03Icon,
  StarIcon,
} from '@hugeicons/core-free-icons';

const SearchScreen = () => {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const performSearch = async (text: string, pageNum: number) => {
    if (!text.trim()) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await searchMovies(text, pageNum);
      if (pageNum === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setHasMore(data.page < data.total_pages);
    } catch (error) {
      console.error(error);
      // setHasMore(false); // Maybe handle errors differently, but this is simple enough for now.
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setPage(1);
      performSearch(text, 1);
    }, DEBOUNCE_TIME),
    [],
  );

  const handleTextChange = (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      debouncedSearch(text);
    } else {
      setMovies([]);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setMovies([]);
    inputRef.current?.focus();
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      performSearch(query, nextPage);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { movieId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.posterContainer}>
        <Image
          source={{
            uri: item.poster_path
              ? `${IMAGE_BASE_URL.W200}${item.poster_path}`
              : 'https://via.placeholder.com/100x150',
          }}
          style={styles.poster}
          resizeMode="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <HugeiconsIcon icon={Calendar03Icon} size={14} color="#666" />
          <Text style={styles.year}>
            {item.release_date ? item.release_date.split('-')[0] : 'N/A'}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <HugeiconsIcon icon={StarIcon} size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {item.vote_average ? item.vote_average.toFixed(1) : 'NR'}
            <Text style={styles.ratingCount}> ({item.vote_count})</Text>
          </Text>
        </View>

        <Text style={styles.overview} numberOfLines={2}>
          {item.overview || 'No overview available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.screenContainer}>
      <CustomHeader title="Search" showBack />

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <HugeiconsIcon icon={Search01Icon} size={20} color="#666" />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Type to search movies..."
            placeholderTextColor="#999"
            value={query}
            onChangeText={handleTextChange}
            onSubmitEditing={() => performSearch(query, 1)}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString() + index} // keyExtractor safety
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          loading ? (
            <ActivityIndicator
              size="small"
              color="#E50914"
              style={styles.loader}
            />
          ) : null
        }
        ListEmptyComponent={
          !loading && query.length > 0 ? (
            <View style={styles.emptyContainer}>
              <HugeiconsIcon icon={Search01Icon} size={64} color="#ddd" />
              <Text style={styles.emptyText}>
                No results found for "{query}"
              </Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search terms.
              </Text>
            </View>
          ) : !loading && query.length === 0 ? (
            <View style={styles.emptyContainer}>
              <HugeiconsIcon icon={Search01Icon} size={64} color="#eee" />
              <Text style={styles.emptyText}>Start typing to search</Text>
            </View>
          ) : null
        }
        keyboardShouldPersistTaps="handled"
        onScroll={() => Keyboard.dismiss()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#333',
    fontSize: 16,
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 16,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden', // Ensure image respects border radius if needed, but styling on container handles it better.
    height: 140,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  posterContainer: {
    width: 90,
    height: '100%',
    backgroundColor: '#eee',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  year: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  ratingCount: {
    color: '#999',
    fontSize: 12,
    fontWeight: '400',
  },
  overview: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  loader: {
    paddingVertical: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SearchScreen;

import axios from 'axios';
import { API_URL, TMDB_ACCESS_TOKEN } from '@env';
import { API_ENDPOINTS } from '../utils/constants';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    accept: 'application/json',
  },
  params: {
    language: 'en-US',
  },
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await api.get(API_ENDPOINTS.POPULAR_MOVIES, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await api.get(API_ENDPOINTS.SEARCH_MOVIES, {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId: number) => {
  try {
    const [details, credits, reviews] = await Promise.all([
      api.get(API_ENDPOINTS.MOVIE_DETAILS(movieId)),
      api.get(API_ENDPOINTS.MOVIE_CREDITS(movieId)),
      api.get(API_ENDPOINTS.MOVIE_REVIEWS(movieId)),
    ]);

    return {
      ...details.data,
      credits: credits.data,
      reviews: reviews.data,
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export default api;

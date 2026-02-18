import axios from 'axios';
import { API_URL, TMDB_ACCESS_TOKEN } from '@env';

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
    const response = await api.get('/movie/popular', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page = 1) => {
  try {
    const response = await api.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export default api;

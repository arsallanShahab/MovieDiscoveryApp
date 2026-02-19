export const API_ENDPOINTS = {
  POPULAR_MOVIES: '/movie/popular',
  SEARCH_MOVIES: '/search/movie',
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  MOVIE_CREDITS: (id: number) => `/movie/${id}/credits`,
  MOVIE_REVIEWS: (id: number) => `/movie/${id}/reviews`,
};

export const IMAGE_BASE_URL = {
  W200: 'https://image.tmdb.org/t/p/w200',
  W500: 'https://image.tmdb.org/t/p/w500',
  ORIGINAL: 'https://image.tmdb.org/t/p/original',
};

export const DEBOUNCE_TIME = 300;

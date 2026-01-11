import axios from 'axios';

// Get configuration from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// Create axios instance with base configuration
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Helper to fetch multiple pages in parallel
const fetchMultiplePages = async (endpoint, params, pageCount = 3) => {
  const requests = Array.from({ length: pageCount }, (_, i) =>
    tmdbApi.get(endpoint, { params: { ...params, page: i + 1 } })
  );
  const responses = await Promise.all(requests);
  const allResults = responses.flatMap(res => res.data.results);
  return { results: allResults, total_pages: responses[0].data.total_pages };
};

/**
 * Get image URL with specified size
 * @param {string} path - Image path from TMDB API
 * @param {string} size - Image size (w200, w500, original, etc.)
 * @returns {string} Full image URL
 */
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

/**
 * Fetch popular movies
 * @param {number} page - Page number for pagination
 * @returns {Promise} API response with popular movies
 */
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

/**
 * Search movies by title
 * @param {string} query - Search query
 * @param {number} page - Page number for pagination
 * @returns {Promise} API response with search results
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

/**
 * Get movie details by ID
 * @param {number} movieId - Movie ID
 * @returns {Promise} API response with movie details
 */
export const getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        append_to_response: 'credits,videos',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

/**
 * Discover movies with filters
 * @param {Object} filters - Filter options
 * @param {number} page - Page number for pagination
 * @returns {Promise} API response with filtered movies
 */
export const discoverMovies = async (filters = {}, page = 1) => {
  try {
    const params = {
      page,
      sort_by: filters.sortBy || 'popularity.desc',
    };

    // Add language filter
    if (filters.language) {
      params.with_original_language = filters.language;
    }

    // Add genre filter
    if (filters.genre) {
      params.with_genres = filters.genre;
    }

    // Add year filter
    if (filters.year) {
      params.primary_release_year = filters.year;
    }

    // Add rating filter (vote average)
    if (filters.rating) {
      params['vote_average.gte'] = filters.rating;
      params['vote_count.gte'] = 100; // Ensure movies have enough votes
    }

    const response = await tmdbApi.get('/discover/movie', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};

/**
 * Get list of movie genres
 * @returns {Promise} API response with genre list
 */
export const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

/**
 * Get list of available languages
 * @returns {Promise} API response with language list
 */
export const getLanguages = async () => {
  try {
    const response = await tmdbApi.get('/configuration/languages');
    return response.data;
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

// ===== TV SHOWS API =====

/**
 * Get popular TV shows
 */
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

/**
 * Get TV show details
 */
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: { append_to_response: 'credits,videos,similar,recommendations' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error;
  }
};

/**
 * Search TV shows
 */
export const searchTVShows = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/tv', { params: { query, page } });
    return response.data;
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};

/**
 * Discover TV shows with filters
 */
export const discoverTVShows = async (filters = {}, page = 1) => {
  try {
    const params = {
      page,
      sort_by: filters.sortBy || 'popularity.desc',
    };

    if (filters.language) params.with_original_language = filters.language;
    if (filters.genre) params.with_genres = filters.genre;
    if (filters.year) params.first_air_date_year = filters.year;
    if (filters.rating) params['vote_average.gte'] = filters.rating;

    const response = await tmdbApi.get('/discover/tv', { params });
    return response.data;
  } catch (error) {
    console.error('Error discovering TV shows:', error);
    throw error;
  }
};

// ===== TRENDING API =====

/**
 * Get trending content (all, movie, tv)
 */
export const getTrending = async (mediaType = 'all', timeWindow = 'week') => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending:', error);
    throw error;
  }
};

/**
 * Get popular content (movie or tv)
 */
export const getPopular = async (mediaType = 'movie', page = 1) => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/popular`, { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular:', error);
    throw error;
  }
};

// ===== MULTI SEARCH =====

/**
 * Search across movies, TV shows, and people
 */
export const multiSearch = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', { params: { query, page } });
    return response.data;
  } catch (error) {
    console.error('Error in multi search:', error);
    throw error;
  }
};

// ===== RECOMMENDATIONS API =====

/**
 * Get similar movies
 */
export const getSimilarMovies = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    throw error;
  }
};

/**
 * Get similar TV shows
 */
export const getSimilarTVShows = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/similar`);
    return response.data;
  } catch (error) {
    console.error('Error fetching similar TV shows:', error);
    throw error;
  }
};

/**
 * Get movie recommendations
 */
export const getMovieRecommendations = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie recommendations:', error);
    throw error;
  }
};

/**
 * Get TV show recommendations
 */
export const getTVRecommendations = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error('Error fetching TV recommendations:', error);
    throw error;
  }
};

// ===== PERSON/CAST API =====

/**
 * Get person details
 */
export const getPersonDetails = async (personId) => {
  try {
    const response = await tmdbApi.get(`/person/${personId}`, {
      params: { append_to_response: 'movie_credits,tv_credits' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching person details:', error);
    throw error;
  }
};

// ===== PERSONALIZED RECOMMENDATIONS =====

/**
 * Get personalized recommendations based on liked content
 */
export const getPersonalizedRecommendations = async (likeStats) => {
  try {
    const { topGenres, topLanguages } = likeStats;
    
    // Prioritize English content
    const languages = topLanguages.includes('en') 
      ? ['en', ...topLanguages.filter(l => l !== 'en')].slice(0, 2)
      : ['en', ...topLanguages].slice(0, 2);

    const params = {
      sort_by: 'popularity.desc',
      'vote_average.gte': 6.5,
      with_original_language: languages.join('|'),
      with_genres: topGenres.slice(0, 3).join(',')
    };

    // Fetch both movies and TV shows
    const [moviesResponse, tvResponse] = await Promise.all([
      tmdbApi.get('/discover/movie', { params }),
      tmdbApi.get('/discover/tv', { params })
    ]);

    // Combine and shuffle
    const combined = [
      ...moviesResponse.data.results.map(m => ({ ...m, media_type: 'movie' })),
      ...tvResponse.data.results.map(t => ({ ...t, media_type: 'tv' }))
    ].sort(() => Math.random() - 0.5);

    return { results: combined.slice(0, 20) };
  } catch (error) {
    console.error('Error fetching personalized recommendations:', error);
    throw error;
  }
};

/**
 * Get top rated content with English priority
 */
export const getTopRated = async (mediaType = 'movie', page = 1) => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/top_rated`, {
      params: { page, language: 'en-US' }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated:', error);
    throw error;
  }
};

/**
 * Get videos/trailers for content
 */
export const getVideos = async (mediaType, id) => {
  try {
    const response = await tmdbApi.get(`/${mediaType}/${id}/videos`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};


export default {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  discoverMovies,
  getGenres,
  getLanguages,
  getImageUrl,
};

/* eslint-disable no-unused-vars */
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function safeFetch(url) {
	let res;

	try {
		res = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json',
				Authorization: `Bearer ${API_KEY}`
			}
		});
	} catch (err) {
		// Network error / DNS / offline / blocked
		throw new Error('NETWORK_ERROR');
	}

	if (!res.ok) {
		// API reachable but returned error
		throw new Error(`API_ERROR_${res.status}`);
	}

	return res.json();
}

/* ============================
   MOVIE LIST (HOME / SEARCH)
============================ */
export function fetchMovies(query = '', page = 1) {
	const url = query
		? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=en-US&page=${page}`
		: `${BASE_URL}/movie/now_playing?language=en-US&page=${page}`;

	return safeFetch(url);
}

/* ============================
   MOVIE DETAILS
============================ */
export function fetchMovie(id) {
	return safeFetch(`${BASE_URL}/movie/${id}`);
}

export function fetchMovieImgs(id) {
	return safeFetch(`${BASE_URL}/movie/${id}/images`);
}

export function fetchMovieReviews(id) {
	return safeFetch(`${BASE_URL}/movie/${id}/reviews`);
}

export function fetchMovieVideos(id) {
	return safeFetch(`${BASE_URL}/movie/${id}/videos`);
}

export function fetchMovieCredits(id) {
	return safeFetch(`${BASE_URL}/movie/${id}/credits`);
}

/* ============================
   GENRES
============================ */
export function fetchGenres() {
	return safeFetch(`${BASE_URL}/genre/movie/list`);
}

/* ============================
   DISCOVER MOVIES (FILTERS)
============================ */
export function discoverMovies({
	genre = '',
	year = '',
	rating = '',
	page = 1,
	sortBy = 'popularity.desc'
} = {}) {
	let url = `${BASE_URL}/discover/movie?language=en-US&page=${page}&sort_by=${sortBy}`;

	if (genre) url += `&with_genres=${genre}`;
	if (year) url += `&primary_release_year=${year}`;
	if (rating) url += `&vote_average.gte=${rating}`;

	return safeFetch(url);
}

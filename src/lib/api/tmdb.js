const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchMovies(query = '', page = 1) {
	/* API for Movie List Home page */
	const url = query
		? `${BASE_URL}/search/movie?query=${query}&language=en-US&page=${page}`
		: `${BASE_URL}/movie/now_playing?language=en-US&page=${page}`;

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}

/* API for Selected Movie Details page like movie details, images, reviews, videos */
export async function fetchMovie(id) {
	const res = await fetch(`${BASE_URL}/movie/${id}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}
export async function fetchMovieImgs(id) {
	const res = await fetch(`${BASE_URL}/movie/${id}/images`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}
export async function fetchMovieReviews(id) {
	console.log(id, ',.,..,..,.,.,.,.,.,');
	const res = await fetch(`${BASE_URL}/movie/${id}/reviews`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}
export async function fetchMovieVideos(id) {
	console.log(id, ',.,..,..,.,.,.,.,.,');
	const res = await fetch(`${BASE_URL}/movie/${id}/videos`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}
export async function fetchMovieCredits(id) {
	console.log(id, ',.,..,..,.,.,.,.,.,');
	const res = await fetch(`${BASE_URL}/movie/${id}/credits`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}

export async function fetchGenres() {
	const res = await fetch(`${BASE_URL}/genre/movie/list`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});
	return res.json();
}

/* API for Discover Movies with Filters (Genre, Year, Rating) */
export async function discoverMovies({
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

	const res = await fetch(url, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${API_KEY}`
		}
	});

	if (!res.ok) {
		throw new Error('Failed to fetch discovered movies');
	}

	return res.json();
}

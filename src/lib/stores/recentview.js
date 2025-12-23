import { user } from '$lib/stores/auth';
import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

const STORAGE_KEY = 'recentView';
const MAX_ITEMS = 6;

/* ---------- LOAD ---------- */
function loadRecent() {
	if (!browser) return [];

	try {
		return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
	} catch {
		return [];
	}
}

export const recentView = writable(loadRecent());

/* ---------- PERSIST ---------- */
if (browser) {
	recentView.subscribe((list) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
	});
}

/* ---------- ACTIONS ---------- */

/** Add movie to recent views */
export function addRecentView(movie) {
	if (!movie?.id) return;

	recentView.update((list) => {
		const filtered = list.filter((m) => m.id !== movie.id);
		return [movie, ...filtered].slice(0, MAX_ITEMS);
	});
}

/** Clear recent views */
export function clearRecentView() {
	recentView.set([]);
}

/* ---------- HELPERS ---------- */

/** Show recent only on login page */
export const showRecentOnLogin = derived(user, ($user) => !$user);

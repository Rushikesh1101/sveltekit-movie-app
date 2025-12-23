/* eslint-disable svelte/no-navigation-without-resolve */
import { writable, get, derived } from 'svelte/store';
import { browser } from '$app/environment';
import { user } from '$lib/stores/auth';
import { goto } from '$app/navigation';

/* ---------------- HELPERS ---------------- */
function storageKey(email) {
	return `watchlist:${email}`;
}

function loadForUser(u) {
	if (!browser || !u?.email) return [];
	try {
		return JSON.parse(localStorage.getItem(storageKey(u.email))) ?? [];
	} catch {
		return [];
	}
}

/* ---------------- STORE ---------------- */
export const watchlist = writable([]);

/* Sync watchlist on login / logout */
if (browser) {
	user.subscribe((u) => {
		watchlist.set(loadForUser(u));
	});
}

/* Persist per user */
if (browser) {
	watchlist.subscribe((list) => {
		const u = get(user);
		if (!u?.email) return;
		localStorage.setItem(storageKey(u.email), JSON.stringify(list));
	});
}

/* ---------------- GUARD ---------------- */
function requireAuth() {
	const u = get(user);
	if (!u?.email) {
		goto('/login');
		return false;
	}
	return true;
}

/* ---------------- ACTIONS ---------------- */

/** ADD */
export function addToWatchlist(movie) {
	if (!requireAuth()) return 'unauthorized';

	watchlist.update((list) => {
		if (list.some((m) => m.id === movie.id)) return list;
		return [...list, movie];
	});

	return 'add';
}

/** REMOVE */
export function removeFromWatchlist(id) {
	if (!requireAuth()) return 'unauthorized';

	watchlist.update((list) => list.filter((m) => m.id !== id));
	return 'remove';
}

/** TOGGLE (USE THIS EVERYWHERE) */
export function toggleWatchlist(movie) {
	if (!requireAuth()) return 'unauthorized';

	let action = 'add';

	watchlist.update((list) => {
		const exists = list.some((m) => m.id === movie.id);
		action = exists ? 'remove' : 'add';

		return exists ? list.filter((m) => m.id !== movie.id) : [...list, movie];
	});

	return action;
}

/** CLEAR (on logout) */
export function clearWatchlist() {
	watchlist.set([]);
}

/* ---------------- DERIVED HELPERS ---------------- */

/** Filled heart state */
export function isInWatchlist(movieId) {
	return derived(watchlist, ($list) => $list.some((m) => m.id === movieId));
}

/** Badge / count */
export function watchlistCount() {
	return derived(watchlist, ($list) => $list.length);
}

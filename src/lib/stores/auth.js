/* eslint-disable svelte/no-navigation-without-resolve */
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

/* ---------------- STORAGE KEYS ---------------- */
const USERS_KEY = 'users';
const SESSION_KEY = 'user';

/* ---------------- HELPERS ---------------- */
function loadUsers() {
	if (!browser) return [];
	try {
		return JSON.parse(localStorage.getItem(USERS_KEY)) ?? [];
	} catch {
		return [];
	}
}

function saveUsers(users) {
	if (!browser) return;
	localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/* ---------------- SESSION STORE ---------------- */
const initialUser = browser ? JSON.parse(localStorage.getItem(SESSION_KEY)) : null;

export const user = writable(initialUser);

if (browser) {
	user.subscribe((val) => {
		if (val) {
			localStorage.setItem(SESSION_KEY, JSON.stringify(val));
		} else {
			localStorage.removeItem(SESSION_KEY);
		}
	});
}

/* ---------------- AUTH ACTIONS ---------------- */

/** SIGN UP (NO AUTO LOGIN) */
export function signup({ name, email, password }) {
	const users = loadUsers();

	const exists = users.find((u) => u.email === email);
	if (exists) {
		throw new Error('User already exists');
	}

	const newUser = {
		id: crypto.randomUUID(),
		name,
		email,
		password
	};

	users.push(newUser);
	saveUsers(users);

	// Redirect to login
	goto('/login');
}

/** LOGIN */
export function login(email, password) {
	const users = loadUsers();

	const found = users.find((u) => u.email === email);
	if (!found) {
		throw new Error('User not registered');
	}

	if (found.password !== password) {
		throw new Error('Incorrect password');
	}

	// Create session ONLY on login
	user.set({
		email: found.email,
		name: found.name
	});

	goto('/');
}

/** LOGOUT */
export function logout() {
	user.set(null);
	goto('/');
}

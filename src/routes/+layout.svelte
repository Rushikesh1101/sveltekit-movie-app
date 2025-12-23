<script>
	import '../app.css';
	import favicon from '$lib/assets/titleicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import { page } from '$app/stores';

	let search = '';

	const HIDE_NAVBAR_ROUTES = ['/login', '/signup'];
	$: hideNavbar = HIDE_NAVBAR_ROUTES.includes($page.url.pathname);

	/* -------- Dynamic Title -------- */
	$: pageTitle = (() => {
		if ($page.url.pathname.startsWith('/movie/')) return 'MovieHub ~ Movie Details';
		if ($page.url.pathname === '/watchlist') return 'MovieHub ~ Watchlist';
		if ($page.url.pathname === '/login') return 'MovieHub ~ Login';
		if ($page.url.pathname === '/signup') return 'MovieHub ~ Sign Up';
		return 'MovieHub ~ Discover Movies';
	})();
</script>

<svelte:head>
	<!-- App Title -->
	<title>{pageTitle}</title>

	<!-- Favicon -->
	<link rel="icon" type="image/svg+xml" href={favicon} />

	<!-- Theme Color (mobile browsers) -->
	<meta name="theme-color" content="#0f172a" />

	<!-- App Meta -->
	<meta name="application-name" content="MovieHub" />
	<meta name="description" content="Discover, track, and watch your favorite movies." />
</svelte:head>

<!-- ROOT DARK THEME WRAPPER -->
<div class="bg-gray-950 text-gray-200 min-h-screen antialiased">
	{#if !hideNavbar}
		<Navbar bind:search />
	{/if}

	<main>
		<slot />
	</main>
</div>

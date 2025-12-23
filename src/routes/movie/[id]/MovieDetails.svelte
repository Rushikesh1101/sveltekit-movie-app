<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { user } from '$lib/stores/auth';
	import MovieImgs from './MovieImgs.svelte';
	import { createEventDispatcher } from 'svelte';
	import MovieVideos from './MovieVideos.svelte';
	import { addRecentView } from '$lib/stores/recentView';
	import { toastAdded, toastRemoved } from '$lib/utils/toast';
	import { fetchMovie, fetchMovieVideos } from '$lib/api/tmdb';
	import { watchlist, toggleWatchlist } from '$lib/stores/watchlist';
	import { Star, Clock, Calendar, Globe, Film, Link, X } from 'lucide-svelte';

	export let id;
	let movie;
	let vids = [];
	let showTrailer = false;
	let showGallery = false;
	const dispatch = createEventDispatcher();

	$: id = $page.params?.id;

	$: if (id) {
		fetchMovie(id).then((d) => {
			movie = d;
			dispatch('loaded');
		});
		fetchMovieVideos(id).then((d) => {
			vids = d?.results || [];
			dispatch('loaded');
		});
	}

	const ytThumb = (key) => `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
	const formatMoney = (n) => (n ? `$${n.toLocaleString()}` : '—');

	$: trailer = vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer');

	let hoverPlay = false;
	let hoverTimeout;
	let trailerIframeReady = false;

	const onTrailerEnter = () => {
		if (!trailer) return;
		hoverTimeout = setTimeout(() => {
			hoverPlay = true;
		}, 350); // Prime-like delay
	};

	const onTrailerLeave = () => {
		clearTimeout(hoverTimeout);
		hoverPlay = false;
	};

	let inWatchlist = false;

	$: if (movie) {
		inWatchlist = $watchlist.some((m) => m.id === movie.id);
	}

	let animating = false;
	function handleWatchlist(e) {
		e.preventDefault();
		e.stopPropagation();

		const action = toggleWatchlist(movie);

		if (action === 'add') toastAdded(movie.title);
		if (action === 'remove') toastRemoved(movie.title);
	}

	$: if (movie) {
		addRecentView({
			id: movie.id,
			title: movie.title,
			poster_path: movie.poster_path,
			release_date: movie.release_date
		});
	}
</script>

<!-- ================= HEADER ================= -->
<!-- ================= HEADER ================= -->
{#if movie}
	<section class="bg-neutral-900 border-neutral-800 border-b">
		<div class="max-w-7xl px-4 py-6 space-y-4 mx-auto">
			<!-- Title + Ratings -->
			<div class="lg:flex-row lg:items-center lg:justify-between gap-6 flex flex-col">
				<div>
					<h1 class="text-3xl font-bold text-white leading-tight">
						{movie.title}
					</h1>

					<div class="gap-2 text-sm text-gray-400 mt-1 flex flex-wrap items-center">
						<span>{movie.release_date?.slice(0, 4)}</span>
						<span>•</span>
						<span>{movie.runtime} min</span>
						<span>•</span>
						<span>{movie.original_language.toUpperCase()}</span>
					</div>
				</div>

				<div class="gap-10 text-sm flex">
					<div class="text-right">
						<p class="text-xs tracking-wide text-gray-400 uppercase">IMDb Rating</p>
						<div class="gap-1 text-white flex items-center justify-end">
							<Star size={18} class="text-yellow-400 fill-yellow-400" />
							<span class="font-semibold text-lg">
								{movie.vote_average.toFixed(1)}
							</span>
							<span class="text-gray-400">/10</span>
						</div>
						<p class="text-xs text-gray-400">{movie.vote_count} votes</p>
					</div>

					<div class="text-right">
						<p class="text-xs tracking-wide text-gray-400 uppercase">Popularity</p>
						<p class="text-lg font-semibold text-white">
							{Math.round(movie.popularity)}
						</p>
					</div>
				</div>
			</div>

			<!-- ================= MEDIA GRID ================= -->
			<div class="lg:grid-cols-[220px_minmax(0,1fr)_280px] gap-6 grid grid-cols-1 items-start">
				<!-- Poster -->
				<div class="w-[220px]">
					<div class="rounded-lg shadow-lg bg-neutral-800 aspect-[2/3] overflow-hidden">
						<img
							src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
							alt={movie.title}
							class="h-full w-full object-cover"
						/>
					</div>
				</div>

				<!-- Trailer -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="aspect-video rounded-lg shadow-lg bg-black group relative cursor-pointer overflow-hidden"
					on:click={() => trailer && (showTrailer = true)}
				>
					<img
						src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
						alt={movie.title}
						class="h-full w-full object-cover opacity-80"
					/>

					{#if trailer}
						<div
							class="inset-0 bg-black/40 group-hover:bg-black/60 absolute flex items-center justify-center transition"
						>
							<div class="gap-3 flex items-center">
								<div
									class="w-14 h-14 bg-black/70 text-white text-xl flex items-center justify-center rounded-full"
								>
									▶
								</div>
								<span class="text-white font-medium text-lg"> Play trailer </span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Panel -->
				<div class="gap-2 flex flex-col">
					<MovieVideos {id} />
					<MovieImgs {id} />

					<button
						on:click={handleWatchlist}
						class="group gap-2 px-5 py-3 rounded-lg flex w-full items-center justify-center transition
	       					{inWatchlist
							? 'bg-red-500/10 text-red-400'
							: 'bg-yellow-400 hover:bg-yellow-300 text-black'}"
					>
						<span
							class="w-9 h-9 flex items-center justify-center rounded-full
								transition
								{inWatchlist ? 'bg-red-500/20 scale-110' : 'bg-black/10'}"
						>
							<svg
								viewBox="0 -960 960 960"
								class="w-5 h-5 transition
			       				{inWatchlist ? 'fill-red-500' : 'fill-black'}"
							>
								<path
									d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z"
								/>
							</svg>
						</span>

						<span class="text-sm font-semibold tracking-wide">
							{inWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
						</span>
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- ================= GENRES + OVERVIEW ================= -->
	<section class="max-w-7xl px-4 py-6 space-y-4 mx-auto">
		<div class="gap-2 flex flex-wrap">
			{#each movie.genres as g}
				<span class="px-3 py-1 text-sm text-white border-gray-600 rounded-full border">
					{g.name}
				</span>
			{/each}
		</div>

		<p class="text-gray-300 max-w-4xl leading-relaxed">
			{movie.overview}
		</p>
	</section>

	<!-- ================= LINKS ================= -->
	<section class="max-w-7xl px-4 py-4 gap-6 text-sm mx-auto flex">
		{#if movie.homepage}
			<a
				href={movie.homepage}
				target="_blank"
				class="gap-2 text-blue-400 flex items-center hover:underline"
			>
				<Link size={16} />
				Official Website
			</a>
		{/if}

		{#if movie.imdb_id}
			<a
				href={`https://www.imdb.com/title/${movie.imdb_id}`}
				target="_blank"
				class="gap-2 text-yellow-400 flex items-center hover:underline"
			>
				<Film size={16} />
				IMDb
			</a>
		{/if}
	</section>

	<!-- ================= FACTS ================= -->
	<section class="max-w-7xl px-4 py-6 text-sm space-y-3 mx-auto">
		<div class="border-gray-700 pb-2 border-b">
			<span class="text-gray-400">Status</span>
			<span class="ml-4 text-white">{movie.status}</span>
		</div>

		<div class="border-gray-700 pb-2 border-b">
			<span class="text-gray-400">Budget</span>
			<span class="ml-4 text-white">{formatMoney(movie.budget)}</span>
		</div>

		<div class="border-gray-700 pb-2 border-b">
			<span class="text-gray-400">Revenue</span>
			<span class="ml-4 text-white">{formatMoney(movie.revenue)}</span>
		</div>

		<div>
			<span class="text-gray-400">Production Countries</span>
			<span class="ml-4 text-white">
				{movie.production_countries.map((c) => c.name).join(', ')}
			</span>
		</div>
	</section>
	<!-- ================= PRODUCTION COMPANIES ================= -->
	<section class="max-w-7xl px-4 py-8 mx-auto">
		<h3 class="text-xl font-semibold text-white mb-4">Production Companies</h3>

		<div class="gap-6 flex flex-wrap">
			{#each movie.production_companies as pc}
				<div class="gap-3 flex items-center">
					{#if pc.logo_path}
						<img
							src={`https://image.tmdb.org/t/p/w200${pc.logo_path}`}
							alt={pc.name}
							class="h-8 bg-white p-1 rounded object-contain"
						/>
					{/if}
					<span class="text-gray-300 text-sm">{pc.name}</span>
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if showTrailer && trailer}
	<div
		class="inset-0 bg-black/90 fixed z-50 flex items-center justify-center"
		on:click={() => (showTrailer = false)}
	>
		<div class="max-w-5xl aspect-video px-4 relative w-full" on:click|stopPropagation>
			<button
				class="-top-10 right-0 text-gray-400 hover:text-white absolute"
				on:click={() => (showTrailer = false)}
			>
				<X size={28} />
			</button>

			<iframe
				class="rounded-lg h-full w-full"
				src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
				frameborder="0"
				allow="autoplay; encrypted-media"
				allowfullscreen
			/>
		</div>
	</div>
{/if}

<script>
	import { Heart, Star } from 'lucide-svelte';
	import { watchlist, toggleWatchlist } from '$lib/stores/watchlist';
	import { user } from '$lib/stores/auth';
	import { derived } from 'svelte/store';
	import { toastAdded, toastRemoved } from '$lib/utils/toast';

	export let movie;

	const genreMap = {
		28: 'Action',
		12: 'Adventure',
		16: 'Animation',
		35: 'Comedy',
		80: 'Crime',
		18: 'Drama',
		14: 'Fantasy',
		27: 'Horror',
		9648: 'Mystery',
		878: 'Sci-Fi',
		53: 'Thriller',
		10751: 'Family',
		10752: 'War',
		10749: 'Romance'
	};

	$: genres = movie.genre_ids
		?.map((id) => genreMap[id])
		.filter(Boolean)
		.slice(0, 2)
		.join(' • ');

	const inWatchlist = derived(watchlist, ($list) => $list.some((m) => m.id === movie.id));

	let animating = false;

	function handleWatchlist(e) {
		e.preventDefault();
		e.stopPropagation();

		const action = toggleWatchlist(movie);

		if (action === 'add') toastAdded(movie.title);
		if (action === 'remove') toastRemoved(movie.title);
	}
</script>

<a
	href={`/movie/${movie.id}`}
	class="
		group bg-gray-900 rounded-xl border-gray-800 hover:border-gray-600
		focus:ring-blue-500 block overflow-hidden
		border transition focus:ring-2
		focus:outline-none
	"
>
	<!-- Poster -->
	<div class="bg-gray-800 relative aspect-[2/3]">
		<img
			src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
			alt={movie.title}
			class="h-full w-full object-cover"
			loading="lazy"
		/>

		<!-- Rating -->
		<div
			class="top-2 left-2 bg-black/70 text-white text-xs
			       px-2 py-1 rounded-md gap-1 absolute flex items-center"
		>
			<Star size={12} class="text-yellow-400" />
			{movie.vote_average.toFixed(1)}
		</div>

		<!-- Hover overview -->
		<div
			class="
				md:block inset-0 bg-black/80 text-gray-200 text-xs
				p-3 absolute hidden opacity-0
				transition group-hover:opacity-100
			"
		>
			<p class="line-clamp-6">{movie.overview}</p>
		</div>
	</div>

	<!-- Info -->
	<div class="p-3 space-y-1 flex flex-col">
		<h3 class="text-white font-medium text-sm line-clamp-2">
			{movie.title}
		</h3>

		<div class="text-xs text-gray-400">
			{movie.release_date?.slice(0, 4)}
			{#if genres}
				<span class="mx-1">•</span>
				{genres}
			{/if}
		</div>

		<div class="mt-2 flex items-center justify-between">
			<span class="text-xs text-gray-500">
				{Math.round(movie.popularity)} popularity
			</span>

			<!-- Heart: isolated action -->
			<button on:click={handleWatchlist} class="relative transition" aria-label="Toggle watchlist">
				<Heart
					size={16}
					class="
			transition-transform duration-200
			{$inWatchlist ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 hover:text-red-400'}
		"
				/>
			</button>
		</div>
	</div></a
>

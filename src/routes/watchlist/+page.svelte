<script>
	import { watchlist, removeFromWatchlist } from '$lib/stores/watchlist';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { HeartOff, Film, Star } from 'lucide-svelte';

	$: if (!$user) {
		goto('/login');
	}
</script>

<section class="px-4 py-6 sm:px-6 lg:px-8 space-y-8 mx-auto max-w-[1400px]">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-white">Your Watchlist</h1>
			<p class="text-sm text-gray-400">Movies you've saved to watch later</p>
		</div>
	</div>

	<!-- Empty State -->
	{#if $watchlist.length === 0}
		<div
			class="py-24 text-gray-400 flex flex-col
			       items-center justify-center text-center"
		>
			<Film size={48} class="mb-4 opacity-40" />
			<p class="text-lg font-medium text-white">Your watchlist is empty</p>
			<p class="mt-2 text-sm">Start adding movies to see them here</p>
		</div>
	{:else}
		<!-- Grid -->
		<div
			class="
			sm:grid-cols-3 md:grid-cols-4
			lg:grid-cols-5
			xl:grid-cols-6
			gap-4
			grid
			grid-cols-2
		"
		>
			{#each $watchlist as movie}
				<div
					class="
			bg-gray-900 border-gray-800 rounded-xl
			group relative cursor-pointer
			overflow-hidden border
			transition hover:scale-[1.02]
		"
					on:click={() => goto(`/movie/${movie.id}`)}
				>
					<!-- Poster -->
					<img
						src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
						alt={movie.title}
						class="aspect-[2/3] w-full object-cover"
					/>

					<!-- Overlay -->
					<div
						class="
				inset-0 bg-black/70
				p-3 absolute
				flex flex-col justify-between
				opacity-0 transition
				group-hover:opacity-100
			"
					>
						<button
							on:click|stopPropagation={() => removeFromWatchlist(movie.id)}
							class="
					bg-red-500/90 hover:bg-red-500
					text-white p-2
					self-end rounded-full
				"
							title="Remove from watchlist"
						>
							<HeartOff size={16} />
						</button>

						<div>
							<h3 class="text-sm font-semibold text-white line-clamp-2">
								{movie.title}
							</h3>
							<p class="text-xs text-gray-300 mt-1 gap-2 flex items-center">
								<Star size={12} class="text-yellow-400" />
								{movie.vote_average?.toFixed(1) ?? 'N/A'}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

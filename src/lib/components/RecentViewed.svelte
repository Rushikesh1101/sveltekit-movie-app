<script>
	import { recentView, clearRecentView } from '$lib/stores/recentView';
	import { page } from '$app/stores';
</script>

{#if $page.url.pathname === '/login' && $recentView.length}
	<div class="flex h-[72vh] flex-col">
		<!-- FIXED HEADER -->
		<div class="mb-3 flex shrink-0 items-center justify-between">
			<h3 class="text-sm tracking-wide text-gray-400 uppercase">Recently Viewed</h3>

			<button
				on:click={clearRecentView}
				class="text-xs text-gray-400 hover:text-red-400 transition"
			>
				Clear all
			</button>
		</div>

		<!-- SCROLLABLE CONTENT -->
		<div class="min-h-0 hide-scrollbar flex-1 overflow-y-auto">
			<div class="gap-3 grid grid-cols-3">
				{#each $recentView as movie}
					<a
						href={`/movie/${movie.id}`}
						class="group bg-gray-900 rounded-lg border-gray-800 hover:border-gray-600 overflow-hidden border transition"
					>
						<img
							src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
							alt={movie.title}
							class="aspect-[2/3] w-full object-cover"
							loading="lazy"
						/>

						<div class="p-2">
							<p class="text-xs text-white line-clamp-2">
								{movie.title}
							</p>
							<p class="text-gray-400 text-[10px]">
								{movie.release_date?.slice(0, 4)}
							</p>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

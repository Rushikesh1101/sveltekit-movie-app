<script>
	import { page } from '$app/stores';
	import { User, Heart } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { fetchMovieCredits } from '$lib/api/tmdb';

	let credits;
	const dispatch = createEventDispatcher();
	$: id = $page.params?.id;

	$: if (id) {
		fetchMovieCredits(id).then((d) => {
			credits = d;
			dispatch('loaded');
		});
	}

	const IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';
</script>

{#if credits?.cast?.length}
	<section class="max-w-7xl px-4 py-10 mx-auto">
		<!-- Header -->
		<div class="gap-3 mb-6 flex items-center">
			<span class="w-1 h-6 bg-yellow-400 rounded"></span>
			<h3 class="text-xl font-semibold text-white">Top cast</h3>
			<span class="text-sm text-gray-400">
				{credits.cast.length}
			</span>
		</div>

		<!-- Two-column list -->
		<div class="md:grid-cols-2 gap-x-12 gap-y-6 grid grid-cols-1">
			{#each credits.cast.slice(0, 20) as person (person.credit_id)}
				<div class="gap-4 flex items-center">
					<!-- Avatar -->
					<div class="relative shrink-0">
						{#if person.profile_path}
							<img
								src={`${IMAGE_BASE}${person.profile_path}`}
								alt={person.name}
								class="w-14 h-14 rounded-full object-cover"
								loading="lazy"
							/>
						{:else}
							<div class="w-14 h-14 bg-neutral-700 flex items-center justify-center rounded-full">
								<User size={24} class="text-neutral-400" />
							</div>
						{/if}

						<!-- Heart overlay -->
						<button
							class="
								-bottom-1
								-right-1
								bg-black
								p-1
								hover:bg-neutral-800
								absolute
								rounded-full
								transition
								"
							aria-label="Add to favorites"
						>
							<Heart size={14} class="text-white" />
						</button>
					</div>

					<!-- Text -->
					<div class="leading-tight">
						<p class="text-white font-medium">
							{person.name}
						</p>
						<p class="text-gray-400 text-sm">
							{person.character}
						</p>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

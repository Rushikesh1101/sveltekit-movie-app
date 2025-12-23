<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { fetchMovieReviews } from '$lib/api/tmdb';
	import { Star, Clock, Calendar, Globe, Film, Link } from 'lucide-svelte';

	let reviews;
	const dispatch = createEventDispatcher();
	$: id = $page.params?.id;

	$: if (id) {
		fetchMovieReviews(id).then((d) => {
			reviews = d;
			dispatch('loaded');
		});
	}

	let expandedReviews = new Set();

	function toggleReview(id) {
		expandedReviews.has(id) ? expandedReviews.delete(id) : expandedReviews.add(id);

		// force reactivity
		expandedReviews = new Set(expandedReviews);
	}

	const formatDate = (d) =>
		new Date(d).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
</script>

{#if reviews?.results?.length}
	<section class="max-w-7xl px-4 py-10 mx-auto">
		<!-- Header -->
		<div class="mb-6 flex items-center justify-between">
			<h3 class="text-xl font-semibold text-white">User Reviews</h3>
			<span class="text-sm text-gray-400">
				{reviews.total_results} reviews
			</span>
		</div>

		<!-- Reviews list -->
		<div class="space-y-6">
			{#each reviews.results as r}
				<div class="bg-neutral-800 rounded-lg p-5 border-neutral-700 border">
					<!-- Author row -->
					<div class="mb-3 flex items-center justify-between">
						<div class="gap-3 flex items-center">
							{#if r.author_details.avatar_path}
								<img
									src={r.author_details.avatar_path.startsWith('/')
										? `https://image.tmdb.org/t/p/w64${r.author_details.avatar_path}`
										: r.author_details.avatar_path}
									alt={r.author}
									class="w-8 h-8 rounded-full object-cover"
								/>
							{:else}
								<div
									class="w-8 h-8 bg-neutral-600 text-sm text-white flex items-center justify-center rounded-full"
								>
									{r.author[0].toUpperCase()}
								</div>
							{/if}

							<div>
								<p class="text-white font-medium leading-none">
									{r.author}
								</p>
								<p class="text-xs text-gray-400">
									{formatDate(r.created_at)}
								</p>
							</div>
						</div>

						{#if r.author_details.rating !== null}
							<div class="gap-1 text-yellow-400 text-sm flex items-center">
								★ {r.author_details.rating}/10
							</div>
						{/if}
					</div>

					<!-- Content -->
					<div class="text-gray-300 text-sm leading-relaxed">
						<p class={expandedReviews.has(r.id) ? '' : 'line-clamp-5'}>
							{@html r.content.replace(/\n/g, '<br />')}
						</p>

						{#if r.content.length > 300}
							<button
								class="mt-2 text-blue-400 text-xs hover:underline"
								on:click={() => toggleReview(r.id)}
							>
								{expandedReviews.has(r.id) ? 'Show less' : 'Read more'}
							</button>
						{/if}
					</div>

					<!-- TMDB link -->
					<div class="mt-3">
						<a
							href={r.url}
							target="_blank"
							class="text-xs text-gray-400 hover:text-white underline"
						>
							View on TMDB
						</a>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

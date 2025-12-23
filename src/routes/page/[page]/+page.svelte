<script>
	import { page as pageStore } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fetchMovies, discoverMovies } from '$lib/api/tmdb';
	import Filters from '$lib/components/Filters.svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-svelte';

	let movies = [];
	let loading = false;

	let genre = '';
	let year = '';
	let rating = '';

	let totalPages = 1;

	// page number from URL (/page/2)
	$: currentPage = Number($pageStore.params.page) || 2;

	/* -------- READ FROM URL -------- */
	$: search = $pageStore.url.searchParams.get('q') ?? '';
	$: genre = $pageStore.url.searchParams.get('genre') ?? '';
	$: year = $pageStore.url.searchParams.get('year') ?? '';
	$: rating = $pageStore.url.searchParams.get('rating') ?? '';

	// reactive load
	$: loadMovies(search, genre, year, rating, currentPage);

	let lastKey = '';

	async function loadMovies(search, genre, year, rating, page) {
		const key = `${search}-${genre}-${year}-${rating}-${page}`;
		if (key === lastKey) return;
		lastKey = key;

		loading = true;

		try {
			let data;

			if (genre || year || rating) {
				data = await discoverMovies({
					genre,
					year,
					rating,
					page
				});
			} else {
				data = await fetchMovies(search, page);
			}

			movies = data?.results ?? [];
			totalPages = Math.min(data?.total_pages ?? 1, 500);
		} catch (err) {
			console.error('Failed to load movies', err);
			movies = [];
		} finally {
			loading = false;
		}
	}

	function onFilterChange(e) {
		const params = new URLSearchParams();

		if (search) params.set('q', search);
		if (e.detail.genre) params.set('genre', e.detail.genre);
		if (e.detail.year) params.set('year', e.detail.year);
		if (e.detail.rating) params.set('rating', e.detail.rating);

		goto(`/?${params.toString()}`);
	}
	/* ---------------- PAGINATION ---------------- */

	function goToPage(p) {
		if (p < 1 || p > totalPages || p === currentPage) return;

		const params = new URLSearchParams();

		if (search) params.set('q', search);
		if (genre) params.set('genre', genre);
		if (year) params.set('year', year);
		if (rating) params.set('rating', rating);

		const query = params.toString();
		const url = p === 1 ? `/?${query}` : `/page/${p}?${query}`;

		goto(url);
	}

	function pageRange() {
		const delta = 2;
		const range = [];
		const start = Math.max(1, currentPage - delta);
		const end = Math.min(totalPages, currentPage + delta);

		for (let i = start; i <= end; i++) range.push(i);
		return range;
	}
</script>

<section class="px-4 py-6 sm:px-6 lg:px-8 space-y-8 mx-auto max-w-[1400px]">
	<!-- Filters -->
	<div class="rounded-xl border-gray-800 bg-gray-900/80 backdrop-blur border">
		<Filters bind:genre bind:year bind:rating />
	</div>

	<!-- Loading -->
	{#if loading}
		<div class="space-y-6">
			<div class="gap-3 text-gray-400 flex items-center justify-center">
				<!-- svelte-ignore element_invalid_self_closing_tag -->
				<span
					class="w-5 h-5 border-gray-400 animate-spin rounded-full border-2 border-t-transparent"
				/>
				<span>Fetching movies…</span>
			</div>

			<div
				class="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 grid grid-cols-2"
			>
				{#each Array(12) as _}
					<div class="bg-gray-900 border-gray-800 rounded-xl animate-pulse overflow-hidden border">
						<!-- svelte-ignore element_invalid_self_closing_tag -->
						<div class="bg-gray-800 aspect-[2/3]" />
						<div class="p-3 space-y-2">
							<!-- svelte-ignore element_invalid_self_closing_tag -->
							<div class="h-4 bg-gray-800 rounded w-3/4" />
							<!-- svelte-ignore element_invalid_self_closing_tag -->
							<div class="h-3 bg-gray-800 rounded w-1/2" />
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Movies -->
	{#if !loading && movies.length > 0}
		<div class="sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 grid grid-cols-2">
			{#each movies as movie}
				<MovieCard {movie} />
			{/each}
		</div>

		<!-- Pagination -->
		<div class="gap-2 pt-6 text-sm text-gray-300 flex flex-wrap items-center justify-center">
			<button
				class="px-3 py-1 border-gray-700 rounded gap-2 hover:bg-gray-800 flex items-center border disabled:opacity-40"
				disabled={currentPage === 1}
				on:click={() => goToPage(1)}
			>
				<ChevronsLeft size={16} />
				<span class="mb-1"> First </span>
			</button>

			<button
				class="px-3 py-1 border-gray-700 rounded gap-2 hover:bg-gray-800 flex items-center border disabled:opacity-40"
				disabled={currentPage === 1}
				on:click={() => goToPage(currentPage - 1)}
			>
				<ChevronLeft size={16} />
				<span class="mb-1"> Prev </span>
			</button>

			{#if pageRange()[0] > 1}
				<span>…</span>
			{/if}

			{#each pageRange() as p}
				<button
					class="px-3 py-1 rounded border
						{p === currentPage
						? 'bg-blue-600 border-blue-600 text-white'
						: 'border-gray-700 hover:bg-gray-800'}"
					on:click={() => goToPage(p)}
				>
					{p}
				</button>
			{/each}

			{#if pageRange().at(-1) < totalPages}
				<span>…</span>
				<button
					class="px-3 py-1 border-gray-700 rounded hover:bg-gray-800 border"
					on:click={() => goToPage(totalPages)}
				>
					{totalPages}
				</button>
			{/if}

			<button
				class="px-3 py-1 border-gray-700 rounded gap-2 hover:bg-gray-800 flex items-center border disabled:opacity-40"
				disabled={currentPage === totalPages}
				on:click={() => goToPage(currentPage + 1)}
			>
				<span class="mb-1"> Next </span>
				<ChevronRight size={16} />
			</button>

			<button
				class="px-3 py-1 border-gray-700 rounded gap-2 hover:bg-gray-800 flex items-center border disabled:opacity-40"
				disabled={currentPage === totalPages}
				on:click={() => goToPage(totalPages)}
			>
				<span class="mb-1"> Last </span>

				<ChevronsRight size={16} />
			</button>
		</div>
	{/if}

	<!-- Empty -->
	{#if !loading && movies.length === 0}
		<div class="py-24 text-gray-400 text-center">No movies found.</div>
	{/if}
</section>

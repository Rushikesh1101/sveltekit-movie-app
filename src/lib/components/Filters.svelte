<script>
	import { Film, Calendar, Star, X } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { page as pageStore } from '$app/stores';

	export let genre = '';
	export let year = '';
	export let rating = '';

	const genreMap = [
		{ id: '28', name: 'Action' },
		{ id: '12', name: 'Adventure' },
		{ id: '16', name: 'Animation' },
		{ id: '35', name: 'Comedy' },
		{ id: '80', name: 'Crime' },
		{ id: '99', name: 'Documentary' },
		{ id: '18', name: 'Drama' },
		{ id: '10751', name: 'Family' },
		{ id: '14', name: 'Fantasy' },
		{ id: '36', name: 'History' },
		{ id: '27', name: 'Horror' },
		{ id: '10402', name: 'Music' },
		{ id: '9648', name: 'Mystery' },
		{ id: '10749', name: 'Romance' },
		{ id: '878', name: 'Science Fiction' },
		{ id: '10770', name: 'TV Movie' },
		{ id: '53', name: 'Thriller' },
		{ id: '10752', name: 'War' },
		{ id: '37', name: 'Western' }
	];

	/* READ FROM URL (STRING SAFE) */
	$: genre = $pageStore.url.searchParams.get('genre') ?? '';
	$: year = $pageStore.url.searchParams.get('year') ?? '';
	$: rating = $pageStore.url.searchParams.get('rating') ?? '';

	function onFilterChange() {
		const params = new URLSearchParams();

		if (genre) params.set('genre', genre);
		if (year) params.set('year', year);
		if (rating) params.set('rating', rating);

		goto(`/?${params.toString()}`, {
			replaceState: true,
			noscroll: true
		});
	}

	function clear() {
		genre = '';
		year = '';
		rating = '';
		goto('/', { replaceState: true, noscroll: true });
	}

	$: hasActiveFilters = !!(genre || year || rating);
</script>

<div
	class="bg-gray-900 border-gray-800 rounded-xl p-4 sm:flex-row gap-4 sm:items-center sm:justify-between flex flex-col border"
>
	<div class="gap-3 flex flex-wrap">
		<!-- Genre -->
		<div class="relative">
			<Film class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
			<select
				bind:value={genre}
				on:change={onFilterChange}
				class="bg-gray-800 text-gray-100 text-sm px-3 py-2 pl-9 rounded-lg border-gray-700 focus:ring-blue-500 border focus:ring-2"
			>
				<option value="">All Genres</option>
				{#each genreMap as g}
					<option value={g.id}>{g.name}</option>
				{/each}
			</select>
		</div>

		<!-- Year -->
		<div class="relative">
			<Calendar class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
			<select
				bind:value={year}
				on:change={onFilterChange}
				class="bg-gray-800 text-gray-100 text-sm px-3 py-2 pl-9 rounded-lg border-gray-700 focus:ring-blue-500 border focus:ring-2"
			>
				<option value="">Year</option>
				{#each Array(26) as _, i}
					<option value={`${2025 - i}`}>{2025 - i}</option>
				{/each}
			</select>
		</div>

		<!-- Rating -->
		<div class="relative">
			<Star class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
			<select
				bind:value={rating}
				on:change={onFilterChange}
				class="bg-gray-800 text-gray-100 text-sm px-3 py-2 pl-9 rounded-lg border-gray-700 focus:ring-blue-500 border focus:ring-2"
			>
				<option value="">Rating</option>
				<option value="3">3+</option>
				<option value="5">5+</option>
				<option value="6">6+</option>
				<option value="7">7+</option>
				<option value="8">8+</option>
				<option value="9">9+</option>
			</select>
		</div>
	</div>

	<button
		on:click={clear}
		disabled={!hasActiveFilters}
		class="gap-2 px-4 py-2 text-sm rounded-lg border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 flex items-center border disabled:opacity-40"
	>
		<X size={16} />
		Clear Filters
	</button>
</div>

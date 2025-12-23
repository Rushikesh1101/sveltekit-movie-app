<script>
	import { onMount } from 'svelte';
	import { fetchMovieImgs } from '$lib/api/tmdb';
	import { Images, X } from 'lucide-svelte';

	export let id;

	let imgs = null;
	let open = false;
	let activeTab = 'all';
	let preview = null;
	let loadedId = null;

	const IMAGE_BASE = 'https://image.tmdb.org/t/p';

	async function loadImages(movieId) {
		if (!movieId || movieId === loadedId) return;
		loadedId = movieId;

		const d = await fetchMovieImgs(movieId);
		imgs = d || { backdrops: [], posters: [], logos: [] };
	}

	onMount(() => loadImages(id));

	$: if (id && id !== loadedId) loadImages(id);

	$: total =
		(imgs?.backdrops?.length || 0) + (imgs?.posters?.length || 0) + (imgs?.logos?.length || 0);

	/* REACTIVE IMAGE LIST */
	$: visibleImages = !imgs
		? []
		: activeTab === 'backdrops'
			? imgs.backdrops
			: activeTab === 'posters'
				? imgs.posters
				: activeTab === 'logos'
					? imgs.logos
					: [...imgs.backdrops, ...imgs.posters, ...imgs.logos];

	/* RESET TAB ON OPEN */
	function openGallery() {
		activeTab = 'all';
		preview = null;
		open = true;
	}
</script>

<!-- ENTRY -->
<button
	on:click={openGallery}
	class="h-24 rounded-2xl from-neutral-700/70 to-neutral-900
	       hover:from-neutral-600/80 hover:to-neutral-800
	       text-white gap-2
	       flex w-full flex-col items-center justify-center bg-gradient-to-br transition"
>
	<div class="w-12 h-12 bg-white/10 flex items-center justify-center rounded-full">
		<Images size={22} />
	</div>
	<span class="text-xs tracking-widest uppercase">
		{total} Photos
	</span>
</button>

{#if open}
	<div class="inset-0 bg-black/85 fixed z-50 flex">
		<div
			class="bg-neutral-900 max-w-7xl my-8 rounded-2xl border-neutral-800
			       mx-auto flex w-full
			       flex-col overflow-hidden border"
		>
			<!-- HEADER -->
			<div class="px-6 py-4 border-neutral-800 flex justify-between border-b">
				<h2 class="text-lg font-semibold text-white">
					Photos ({total})
				</h2>
				<button on:click={() => (open = false)} class="text-gray-400 hover:text-white">
					<X size={22} />
				</button>
			</div>

			<div class="flex flex-1 overflow-hidden">
				<!-- SIDEBAR -->
				<div class="w-48 border-neutral-800 p-4 space-y-1 border-r">
					<button
						on:click={() => (activeTab = 'all')}
						class="sidebar-btn"
						class:active={activeTab === 'all'}
					>
						All ({total})
					</button>

					<button
						on:click={() => (activeTab = 'backdrops')}
						class="sidebar-btn"
						class:active={activeTab === 'backdrops'}
					>
						Backdrops ({imgs?.backdrops.length || 0})
					</button>

					<button
						on:click={() => (activeTab = 'posters')}
						class="sidebar-btn"
						class:active={activeTab === 'posters'}
					>
						Posters ({imgs?.posters.length || 0})
					</button>

					<button
						on:click={() => (activeTab = 'logos')}
						class="sidebar-btn"
						class:active={activeTab === 'logos'}
					>
						Logos ({imgs?.logos.length || 0})
					</button>
				</div>

				<!-- GRID -->
				<div class="p-4 flex-1 overflow-y-auto">
					{#if visibleImages.length === 0}
						<p class="text-gray-400 text-sm mt-10 text-center">No images available</p>
					{:else}
						<div class="sm:grid-cols-3 md:grid-cols-4 gap-4 grid grid-cols-2">
							{#each visibleImages as img}
								<button
									on:click={() => (preview = img)}
									class="rounded-lg bg-neutral-800 hover:ring-yellow-400
									       overflow-hidden transition hover:ring-2"
								>
									<img
										src={`${IMAGE_BASE}/w780${img.file_path}`}
										class="h-full w-full object-cover"
										loading="lazy"
										alt=""
									/>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		{#if preview}
			<div
				class="inset-0 bg-black/90 fixed z-50 flex items-center justify-center"
				on:click={() => (preview = null)}
			>
				<img
					src={`${IMAGE_BASE}/original${preview.file_path}`}
					class="rounded-xl max-h-[90vh] max-w-[90vw]"
					alt=""
				/>
			</div>
		{/if}
	</div>
{/if}

<style>
	.sidebar-btn {
		width: 100%;
		padding: 8px 12px;
		border-radius: 6px;
		font-size: 14px;
		color: #9ca3af;
		text-align: left;
		transition: "background 0.15s";
	}
	.sidebar-btn:hover {
		background: #262626;
	}
	.sidebar-btn.active {
		background: #262626;
		color: white;
	}
</style>

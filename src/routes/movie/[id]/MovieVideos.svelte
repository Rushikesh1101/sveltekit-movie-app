<script>
	import { onMount } from 'svelte';
	import { fetchMovieVideos } from '$lib/api/tmdb';
	import { Play, X, Film } from 'lucide-svelte';

	export let id;

	let vids = [];
	let open = false;
	let active = null;
	let loadedId = null;

	const ytThumb = (key) => `https://img.youtube.com/vi/${key}/hqdefault.jpg`;

	async function loadVideos(movieId) {
		if (!movieId || movieId === loadedId) return;

		loadedId = movieId;

		const d = await fetchMovieVideos(movieId);
		vids = (d?.results || []).filter((v) => v.site === 'YouTube');

		active =
			vids.find((v) => v.type === 'Trailer') ||
			vids.find((v) => v.type === 'Teaser') ||
			vids[0] ||
			null;
	}

	onMount(() => {
		loadVideos(id);
	});

	$: if (id && id !== loadedId) {
		loadVideos(id);
	}
</script>

<!-- ================= ENTRY BUTTON ================= -->
<button
	on:click={() => (open = true)}
	class="h-24 rounded-2xl from-neutral-700/70 to-neutral-900
	       hover:from-neutral-600/80 hover:to-neutral-800
	       text-white gap-2
	       flex w-full flex-col items-center justify-center bg-gradient-to-br transition"
>
	<Play size={28} />
	<span class="text-sm tracking-wide">{vids.length} Videos</span>
</button>

<!-- ================= PANEL ================= -->
{#if open}
	<div class="inset-0 bg-black/80 fixed z-50 flex items-center justify-center">
		<div
			class="bg-neutral-900 max-w-7xl rounded-2xl border-neutral-800
			       flex h-[85vh] w-full flex-col overflow-hidden border"
		>
			<!-- Header -->
			<div class="px-6 py-4 border-neutral-800 flex items-center justify-between border-b">
				<h2 class="text-lg font-semibold text-white gap-2 flex items-center">
					<Film size={18} />
					Videos
				</h2>
				<button on:click={() => (open = false)} class="text-gray-400 hover:text-white">
					<X size={22} />
				</button>
			</div>

			<!-- Content -->
			<div class="flex flex-1 overflow-hidden">
				<!-- PLAYER -->
				<div class="p-4 w-2/3">
					{#if active}
						<div class="aspect-video rounded-xl bg-black overflow-hidden">
							<iframe
								class="h-full w-full"
								src={`https://www.youtube.com/embed/${active.key}`}
								frameborder="0"
								allow="encrypted-media"
								allowfullscreen
							/>
						</div>

						<div class="mt-4">
							<h3 class="text-white font-semibold">{active.name}</h3>
							<p class="text-xs text-gray-400 uppercase">
								{active.type} • YouTube
							</p>
						</div>
					{/if}
				</div>

				<!-- LIST -->
				<div class="border-neutral-800 w-1/3 overflow-y-auto border-l">
					{#each vids as v}
						<button
							on:click={() => (active = v)}
							class="p-3 gap-3 hover:bg-neutral-800 flex w-full
							       text-left transition
							       {v.key === active?.key ? 'bg-neutral-800' : ''}"
						>
							<img src={ytThumb(v.key)} alt={v.name} class="w-28 rounded-md object-cover" />

							<div>
								<p class="text-sm text-white line-clamp-2">
									{v.name}
								</p>
								<p class="text-xs text-gray-400 mt-1">
									{v.type}
								</p>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

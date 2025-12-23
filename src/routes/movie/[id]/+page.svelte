<script>
	import MovieReview from './MovieReview.svelte';
	import MovieHeader from './MovieDetails.svelte';
	import MovieCast from './MovieCast.svelte';
	import { page } from '$app/stores';

	let id;
	$: id = $page.params?.id;

	let headerLoaded = false;
	let castLoaded = false;
	let reviewLoaded = false;

	$: pageReady = headerLoaded && castLoaded && reviewLoaded;
</script>

<!-- ================= PAGE SKELETON OVERLAY ================= -->
{#if !pageReady}
	<section class="inset-0 bg-neutral-900 fixed z-40">
		<div class="max-w-7xl px-4 py-8 space-y-8 animate-pulse mx-auto">
			<div class="space-y-4">
				<div class="h-8 bg-neutral-800 rounded w-2/3"></div>
				<div class="h-4 bg-neutral-800 rounded w-1/3"></div>
			</div>

			<div class="lg:grid-cols-[220px_1fr_280px] gap-6 grid grid-cols-1">
				<div class="bg-neutral-800 rounded-lg aspect-[2/3]"></div>
				<div class="aspect-video bg-neutral-800 rounded-lg"></div>
				<div class="space-y-4">
					<div class="h-12 bg-neutral-800 rounded"></div>
					<div class="h-12 bg-neutral-800 rounded"></div>
				</div>
			</div>

			<div class="gap-4 flex">
				{#each Array(6) as _}
					<div class="w-24 h-36 bg-neutral-800 rounded"></div>
				{/each}
			</div>

			<div class="space-y-3">
				<div class="h-4 bg-neutral-800 rounded w-full"></div>
				<div class="h-4 bg-neutral-800 rounded w-5/6"></div>
				<div class="h-4 bg-neutral-800 rounded w-4/6"></div>
			</div>
		</div>
	</section>
{/if}

<!-- ================= ACTUAL CONTENT (ALWAYS RENDERED) ================= -->
<div class={pageReady ? 'opacity-100' : 'pointer-events-none opacity-0'}>
	<MovieHeader {id} on:loaded={() => (headerLoaded = true)} />
	<MovieCast {id} on:loaded={() => (castLoaded = true)} />
	<MovieReview {id} on:loaded={() => (reviewLoaded = true)} />
</div>

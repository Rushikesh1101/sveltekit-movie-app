<script>
	import { onMount } from 'svelte';

	let show = false;

	onMount(() => {
		requestAnimationFrame(() => {
			show = true;
		});
	});
</script>

<a href="/" aria-label="MovieHub Home" class="gap-2 flex items-center select-none">
	<!-- Icon -->
	<span
		class="
			w-9 h-9 rounded-lg
			from-yellow-400 to-yellow-500 text-black
			shadow-md ease-out flex
			transform items-center
			justify-center bg-gradient-to-br transition-all duration-500
			{show ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
		"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="w-5 h-5 fill-black">
			<path
				d="m480-420 240-160-240-160v320Zm28 220h224q-7 26-24 42t-44 20L228-85q-33 5-59.5-15.5T138-154L85-591q-4-33 16-59t53-30l46-6v80l-36 5 54 437 290-36Zm-148-80q-33 0-56.5-23.5T280-360v-440q0-33 23.5-56.5T360-880h440q33 0 56.5 23.5T880-800v440q0 33-23.5 56.5T800-280H360Z"
			/>
		</svg>
	</span>

	<!-- Text -->
	<span
		class="
			gap-1 font-bold tracking-tight ease-out flex
			transform items-baseline transition-all delay-100 duration-500
			{show ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
		"
	>
		<span class="text-white text-lg">Movie</span>
		<span class="text-yellow-400 text-lg">Hub</span>
	</span>
</a>

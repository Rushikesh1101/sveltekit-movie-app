<script>
	export let message = 'API not working.';
	export let showDnsHelp = true;
</script>

<div class="rounded-xl border-red-800 bg-red-900/20 p-6 text-red-300 max-w-3xl mx-auto border">
	<h2 class="text-lg font-semibold text-red-200 mb-2">Service Unavailable</h2>

	<p class="mb-4">
		{message}
	</p>

	<p class="mb-2">Please check your network connection or visit:</p>

	<a
		href="https://www.themoviedb.org/"
		target="_blank"
		rel="noopener noreferrer"
		class="text-red-200 hover:text-white underline"
	>
		https://www.themoviedb.org/
	</a>

	{#if showDnsHelp}
		<div class="mt-4 text-sm text-red-300 space-y-1">
			<p>If the website does not open, try switching DNS:</p>
			<ul class="list-inside list-disc">
				<li>Google DNS: <strong>8.8.8.8</strong> / <strong>8.8.4.4</strong></li>
				<li>Cloudflare DNS: <strong>1.1.1.1</strong> / <strong>1.0.0.1</strong></li>
			</ul>
		</div>
	{/if}
</div>

<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { user, logout } from '$lib/stores/auth';
	import { watchlistCount } from '$lib/stores/watchlist';
	import AnimatedLogo from '$lib/components/AnimatedLogo.svelte';
	import { Search, User, Heart, LogIn, LogOut } from 'lucide-svelte';

	let search = '';
	let lastUrlQuery = '';
	let loading = false;
	let inputEl;
	let containerEl;
	let showRecent = false;
	const count = watchlistCount();

	const RECENT_KEY = 'recent_searches';
	const MAX_RECENT = 5;
	let recent = [];

	/* ---------- URL INPUT (SAFE, ONE-WAY) ---------- */
	$: {
		const q = $page.url.searchParams.get('q') ?? '';
		if (q !== lastUrlQuery) {
			lastUrlQuery = q;
			search = q;
		}
	}

	/* ---------- RECENT SEARCHES ---------- */
	function loadRecent() {
		if (!browser) return;
		try {
			recent = JSON.parse(localStorage.getItem(RECENT_KEY)) ?? [];
		} catch {
			recent = [];
		}
	}

	function saveRecent(value) {
		if (!browser || !value) return;
		recent = [value, ...recent.filter((r) => r !== value)].slice(0, MAX_RECENT);
		localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
	}

	/* ---------- SEARCH ---------- */
	async function submitSearch() {
		const value = search.trim();
		showRecent = false;
		loading = true;

		saveRecent(value);

		await goto(value ? `/?q=${encodeURIComponent(value)}` : '/', {
			replaceState: true,
			noscroll: true
		});

		loading = false;
	}

	function clearSearch() {
		search = '';
		showRecent = false;

		goto('/', {
			replaceState: true,
			noscroll: true
		});

		inputEl?.focus();
	}

	function handleKeydown(e) {
		if (e.key === 'Enter') submitSearch();
	}

	/* ---------- SHORTCUTS ---------- */
	function handleGlobalKey(e) {
		if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
			e.preventDefault();
			inputEl?.focus();
			if (recent.length && !search) showRecent = true;
		}
	}

	/* ---------- CLICK OUTSIDE ---------- */
	function handleClickOutside(e) {
		if (!containerEl?.contains(e.target)) {
			showRecent = false;
		}
	}

	/* ---------- USER MENU ---------- */
	let showUserMenu = false;
	let userMenuEl;

	function toggleUserMenu() {
		showUserMenu = !showUserMenu;
	}

	function handleUserMenuClickOutside(e) {
		if (!userMenuEl?.contains(e.target)) {
			showUserMenu = false;
		}
	}

	/* ---------- INIT ---------- */
	onMount(() => {
		if (!browser) return;
		loadRecent();
		window.addEventListener('keydown', handleGlobalKey);
		window.addEventListener('click', handleClickOutside);
		window.addEventListener('click', handleUserMenuClickOutside);
	});

	/* ---------- CLEANUP ---------- */

	onDestroy(() => {
		if (!browser) return;
		window.removeEventListener('keydown', handleGlobalKey);
		window.removeEventListener('click', handleClickOutside);
		window.removeEventListener('click', handleUserMenuClickOutside);
	});
</script>

<header class="top-0 bg-gray-900 border-gray-800 sticky z-50 border-b">
	<div class="max-w-7xl px-4 py-3 gap-4 mx-auto flex items-center justify-between">
		<!-- Logo -->
		<AnimatedLogo />

		<!-- Search -->
		<div bind:this={containerEl} class="max-w-xl relative flex-1">
			<Search class="left-3 top-2.5 h-5 w-5 text-gray-400 absolute" />

			<input
				bind:this={inputEl}
				bind:value={search}
				on:keydown={handleKeydown}
				on:focus={() => recent.length && !search && (showRecent = true)}
				placeholder="Search movies… ( / or Ctrl + K )"
				class="bg-gray-800 text-white pl-10 pr-10 py-2 rounded-md focus:ring-blue-500
				       w-full focus:ring-2 focus:outline-none"
			/>

			<button
				class="right-2 top-2 p-1 rounded hover:bg-gray-700 absolute transition"
				on:click={() => (search ? clearSearch() : submitSearch())}
			>
				{#if loading}
					<!-- svelte-ignore element_invalid_self_closing_tag -->
					<span
						class="w-4 h-4 border-white animate-spin block rounded-full border-2 border-t-transparent"
					/>
				{:else if search}
					<!-- Clear -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						class="w-4 h-4 text-gray-300 hover:text-white"
						fill="currentColor"
					>
						<path
							d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 1 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"
						/>
					</svg>
				{:else}
					<Search size={16} class="text-gray-300" />
				{/if}
			</button>

			<!-- Recent Searches -->
			{#if showRecent && recent.length && !search}
				<div
					class="mt-2 bg-gray-800 border-gray-700 rounded-md shadow-lg absolute z-50 w-full border"
				>
					{#each recent as r}
						<button
							class="px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
							on:click={() => {
								search = r;
								submitSearch();
							}}
						>
							{r}
						</button>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Actions -->
		<div class="gap-4 flex items-center">
			<a href="/watchlist" class="gap-1 text-gray-300 hover:text-white relative flex items-center">
				<Heart size={18} />

				<!-- Label -->
				<span class="md:block hidden">Watchlist</span>

				<!-- Badge -->
				{#if $count > 0}
					<span
						class="
				-top-1 -right-2 px-1
				bg-red-500 text-white
				font-semibold
				absolute
				flex
				h-[18px] min-w-[18px]
				items-center
				justify-center rounded-full text-[11px]
				leading-none
			"
					>
						{$count}
					</span>
				{/if}
			</a>

			{#if $user}
				<div class="relative" bind:this={userMenuEl}>
					<button
						on:click={toggleUserMenu}
						class="gap-2 text-gray-300 hover:text-white flex items-center transition"
					>
						<User size={18} />
						<span class="md:block font-medium hidden">{$user.name}</span>
					</button>

					{#if showUserMenu}
						<div
							class="right-0 mt-3 w-56 bg-gray-900
				       border-gray-800 rounded-xl shadow-xl
				       absolute z-50 overflow-hidden
				       border"
						>
							<!-- User info -->
							<div class="px-4 py-3 border-gray-800 border-b">
								<p class="text-sm font-medium text-white truncate">
									{$user.name}
								</p>
								<p class="text-xs text-gray-400 truncate">
									{$user.email}
								</p>
							</div>

							<a
								href="/watchlist"
								class="px-4 py-2 text-sm text-yellow-400 hover:bg-gray-800
					       hover:text-yellow-300 flex w-full justify-between text-left
					       transition"
							>
								<span class="gap-2 flex items-center">
									<Heart size={18} />
									<span class="md:block hidden">Watchlist</span>
								</span>
								{#if $count > 0}
									<span
										class="
											 px-1
											bg-red-500 text-white
											font-semibold
											flex
											h-[18px] min-w-[18px]
											items-center
											justify-center rounded-full text-[11px]
											leading-none
										"
									>
										{$count}
									</span>
								{/if}
							</a>

							<!-- Actions -->
							<button
								on:click={() => {
									showUserMenu = false;
									logout();
								}}
								class="px-4 py-2 text-sm text-red-400 hover:bg-gray-800
					       hover:text-red-300 gap-2 flex w-full items-center text-left
					       transition"
							>
								<LogOut size={18} />
								Logout
							</button>
						</div>
					{/if}
				</div>
			{:else}
				<a href="/login" class="gap-1 text-gray-300 hover:text-white flex items-center">
					<LogIn size={18} />
					Login
				</a>
			{/if}
		</div>
	</div>
</header>

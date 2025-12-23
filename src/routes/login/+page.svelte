<script>
	import { login } from '$lib/stores/auth';
	import RecentViewed from '$lib/components/RecentViewed.svelte';
	import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-svelte';

	let email = '';
	let password = '';
	let loading = false;
	let showPassword = false;
	let error = '';

	async function handleLogin() {
		error = '';
		loading = true;
		try {
			await login(email, password);
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<!-- PAGE LOCK -->
<main
	class="
		from-black
		via-gray-900
		to-black px-4 flex min-h-screen
		items-center justify-center overflow-hidden
		bg-gradient-to-br
	"
>
	<!-- svelte-ignore element_invalid_self_closing_tag -->
	<div
		class="
			inset-0 blur-sm
			absolute
			bg-[url('/imgs/loginBG.jpg')]
			bg-cover
			bg-no-repeat
			mix-blend-screen
		"
	/>
	<!-- FIXED HEIGHT CARD -->
	<div
		class="
			max-w-6xl lg:grid-cols-2
			bg-gray-900/70
			backdrop-blur-xl border-gray-800 rounded-3xl
			shadow-2xl grid
			h-[90vh] w-full
			grid-cols-1 overflow-hidden
			border
		"
	>
		<!-- ================= LEFT : RECENT VIEWED (SCROLL ONLY LIST) ================= -->
		<div
			class="
		lg:flex p-8
		from-gray-900 to-black
		border-gray-800 hidden
		flex-col
		border-r
		bg-gradient-to-br
	"
		>
			<!-- FIXED HEADER -->
			<h2 class="text-xl font-semibold text-white mb-1 shrink-0">Continue Watching</h2>
			<p class="text-sm text-gray-400 mb-6 shrink-0">Pick up where you left off</p>

			<!-- SCROLLABLE AREA ONLY -->
			<div class="hide-scrollbar flex-1 overflow-y-auto">
				<RecentViewed />
			</div>
		</div>

		<!-- ================= RIGHT : LOGIN (NO SCROLL EVER) ================= -->
		<div class="p-8 flex items-center justify-center">
			<div class="max-w-md w-full">
				<div class="mb-8 text-center">
					<h1 class="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
					<p class="mt-2 text-sm text-gray-400">Sign in to continue to MovieHub</p>
				</div>

				<form class="space-y-5" on:submit|preventDefault={handleLogin}>
					<!-- Email -->
					<div class="relative">
						<Mail class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
						<input
							type="email"
							bind:value={email}
							on:input={() => (error = '')}
							placeholder="Email address"
							required
							class="
								bg-gray-800 text-white placeholder-gray-500
								pl-10
								pr-4 py-2.5 rounded-lg
								border-gray-700 focus:ring-yellow-400 w-full
								border focus:ring-2
								focus:outline-none
							"
						/>
					</div>

					<!-- Password -->
					<div class="relative">
						<Lock class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
						<input
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							on:input={() => (error = '')}
							placeholder="Password"
							required
							class="
								bg-gray-800 text-white placeholder-gray-500
								pl-10
								pr-10 py-2.5 rounded-lg
								border-gray-700 focus:ring-yellow-400 w-full
								border focus:ring-2
								focus:outline-none
							"
						/>
						<button
							type="button"
							class="right-3 text-gray-400 hover:text-white absolute top-1/2 -translate-y-1/2"
							on:click={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff size={18} />
							{:else}
								<Eye size={18} />
							{/if}
						</button>
					</div>

					{#if error}
						<p class="text-sm text-red-400 text-center">{error}</p>
					{/if}

					<button
						type="submit"
						disabled={loading}
						class="
							mt-2 bg-yellow-400
							hover:bg-yellow-300 text-black
							font-semibold py-2.5
							rounded-lg gap-2
							flex w-full items-center justify-center
							transition active:scale-[0.98]
							disabled:opacity-60
						"
					>
						{#if loading}
							<!-- svelte-ignore element_invalid_self_closing_tag -->
							<span
								class="w-4 h-4 border-black animate-spin rounded-full border-2 border-t-transparent"
							/>
						{:else}
							<LogIn size={18} />
							<span>Sign In</span>
						{/if}
					</button>
				</form>

				<div class="mt-8 text-sm text-gray-400 text-center">
					Don't have an account?
					<a href="/signup" class="text-yellow-400 hover:underline"> Create one </a>
				</div>
			</div>
		</div>
	</div>
</main>

<script>
	import { signup } from '$lib/stores/auth';
	import { Mail, Lock, User, UserPlus } from 'lucide-svelte';

	let name = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	async function handleSignup() { 
		error = '';

		if (!name || !email || !password || !confirmPassword) {
			error = 'All fields are required';
			return;
		}

		if (!emailRegex.test(email)) {
			error = 'Please enter a valid email address';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		loading = true;

		try {
			await signup({ name, email, password });
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	}
</script>

<main
	class="from-black via-gray-900 to-black px-4 flex
	       min-h-screen items-center justify-center bg-gradient-to-br"
>
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
	<!-- Card -->
	<div
		class="max-w-md bg-gray-900/80 backdrop-blur-xl border-gray-800
		       rounded-2xl shadow-2xl p-8 w-full border"
	>
		<!-- Header -->
		<div class="mb-8 text-center">
			<h1 class="text-2xl font-bold text-white tracking-tight">Create your account</h1>
			<p class="mt-2 text-sm text-gray-400">Join MovieHub and start building your watchlist</p>
		</div>

		<!-- FORM -->
		<form class="space-y-5" on:submit|preventDefault={handleSignup}>
			<!-- Name -->
			<div class="relative">
				<User class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
				<input
					type="text"
					bind:value={name}
					placeholder="Full name"
					required
					class="bg-gray-800 text-white placeholder-gray-500 pl-10
					       pr-4 py-2.5 rounded-lg border-gray-700 focus:ring-yellow-400 w-full
					       border focus:ring-2 focus:outline-none"
				/>
			</div>

			<!-- Email -->
			<div class="relative">
				<Mail class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
				<input
					type="email"
					bind:value={email}
					placeholder="Email address"
					required
					pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
					title="Please enter a valid email address"
					class="bg-gray-800 text-white placeholder-gray-500 pl-10
	       pr-4 py-2.5 rounded-lg border-gray-700 focus:ring-yellow-400 w-full
	       border focus:ring-2 focus:outline-none"
				/>
			</div>

			<!-- Password -->
			<div class="relative">
				<Lock class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
				<input
					type="password"
					bind:value={password}
					placeholder="Password"
					required
					class="bg-gray-800 text-white placeholder-gray-500 pl-10
					       pr-4 py-2.5 rounded-lg border-gray-700 focus:ring-yellow-400 w-full
					       border focus:ring-2 focus:outline-none"
				/>
			</div>

			<!-- Confirm Password -->
			<div class="relative">
				<Lock class="left-3 w-4 h-4 text-gray-400 absolute top-1/2 -translate-y-1/2" />
				<input
					type="password"
					bind:value={confirmPassword}
					placeholder="Confirm password"
					required
					class="bg-gray-800 text-white placeholder-gray-500 pl-10
					       pr-4 py-2.5 rounded-lg border-gray-700 focus:ring-yellow-400 w-full
					       border focus:ring-2 focus:outline-none"
				/>
			</div>

			<!-- Error -->
			{#if error}
				<p class="text-sm text-red-400 text-center">
					{error}
				</p>
			{/if}

			<!-- Button -->
			<button
				type="submit"
				disabled={loading}
				class="mt-2 bg-yellow-400 hover:bg-yellow-300 text-black
				       font-semibold py-2.5 rounded-lg gap-2
				       flex w-full items-center justify-center
				       transition active:scale-[0.98]
				       disabled:opacity-60"
			>
				{#if loading}
					<span
						class="w-4 h-4 border-black animate-spin rounded-full
						       border-2 border-t-transparent"
					/>
				{:else}
					<UserPlus size={18} />
					<span>Create Account</span>
				{/if}
			</button>
		</form>

		<!-- Footer -->
		<div class="mt-8 text-sm text-gray-400 text-center">
			Already have an account?
			<a href="/login" class="text-yellow-400 hover:underline"> Sign in </a>
		</div>
	</div>
</main>

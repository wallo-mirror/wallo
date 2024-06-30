<script lang="ts">
	import logo from '$lib/assets/logo.svg';

	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import ThemeSwitch from '$lib/components/ui/theme-switch/theme-switch.svelte';
</script>

<div class="border-b-2">
	<header class="container flex max-w-screen-xl gap-2 py-2">
		<nav class=" contents">
			<a class="flex items-center gap-1 text-3xl font-extrabold" href="/">
				<img src={logo} alt="Wallo Logo" style:height="1.25em" style:width="1.25em" />
				Wallo
			</a>
			<div class=" ms-auto">
				<Button on:click={() => goto('/dashboard')}>Dashboard</Button>
			</div>
		</nav>
		<ThemeSwitch></ThemeSwitch>
	</header>
</div>

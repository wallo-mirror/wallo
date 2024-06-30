<script lang="ts">
	import type { LayoutData } from './$types';
	import * as Avatar from '$lib/components/ui/avatar';
	import ThemeSwitch from '$lib/components/ui/theme-switch/theme-switch.svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { signOut } from '@auth/sveltekit/client';
	import Logo from '$lib/logo.svelte';

	export let data: LayoutData;
</script>

<div class="border-b-2">
	<header class="container flex max-w-screen-xl gap-2 py-2">
		<nav class="contents">
			<a class="me-auto flex items-center gap-1 text-3xl font-extrabold" href="/dashboard">
				<Logo></Logo>
				Wallo
			</a>
		</nav>
		<ThemeSwitch></ThemeSwitch>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root>
					<Avatar.Image src={data.session?.user?.image} alt={data.session?.user?.name} />
					<Avatar.Fallback
						>{data.session?.user?.name
							?.trim()
							.split(' ')
							.map((s) => s[0])
							.join('')}</Avatar.Fallback
					>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label>My Account</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Item
						on:click={() =>
							signOut({
								callbackUrl: '/'
							})}>Logout</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</header>
</div>
<main class="container max-w-screen-xl py-2">
	<slot></slot>
</main>

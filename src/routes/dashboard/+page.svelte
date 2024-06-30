<script lang="ts">
	import { ChevronRight, Plus } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let platforms = $derived(data.platformsAdminOf.concat(data.platformsModeratorOf));

	let platformsUnique = $derived(platforms.filter((p, i) => i === platforms.indexOf(p)));
</script>

<h1 class="my-3 flex max-w-screen-md place-content-between text-2xl font-extrabold">
	Manage Organization
	<Button variant="secondary" on:click={() => goto('/dashboard/organization/create')}>
		<Plus class="me-2 h-4 w-4"></Plus>
		Add
	</Button>
</h1>
<ul class="flex max-w-screen-md flex-col gap-2">
	{#each data.organizationsAdminOf as organization}
		<li class="flex">
			<a
				class="flex w-full place-content-between rounded-md border px-4 py-3 font-mono text-sm"
				href="/dashboard/organization/{organization.id}"
			>
				{organization.name}
				<ChevronRight></ChevronRight>
			</a>
		</li>
	{/each}
</ul>

<h1 class="my-3 flex max-w-screen-sm place-content-between text-2xl font-extrabold">
	Moderate Platforms
</h1>
<ul class="gap- flex max-w-screen-md flex-col">
	{#each platformsUnique as platform}
		<li class="flex">
			<a
				class="flex w-full place-content-between rounded-md border px-4 py-3 font-mono text-sm"
				href="/dashboard/platform/{platform.id}"
			>
				{platform.name}
				<ChevronRight></ChevronRight>
			</a>
		</li>
	{/each}
</ul>

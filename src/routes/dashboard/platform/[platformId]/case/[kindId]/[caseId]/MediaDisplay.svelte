<script lang="ts">
	import { Card } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import type { Media } from '$lib/types';

	export let medias: Media[] = [];
</script>

{#each medias as media}
	<div class="flex w-full flex-col gap-1.5">
		{#if media.tag}
			<Label>{media.tag}</Label>
		{/if}
		<Card class="overflow-hidden">
			{#if media.kind === 'text'}
				{#each media.message.split('\n') as message}
					<p class="p-2">
						{message}
					</p>
				{/each}
			{:else if media.kind === 'image'}
				<img src={media.url} alt={media.alt} />
			{:else if media.kind === 'video'}
				<video src={media.url} controls></video>
			{/if}
		</Card>
	</div>
{/each}

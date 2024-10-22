<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import '../app.css';
	import '@fontsource/geist-sans/400.css';
	import '@fontsource/geist-sans/500.css';
	import '@fontsource/geist-sans/700.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<title>Wallo - Protect The Web</title>
	<meta property="og:title" content="Wallo - Protect The Web" />
	<meta
		property="og:description"
		content="The moderation platform for the web. Protect your community from harmful content."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:url" content={$page.url.toString()} />
	<meta property="og:image" content="{$page.url.origin}/wallo-thumbnail.png" />
	<meta property="og:site_name" content="Wallo" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<ModeWatcher />
{@render children?.()}

<style>
	:global(pre code.hljs) {
		background: transparent;
	}
</style>

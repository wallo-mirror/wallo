<script>
	import { ModeWatcher } from 'mode-watcher';
	import { page } from '$app/stores';
	import '../app.css';
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
</svelte:head>

<ModeWatcher />
<slot></slot>

<style>
	:global(pre code.hljs) {
		background: transparent;
	}
</style>

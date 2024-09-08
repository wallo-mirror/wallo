<script>
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
</script>

<ModeWatcher />
<slot></slot>

<style>
	:global(pre code.hljs) {
		background: transparent;
	}
</style>

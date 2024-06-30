<script lang="ts">
	import type { PageData } from './$types.js';
	import CreateForm from './CreateForm.svelte';
	export let data: PageData;
</script>

<CreateForm data={data.form} />

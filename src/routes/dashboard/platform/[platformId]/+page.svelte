<script lang="ts">
	import type { PageData } from './$types';
	import DataTable from './data-table.svelte';

	export let data: PageData;
</script>

<div class="my-10">
	<DataTable data={data.relevantCases} count={data.count} />
</div>

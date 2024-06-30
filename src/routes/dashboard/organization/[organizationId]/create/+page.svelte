<script lang="ts">
	import type { PageData } from './$types';
	import CreateForm from './CreateForm.svelte';

	export let data: PageData;
</script>

<CreateForm data={data.form}></CreateForm>

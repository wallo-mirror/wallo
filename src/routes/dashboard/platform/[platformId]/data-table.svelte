<script lang="ts">
	import type { Case } from '$lib/types';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import { writable } from 'svelte/store';
	import { addPagination } from 'svelte-headless-table/plugins';

	import * as Table from '$lib/components/ui/table';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label';

	export let data: Case[];
	export let count: number;

	const paginatedData = writable(data);
	const countStore = writable(count);

	$: {
		// need to be reactive because data can change
		$paginatedData = data;
		// pluginStates.page.pageCount .update(() => count);
	}

	const table = createTable(paginatedData, {
		page: addPagination({
			serverSide: true,
			serverItemCount: countStore,
			initialPageIndex: $page.url.searchParams.get('pageIndex')
				? Number($page.url.searchParams.get('pageIndex'))
				: undefined,
			initialPageSize: $page.url.searchParams.get('pageSize')
				? Number($page.url.searchParams.get('pageSize'))
				: undefined
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'relevantId',
			header: 'ID',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'status',
			header: 'Status',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'kind',
			header: 'Kind',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'createdAt',
			header: 'Created At',
			cell: ({ value }) => {
				return value.toLocaleString();
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { pageIndex, pageSize, hasNextPage, hasPreviousPage } = pluginStates.page;

	const kinds = [
		{ value: 'all', label: 'All' },
		{ value: 'user', label: 'User' },
		{ value: 'community', label: 'Community' },
		{ value: 'content', label: 'Content' }
	];

	let kindFilter = kinds[0];

	const statuses = [
		{ value: 'all', label: 'All' },
		{ value: 'resolved', label: 'Resolved' },
		{ value: 'unresolved', label: 'Unresolved' }
	];

	let statusFilter = kinds[0];

	$: {
		if (browser) {
			const q = new URLSearchParams();
			// if ($sortKeys.length) {
			// 	q.set('sort', ($sortKeys[0].order === 'asc' ? '+' : '-') + $sortKeys[0].id);
			// }
			q.set('kind', kindFilter.value);
			q.set('status', statusFilter.value);
			q.set('pageSize', String($pageSize));
			q.set('pageIndex', String($pageIndex));
			// here I call again +page.server.ts with the new url
			goto(`?${q}`, { noScroll: true });
		}
	}
</script>

<div class="my-2 flex items-end gap-2">
	<div class="flex flex-col gap-2">
		<Label for="kindFilter">Kind</Label>
		<Select.Root bind:selected={kindFilter}>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Filter kind" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each kinds as kind}
						<Select.Item value={kind.value} label={kind.label}>{kind.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="kindFilter" />
		</Select.Root>
	</div>
	<div class="flex flex-col gap-2">
		<Label for="statusFilter">Status</Label>
		<Select.Root bind:selected={statusFilter}>
			<Select.Trigger class="w-[180px]">
				<Select.Value placeholder="Filter status" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each statuses as status}
						<Select.Item value={status.value} label={status.label}>{status.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="statusFilter" />
		</Select.Root>
	</div>
</div>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row
						{...rowAttrs}
						on:click={() => {
							if (row.isData()) {
								goto(`case/${row.original.kind}/${row.original.relevantId}`);
							}
						}}
						class="cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-400/5"
					>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<div class="flex items-center justify-end space-x-4 py-4">
	<Button
		variant="outline"
		size="sm"
		on:click={() => ($pageIndex = $pageIndex - 1)}
		disabled={!$hasPreviousPage}>Previous</Button
	>
	<Button
		variant="outline"
		size="sm"
		disabled={!$hasNextPage}
		on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
	>
</div>

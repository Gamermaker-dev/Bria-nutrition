<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { formatDate } from '$lib/util';
	import { mdiPlus } from '@mdi/js';
	import { Button, Table } from 'svelte-ux';

	let { data } = $props();
</script>

<div class="container p-4">
	<div class="grid grid-flow-col gap-4">
		<Table
			data={data.activityLevels}
			classes={{ thead: 'bg-blue-500 text-white font-bold', tr: 'hover:bg-primary-200 hover:cursor-pointer' }}
			columns={[
				{ name: 'id', align: 'left', header: 'ID' },
				{ name: 'name', align: 'left', header: 'Name' },
                { name: 'multiplier', align: 'center', header: 'Multiplier' },
				{ name: 'description', align: 'left', header: 'Description' },
				{ name: 'dateAdded', align: 'left', header: 'Date Created', format: formatDate }
			]}
			on:cellClick={(e) => {
				const id = e.detail.rowData.id;
				goto(resolve('/admin/activity_levels/[id]', { id: id.toString() }));
			}}
		/>
	</div>

	<Button
		class="m-4 bg-primary text-white"
		icon={mdiPlus}
		type="button"
		onclick={() => goto(resolve('/admin/activity_levels/create'))}>Add Activity Level</Button
	>
</div>

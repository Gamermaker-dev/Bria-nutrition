<script lang="ts">
	import { Button, Table } from 'svelte-ux';
	import type { PageServerData } from './$types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { mdiPlus } from '@mdi/js';

	export let data: PageServerData;

	const formatDate = (val: Date | string) => {
		let date = new Date(val);
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	};
</script>

<div class="container p-4">
	<div class="grid grid-flow-col gap-4">
		<Table
			data={data.nutrients}
			classes={{ thead: 'bg-blue-500 text-white font-bold' }}
			columns={[
				{ name: 'id', align: 'left', header: 'ID' },
				{ name: 'name', align: 'left', header: 'Name' },
				{ name: 'dateAdded', align: 'left', header: 'Date Created', format: formatDate },
			]}
		/>
	</div>

	<Button class="m-4 bg-primary text-white" icon={mdiPlus} type="button" onclick={() => goto(resolve('/admin/nutrients/create'))}
		>Add Nutrient</Button
	>
</div>

<script lang="ts">
	import { Button, ButtonGroup, Dialog, Table } from 'svelte-ux';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { mdiPlus, mdiUpload } from '@mdi/js';
	import { formatDate } from '$lib/util';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let open: boolean = $state(false);

	$effect(() => {
		if (form?.status === 200) {
			open = false;
		}
	});
</script>

<Dialog bind:open>
	<div slot="title">Import Nutrients</div>
	<form method="post" action="/admin/nutrients?/import" enctype="multipart/form-data" use:enhance>
		<div class="grid gap-4">
			<input type="file" name="importFile" accept=".csv" />
			<Button class="w-[10%] bg-primary text-white" type="submit">Submit</Button>
		</div>
	</form>
</Dialog>

<div class="flex flex-col gap-4 mx-auto">
	<Table
		data={data.nutrients}
		classes={{ table: 'flex-1', thead: 'bg-blue-500 text-white font-bold' }}
		on:cellClick={(e) => goto(resolve('/admin/nutrients/[id]', { id: `${e.detail.rowData.id}` }))}
		columns={[
			{ name: 'id', align: 'left', header: 'ID' },
			{ name: 'name', align: 'left', header: 'Name' },
			{ name: 'unit', align: 'left', header: 'Unit' },
			{ name: 'fdcNumbers', align: 'left', header: 'FDC Number' },
			{ name: 'dateAdded', align: 'left', header: 'Date Created', format: formatDate }
		]}
	/>

	<ButtonGroup class="place-self-end gap-2">
		<Button
			class="bg-primary text-white"
			icon={mdiPlus}
			type="button"
			onclick={() => goto(resolve('/admin/nutrients/create'))}>Add Nutrient</Button
		>
		<Button class="bg-blue-500 text-white" icon={mdiUpload} type="button" onclick={() => (open = true)}>Import</Button>
	</ButtonGroup>
</div>

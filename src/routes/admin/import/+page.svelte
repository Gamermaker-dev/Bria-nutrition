<script lang="ts">
	import { enhance } from '$app/forms';
import { mdiPlus } from '@mdi/js';
	import { Button, Form, SelectField, Table } from 'svelte-ux';

	let { data, form } = $props();

	let nutrients = $derived(data.nutrients);
</script>

<div class="container p-4">
	<div class="grid gap-4">
		<form method="post" action="/admin/import?/parse" enctype="multipart/form-data" use:enhance>
			<div class="grid gap-4">
				<input type="file" name="importFile" accept=".csv" />
				<Button class="w-[10%] bg-primary text-white" type="submit">Submit</Button>
			</div>
		</form>

		{#if form?.records}
			<Table
				classes={{ thead: 'bg-primary text-white' }}
				data={form.records}
				columns={[
					{ name: 'Age', header: 'Age' },
					{ name: 'Male', header: 'Male' },
					{ name: 'Female', header: 'Female' },
					{ name: 'Pregancy', header: 'Pregancy' },
					{ name: 'Lactation', header: 'Lactation' }
				]}
			/>
			<Form action="/admin/import?/importData">
				<input name="data" type="hidden" value={JSON.stringify(form.records)} />
				<SelectField options={nutrients} name="nutrientId" label="Nutrient" />
				<Button icon={mdiPlus} class="bg-primary text-white" type="submit">Import</Button>
			</Form>
		{/if}
	</div>
</div>

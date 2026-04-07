<script lang="ts">
	import { enhance } from '$app/forms';
import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, ButtonGroup, TextField } from 'svelte-ux';

	let { data, form } = $props();

	const input = $derived({
		name: data.nutrient.name,
		unit: data.nutrient.unit,
		fdcNumbers: data.nutrient.fdcNumbers
	});
</script>

{#if data.nutrient}
	<div class="container p-4">
		{#if form}
			{#if form.status === 200}
				<div class="border-2 border-success text-success font-bold my-4">
					{form.message}
				</div>
			{:else if form.status !== 200}
				<div class="border-2 border-danger text-danger font-bold my-4">
					<!-- eslint-disable-next-line svelte/require-each-key -->
					{#each form?.errors as error}
						{error}
					{/each}
				</div>
			{/if}
		{/if}

		<form method="post" action="/admin/nutrients/{data.nutrient.id}" use:enhance>
			<div class="grid gap-4">
				<TextField label="Name" name="name" bind:value={input.name} />
				<TextField label="Unit" name="unit" bind:value={input.unit} />
				<TextField label="FDC Numbers" name="fdcNumbers" bind:value={input.fdcNumbers} />
				<ButtonGroup>
					<Button class="bg-primary text-white m-4" type="submit">Submit</Button>
					<Button
						class="bg-gray-300 m-4"
						type="button"
						onclick={() => goto(resolve('/admin/nutrients'))}>Back</Button
					>
				</ButtonGroup>
			</div>
		</form>
	</div>
{/if}

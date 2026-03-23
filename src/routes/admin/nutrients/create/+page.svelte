<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Button, Form, TextField } from 'svelte-ux';

	let { form } = $props();
</script>

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

	<Form action="/admin/nutrients/create">
		<TextField label="Name" name="name" />
		<Button class="bg-primary text-white m-4" type="submit">Submit</Button>
		<Button class="bg-gray-300 m-4" type="button" onclick={() => goto(resolve('/admin/nutrients'))}
			>Back</Button
		>
	</Form>
</div>

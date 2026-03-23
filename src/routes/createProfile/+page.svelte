<script lang="ts">

	import Form from '$lib/components/form/Form.svelte';
	import { mdiAccountCheck, mdiAccountPlus, mdiFaceManProfile } from '@mdi/js';
	import { Button, Steps, TextField } from 'svelte-ux';

	let { form } = $props();

	const steps: { label: string; icon: string; completed: boolean }[] = [
		{ label: 'Register', icon: mdiAccountPlus, completed: true },
		{ label: 'Verify', icon: mdiAccountCheck, completed: true },
		{ label: 'Profile', icon: mdiFaceManProfile, completed: false }
	];
</script>

<div class="grid grid-cols-1 gap-4">
	<Steps data={steps} />

	{#if form?.errors && form.errors.length > 0}
		<div class="flex flex-col">
			{#each form.errors as error}
				<p class="text-danger">{error}</p>
			{/each}
		</div>
	{/if}

	<Form id="createProfileForm" action="/createProfile?/create">
		<div class="grid grid-cols-1 gap-4">
			<TextField name="firstName" label="First Name" />
			<TextField name="lastName" label="Last Name" />
			<TextField name="age" label="Age" type="integer" />
			<div class="field">
				<label class="label">Sex</label>
				<div class="control">
					<label class="radio">
						<input type="radio" name="sex" />
						Male
					</label>
					<label class="radio">
						<input type="radio" name="sex" />
						Female
					</label>
				</div>
			</div>
			<TextField name="heightInch" label="Height (inches)" type="integer" />
			<TextField name="heightFeet" label="Height (feet)" type="integer" />
			<TextField name="weight" label="Weight" type="decimal" />
			<Button class="bg-primary w-fit" type="submit">Submit</Button>
		</div>
	</Form>
</div>
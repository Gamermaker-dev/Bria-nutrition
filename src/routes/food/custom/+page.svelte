<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Container from '$lib/components/Container.svelte';
	import NutritionForm from '$lib/components/NutritionForm.svelte';
	import PostForm from '$lib/components/PostForm.svelte';
	import { formatDate } from '$lib/util.js';
	import { mdiGoogle, mdiUploadBox } from '@mdi/js';
	import { untrack } from 'svelte';
	import { Button, ButtonGroup, TextField, Dialog } from 'svelte-ux';

	let { form } = $props();

	let name = $state('');
	let infoInput = $state({
		calories: 0,
		carbs: 0,
		protein: 0,
		fat: 0
	});
	const TODAY = new Date();

	let serving = $state(1);
	let mealDate = $state(new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()));

	$effect(() => {
		if (form?.nutritionData != undefined) {
			untrack(() => {
				open = false;
				console.log(form.nutritionData);
				infoInput.calories =
					form.nutritionData.calories === 'Not found' ? 0 : parseFloat(form.nutritionData.calories);
				infoInput.carbs =
					form.nutritionData.carbs === 'Not found' ? 0 : parseFloat(form.nutritionData.carbs);
				infoInput.protein =
					form.nutritionData.protein === 'Not found' ? 0 : parseFloat(form.nutritionData.protein);
				infoInput.fat =
					form.nutritionData.fat === 'Not found' ? 0 : parseFloat(form.nutritionData.fat);
			});
		}

		if (form?.status === 200 && form.message != null) {
			goto(resolve('/'));
		} else if (form?.status !== 200) {
			open = false;
		}
	});

	let open = $state(false);
</script>

<Dialog bind:open>
	<div slot="title">Upload Nutrition Label</div>
	<form
		method="post"
		action={resolve('/food/custom?/scan')}
		enctype="multipart/form-data"
		use:enhance
	>
		<div class="grid gap-4">
			<input type="file" name="label" accept=".png,.jpeg" />
			<ButtonGroup>
				<Button class="bg-primary text-white" icon={mdiUploadBox} type="submit">Upload</Button>
				<Button
					class="bg-blue-500 text-white"
					icon={mdiGoogle}
					type="submit"
					formaction={resolve('/food/custom?/gemini')}>Try Gemini</Button
				>
			</ButtonGroup>
		</div>
	</form>
</Dialog>

<PostForm {form} />

<div class="flex flex-col gap-4 max-w-xl mx-auto">
	<h1 class="text-lg font-bold">Create Custom Food</h1>
	<Container>
		<TextField label="Name" bind:value={name} />
		<NutritionForm bind:info={infoInput} bind:serving bind:mealDate />

		<span class="col-span-4 font-extrabold"
			>Are you sure you wish to record the information above?</span
		>
		<ButtonGroup class="gap-2">
			<form method="post" action={resolve('/food/custom?/add')} use:enhance>
				<input
					type="hidden"
					name="nutritionInput"
					value={JSON.stringify({ ...infoInput, name, mealDate: formatDate(mealDate), serving })}
				/>
				<Button type="submit" class="bg-emerald-500 text-white">Yes</Button>
			</form>
			<Button type="button" class="bg-red-500 text-white" href={resolve('/food')}>Cancel</Button>
			<Button
				type="button"
				class="bg-blue-500 text-white"
				icon={mdiUploadBox}
				on:click={() => (open = true)}>Upload</Button
			>
		</ButtonGroup>
	</Container>
</div>

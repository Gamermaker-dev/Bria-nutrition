<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Container from '$lib/components/Container.svelte';
	import NutritionForm from '$lib/components/NutritionForm.svelte';
	import PostForm from '$lib/components/PostForm.svelte';
	import { isLoading } from '$lib/stores.js';
	import { Button, ButtonGroup } from 'svelte-ux';

	let { data, form } = $props();

	let calories: number = $state(0);
	let carbs = $state(0);
	let protein = $state(0);
	let fat = $state(0);

	const type = $derived(data.type) as 'fdc' | 'custom';

	let mealDate = $state(new Date());
	let serving = $state(1);

	$effect(() => {
		let currCalories = data.food?.foodNutrients.find((f) => ['208', '958'].includes(f.number));
		calories = currCalories?.amount ?? 0;

		let currFat = data.food?.foodNutrients.find((f) => f.number === '204');
		fat = currFat?.amount ?? 0;

		let currProtein = data.food?.foodNutrients.find((f) => ['203', '257'].includes(f.number));
		protein = currProtein?.amount ?? 0;

		let currCarbs = data.food?.foodNutrients.find((f) => ['205', '284', '956'].includes(f.number));
		carbs = currCarbs?.amount ?? 0;
	});

	$effect(() => {
		if (form?.message != undefined && form.status === 200) goto(resolve('/'));
	});
</script>

<div class="max-w-xl mx-auto flex flex-col gap-4 p-2">
	<PostForm {form} />

	<span class="text-xl font-bold">Add Food</span>
	<Container>
		<NutritionForm info={{ calories, carbs, protein, fat }} bind:serving bind:mealDate readonly />

		<span class="col-span-4 font-extrabold"
			>Are you sure you wish to record the information above?</span
		>
		<ButtonGroup class="gap-2">
			<form method="post" action={resolve('/food/add')} use:enhance={() => {
				const timer = setTimeout(() => ($isLoading = true), 100);

				return async ({ update }) => {
					await update();
					clearTimeout(timer);
					$isLoading = false;
				}
			}}>
				<input
					type="hidden"
					name="input"
					value={JSON.stringify({
						fdcId: type === 'fdc' ? data.food.fdcId : 0,
						mealDate,
						serving: `${serving}`,
						name: data.food.description,
						nutrients: data.food.foodNutrients.map((n) => ({ number: n.number, amount: n.amount }))
					})}
				/>
				<Button type="submit" class="bg-emerald-500 text-white">Yes</Button>
			</form>
			<Button type="button" class="bg-red-500 text-white" href={resolve('/food')}>Cancel</Button>
		</ButtonGroup>
	</Container>
</div>

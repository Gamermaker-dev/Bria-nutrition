<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BriaPage from '$lib/components/BriaPage.svelte';
	import { mdiFood } from '@mdi/js';
	import { Button, DatePickerField } from 'svelte-ux';
	import FoodDialog from './FoodDrawer.svelte';
	import NutrientTracker from './NutrientTracker.svelte';

	let { data, form } = $props();

	let recommended: { calories: number; carbs: number; protein: number; fat: number } = $state({
		calories: 0,
		carbs: 0,
		protein: 0,
		fat: 0
	});

	let stats: { calories: number; carbs: number; protein: number; fat: number } = $state({
		calories: 0,
		carbs: 0,
		protein: 0,
		fat: 0
	});

	let mealDate = $derived(data.mealDate);

	let foodDialogOpen: boolean = $state(false);

	$effect(() => {
		if (data.dashboard) {
			recommended.calories =
				10 * data.dashboard.weight +
				6.25 * data.dashboard.height -
				5 * data.dashboard.age +
				(data.dashboard.sex === 'M' ? 5 : -161);
			recommended.carbs = (recommended.calories * 0.55) / 4;
			recommended.protein = (recommended.calories * 0.15) / 4;
			recommended.fat = (recommended.calories * 0.3) / 9;

			stats.calories = (data.dashboard.calories / recommended.calories) * 100;
			stats.carbs = (data.dashboard.carbs / recommended.carbs) * 100;
			stats.protein = (data.dashboard.protein / recommended.protein) * 100;
			stats.fat = (data.dashboard.fat / recommended.fat) * 100;
		}
	});
</script>

<BriaPage errors={form?.errors} notification={form?.notification}>
	<FoodDialog bind:open={foodDialogOpen} {mealDate} meal={data.meal} />

	<div class="max-w-screen mx-auto flex flex-col gap-4">
		<span class="text-xl font-bold">Dashboard</span>

		<span class="flex flex-row flex-1 mx-auto gap-4">
			<DatePickerField
				bind:value={mealDate}
				stepper
				on:change={() => {
					const base = resolve('/');
					const url = new URL(base, window.location.origin);
					url.searchParams.set('mealDate', encodeURI(mealDate.toUTCString()));

					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto(url.href, { replaceState: false, keepFocus: true, noScroll: true });
				}}
			/>

			<Button
				class="bg-emerald-500 text-white"
				icon={mdiFood}
				onclick={() => (foodDialogOpen = true)}>View Daily Food</Button
			>
		</span>

		<div
			class="flex flex-col flex-1 gap-4 border-4 border-black rounded-sm elevation-10 bg-white mx-auto p-2"
		>
			{#if data.dashboard}
				<NutrientTracker
					label="CALORIES"
					actual={data.dashboard.calories}
					recommended={recommended.calories}
					stats={stats.calories}
					width={15}
					size={200}
				/>
				<span class="flex flex-row mx-auto gap-4">
					<NutrientTracker
						label="CARBS"
						actual={data.dashboard.carbs}
						recommended={recommended.carbs}
						stats={stats.carbs}
						size={100}
						width={15}
					/>
					<NutrientTracker
						label="PROTEIN"
						actual={data.dashboard.protein}
						recommended={recommended.protein}
						stats={stats.protein}
						size={100}
						width={15}
					/>
					<NutrientTracker
						label="FAT"
						actual={data.dashboard.fat}
						recommended={recommended.fat}
						stats={stats.fat}
						size={100}
						width={15}
					/>
				</span>
			{:else}
				<span class="font-lg font-semibold">No data to display yet!</span>
			{/if}
		</div>
	</div>
</BriaPage>

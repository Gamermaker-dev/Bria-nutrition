<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Container from '$lib/components/Container.svelte';
	import { formatDate } from '$lib/util.js';
	import { mdiArrowRight } from '@mdi/js';
	import { untrack } from 'svelte';
	import { Button, ButtonGroup, DateRangeField, SelectField } from 'svelte-ux';

	let { data } = $props();

	type reportData = {
		mealDate: string;
		calories: number;
		carbs: number;
		protein: number;
		fat: number;
		sub?: reportData[];
	};

	let groupBy = $derived(data.groupBy);
	let report = $derived.by(() => {
		let temp = data.report;
		let results: reportData[] = [];
		untrack(() => {
			results =
				temp?.reduce((curr, val) => {
					const v = curr.find(
						(c) => c.mealDate === formatDate(val.mealDate, groupBy as 'year' | 'month' | 'date')
					);

					if (v) {
						if (val.nutrientName === 'Calories') v.calories = parseFloat(val.amount ?? '0');
						else if (val.nutrientName === 'Carbs') v.carbs = parseFloat(val.amount ?? '0');
						else if (val.nutrientName === 'Protein') v.protein = parseFloat(val.amount ?? '0');
						else if (val.nutrientName === 'Fat') v.fat = parseFloat(val.amount ?? '0');
					} else {
						curr.push({
							mealDate: formatDate(val.mealDate, groupBy as 'year' | 'month' | 'date'),
							calories: val.nutrientName === 'Calories' ? parseFloat(val.amount ?? '0') : 0,
							carbs: val.nutrientName === 'Carbs' ? parseFloat(val.amount ?? '0') : 0,
							protein: val.nutrientName === 'Protein' ? parseFloat(val.amount ?? '0') : 0,
							fat: val.nutrientName === 'Fat' ? parseFloat(val.amount ?? '0') : 0
						});
					}

					return curr;
				}, [] as reportData[]) ?? [];
		});

		return results;
	});

	let dateRange = $derived({ from: data.startDate, to: data.endDate });
</script>

<div class="flex flex-col gap-4 mx-auto">
	<h1 class="font-bold text-xl">Health Report</h1>
	<div class="flex flex-row gap-8">
		<DateRangeField bind:value={dateRange} center label="Report Range" />
		<SelectField
			options={[
				{ label: 'Year', value: 'year' },
				{ label: 'Month', value: 'month' },
				{ label: 'Date', value: 'date' }
			]}
			label="Group By"
			bind:value={groupBy}
			clearable={false}
		/>
		<ButtonGroup rounded>
			<Button
                class="bg-emerald-500 text-white"
				icon={mdiArrowRight}
				on:click={() =>
					goto(
						resolve(
							`/health?startDate=${encodeURIComponent(dateRange.from.toLocaleDateString())}&endDate=${encodeURIComponent(dateRange.to.toLocaleDateString())}&groupBy=${encodeURIComponent(groupBy)}`
						)
					)}
			/>
		</ButtonGroup>
	</div>
	<Container>
		<table class="table table-auto">
			<thead>
				<tr class="bg-emerald-500 text-white font-bold p-2 gap-4">
					<th>Period</th>
					<th>Calories</th>
					<th>Carbs</th>
					<th>Protein</th>
					<th>Fat</th>
				</tr>
			</thead>
			<tbody>
				{#each report as data (data.mealDate)}
					<tr class="border-b-4 border-b-black p-2 gap-4">
						<td>{data.mealDate}</td>
						<td>{data.calories.toFixed(0)}</td>
						<td>{data.carbs.toFixed(0)}</td>
						<td>{data.protein.toFixed(0)}</td>
						<td>{data.fat.toFixed(0)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</Container>
</div>

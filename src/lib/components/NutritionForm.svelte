<script lang="ts">
	import { DatePickerField, TextField } from 'svelte-ux';

	let {
		info = $bindable(),
		serving = $bindable(),
		mealDate = $bindable(),
		readonly = false
	}: {
		info: { calories: number; carbs: number; protein: number; fat: number };
		serving: number;
		mealDate: Date;
		readonly?: boolean;
	} = $props();
</script>

<div class="grid grid-cols-4">
	<span class="col-span-4 font-lg font-bold border-b-4 border-black">Nutrition Information</span>

	<div class="grid grid-cols-4 gap-4 col-span-4 border-b-4 border-black">
		<span class="col-span-2 font-bold">Calories:</span>
		{#if readonly}
			<span class="col-span-2">{(info.calories * (serving ?? 0)).toFixed(1)}</span>
		{:else}
			<TextField classes={{ root: 'col-span-2 p-2' }} bind:value={info.calories} />
		{/if}
	</div>

	<div class="grid grid-cols-4 gap-4 col-span-4 border-b-4 border-black">
		<span class="col-span-2 font-bold">Total Fat:</span>
		{#if readonly}
			<span class="col-span-2">{(info.fat * (serving ?? 0)).toFixed(1)}</span>
		{:else}
			<TextField classes={{ root: 'col-span-2 p-2' }} bind:value={info.fat} />
		{/if}
	</div>

	<div class="grid grid-cols-4 gap-4 col-span-4 border-b-4 border-black">
		<span class="col-span-2 font-bold">Carbohydrates:</span>
		{#if readonly}
			<span class="col-span-2">{(info.carbs * (serving ?? 0)).toFixed(1)}</span>
		{:else}
			<TextField classes={{ root: 'col-span-2 p-2' }} bind:value={info.carbs} />
		{/if}
	</div>

	<div class="grid grid-cols-4 gap-4 col-span-4 border-b-4 border-black">
		<span class="col-span-2 font-bold">Protein:</span>
		{#if readonly}
			<span class="col-span-2">{(info.protein * (serving ?? 0)).toFixed(1)}</span>
		{:else}
			<TextField classes={{ root: 'col-span-2 p-2' }} bind:value={info.protein} />
		{/if}
	</div>
</div>

<span class="grid grid-cols-2 gap-2 col-span-4">
	<DatePickerField label="Meal Date" bind:value={mealDate} />
	<TextField label="Serving Size" bind:value={serving} type="decimal" />
</span>

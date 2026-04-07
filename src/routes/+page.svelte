<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { ProgressCircle } from 'svelte-ux';

	let { data } = $props();
	//let activeRow: number = $state(0);
</script>

<Container>
	<span class="text-xl font-bold">Dashboard</span>
	{#if data.dashboard && data.dashboard.nutrients.length > 0}
		<div class="grid grid-cols-3 gap-4">
			{#each data.dashboard.nutrients as nutrient (nutrient.id)}
				<ProgressCircle value={(nutrient.actual / nutrient.recommended) * 100} track size={100}>
					{nutrient.name}
				</ProgressCircle>
			{/each}
		</div>
	{:else}
		<span class="font-lg font-semibold">No data to display yet!</span>
	{/if}
</Container>

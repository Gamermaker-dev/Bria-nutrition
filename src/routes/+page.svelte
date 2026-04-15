<script lang="ts">
	import Container from '$lib/components/Container.svelte';
	import { ProgressCircle } from 'svelte-ux';

	let { data } = $props();
	//let activeRow: number = $state(0);
</script>

<Container>
	<span class="text-xl font-bold">Dashboard</span>
	{#if data.dashboard}
		<div class="grid grid-cols-3 gap-4">
			{#each Object.entries(data.dashboard) as item (item[0])}
				{#if item[0] !== 'userId' && item[0] !== 'mealDate'}
					<ProgressCircle value={item[1] as number} track size={100}>
						{item[0].toUpperCase()}
					</ProgressCircle>
				{/if}
			{/each}
		</div>
	{:else}
		<span class="font-lg font-semibold">No data to display yet!</span>
	{/if}
</Container>

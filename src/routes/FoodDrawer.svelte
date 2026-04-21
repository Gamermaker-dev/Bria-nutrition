<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { mdiDelete } from '@mdi/js';
	import { Button, Drawer, ListItem } from 'svelte-ux';

	let {
		food,
		mealDate,
		open = $bindable()
	}: {
		food:
			| { foodId: number; foodName: string; amount: number; mealId: number; mealDate: Date }[]
			| undefined;
		mealDate: Date;
		open: boolean;
	} = $props();
</script>

<Drawer bind:open placement="left" class="h-screen w-64">
	<h1 class="text-xl font-bold">Food for {mealDate.toLocaleDateString()}</h1>
	<div class="flex flex-col flex-1 gap-4 mx-auto p-2">
		{#if (food?.length ?? 0) > 0}
			{#each food as food (food.foodId)}
				<ListItem title={food.foodName} subheading={`Serving Size: ${food.amount}`}>
					<div slot="actions">
						<form method="POST" action="?/deleteFoodFromMeal" use:enhance>
							<input type="hidden" name="foodId" value={food.foodId} />
							<input type="hidden" name="mealId" value={food.mealId} />
							<Button icon={mdiDelete} type="submit" class="text-danger-500" />
						</form>
					</div>
				</ListItem>
			{/each}
		{:else}
			<span class="font-lg font-semibold"
				>No food added for today! <a href={resolve('/food')}>Trying adding some!</a></span
			>
		{/if}
	</div>
	<div slot="actions">
		<Button onclick={() => (open = false)}>Close</Button>
	</div>
</Drawer>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { mdiClose, mdiDelete } from '@mdi/js';
	import { Button, Drawer, ListItem } from 'svelte-ux';

	let {
		meal,
		mealDate,
		open = $bindable()
	}: {
		meal:
			| {
					mealId: number;
					mealDate: Date;
					mealFood: { foodId: number; foodName: string; amount: number }[];
			  }
			| undefined;
		mealDate: Date;
		open: boolean;
	} = $props();
</script>

<Drawer bind:open placement="left" class="h-screen w-64">
	<div class="relative">
		<h1 class="text-xl font-bold">Food for {mealDate.toLocaleDateString()}</h1>
		<div class="flex flex-col flex-1 gap-4 mx-auto p-2">
			{#if meal && (meal?.mealFood.length ?? 0) > 0}
				{#each meal.mealFood as food (food.foodId)}
					<ListItem title={food.foodName} subheading={`Serving Size: ${food.amount}`}>
						<div slot="actions">
							<form method="POST" action="?/deleteFoodFromMeal" use:enhance>
								<input type="hidden" name="foodId" value={food.foodId} />
								<input type="hidden" name="mealId" value={meal.mealId} />
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
	</div>
		<Button class="fixed bottom-0 left-0 z-50 bg-slate-500 text-white shadow-md w-full text-center" icon={mdiClose} onclick={() => (open = false)}>Close</Button>
</Drawer>

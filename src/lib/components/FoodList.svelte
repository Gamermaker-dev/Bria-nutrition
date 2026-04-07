<script lang="ts">
	import type { FoodListItem } from '$lib/types/usda/FoodListItem';

	let { list }: { list: FoodListItem[] } = $props();
	let activeRow = $state(0);
</script>

{#if list}
	<div class="grid p-8">
		<table class="table table-auto">
			<thead class="bg-primary-500 text-white">
				<tr class="border-t-2 border-x-2 border-black">
					<th>FDC ID</th>
					<th>Description</th>
					<th>Data Type</th>
					<th>Publication Date</th>
					<th>NDB Number</th>
					<th></th>
				</tr>
				<tr class="border-b-2 border-x-2 border-black">
					<th colspan="6">Nutrients</th>
				</tr>
			</thead>
			<tbody>
				{#each list as foodItem (foodItem.fdcId)}
					<tr
						class="border-2 border-black hover:cursor-pointer hover:bg-slate-100"
						onclick={() => {
							if (activeRow === foodItem.fdcId) activeRow = 0;
							else activeRow = foodItem.fdcId;
						}}
					>
						<td>{foodItem.fdcId}</td>
						<td>{foodItem.description}</td>
						<td>{foodItem.dataType}</td>
						<td>{foodItem.publicationDate}</td>
						<td>{foodItem.ndbNumber}</td>
						<td></td>
					</tr>
					{#each foodItem.foodNutrients as nutrient (nutrient.number)}
						{#if activeRow === foodItem.fdcId}
							<tr class="border-2 border-black bg-slate-200 font-semibold">
								<td>{nutrient.number}</td>
								<td>{nutrient.name}</td>
								<td>{nutrient.unitName}</td>
								<td>{nutrient.amount}</td>
								<td>{nutrient.derivationCode}</td>
								<td>{nutrient.derivationDescription}</td>
							</tr>
						{/if}
					{/each}
				{/each}
			</tbody>
		</table>
	</div>
{/if}

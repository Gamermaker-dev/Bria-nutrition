<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<section class="section">
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Date Added</th>
			</tr>
		</thead>
		<tbody>
			{#each data.nutrients as nutrient (nutrient.id)}
				<tr>
					<td>{nutrient.id}</td>
					<td>{nutrient.name}</td>
					<td>{nutrient.dateAdded}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

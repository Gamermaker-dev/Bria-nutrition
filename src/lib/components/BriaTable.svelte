<script lang="ts" module>
	export type BriaTableData = { id: number; cells: { isHeader?: boolean; value: unknown }[] };
</script>

<script lang="ts">
	let { headers, data }: { headers: string[]; data: BriaTableData[] } = $props();
</script>

<table class="table table-auto">
	<thead
		class="bg-emerald-500 text-white font-bold p-2 gap-4 backdrop-blur-md border-x-4 border-x-black border-t-4 border-t-black border-b-4 border-emerald-700 shadow-md"
	>
		<tr>
			{#each headers as header, i (i)}
				<th class="align-middle font-bold">{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody class="border-x-4 border-b-4 border-black p-2">
		{#each data as row (row.id)}
			<tr class="border-b-4 border-black p-2">
				{#each row.cells as cell, i (i)}
					{#if cell.isHeader}
						<td class="bg-slate-400 text-white font-bold p-2 border-x-4 border-x-black"
							>{cell.value}</td
						>
					{:else}
						<td class="p-2 border-x-4 border-x-black">{cell.value}</td> 
					{/if}
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

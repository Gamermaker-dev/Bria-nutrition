<script lang="ts">
	import { Table } from 'svelte-ux';

	let { data } = $props();
</script>

<div class="container p-4">
	<div class="grid grid-flow-col gap-2">
		<Table
            classes={{ thead: 'bg-primary text-white'}}
			data={data.reccommendations}
			columns={[
				{ name: 'minAge', header: 'Min Age' },
				{ name: 'maxAge', header: 'Max Age' },
				{ name: 'sex', header: 'Sex' },
				{ name: 'isPregnant', header: 'Pregnant?' },
				{ name: 'isLactating', header: 'Lactating?' }
			]}
		/>
	</div>
</div>

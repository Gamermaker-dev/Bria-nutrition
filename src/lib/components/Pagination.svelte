<script lang="ts">
	import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
	import { Button } from 'svelte-ux';

	let {
		page,
		perPage,
		total,
		onPageChange
	}: { page: number; perPage: number; total: number; onPageChange: (page: number) => void } =
		$props();

	const startItem = $derived.by(() => {
		return 1 + (page - 1) * perPage;
	});

	const endItem = $derived.by(() => {
		let t = perPage * page;

		if (t > total) return total;

		return t;
	});

	const totalPages = $derived.by(() => {
		return Math.ceil(total / perPage);
	});
</script>

{#if totalPages > 0}
	<div class="flex flex-row gap-4">
		<Button icon={mdiChevronLeft} disabled={page === 1} on:click={() => onPageChange(page - 1)} />
		<span class="my-auto">
			{startItem}-{endItem} of {total}
		</span>
		<Button
			icon={mdiChevronRight}
			disabled={page === totalPages}
			on:click={() => onPageChange(page + 1)}
		/>
	</div>
{/if}

<script lang="ts">
	import type { FoodListItem } from '$lib/types/usda/FoodListItem';
	import type { FoodPaginatedSearch } from '$lib/types/usda/FoodPaginatedSearch';
	import { paginationStore } from '@layerstack/svelte-stores';
	import { ListItem, Pagination, ProgressCircle, TextField } from 'svelte-ux';

	// State management
	let searchQuery = $state('');
	let results: FoodListItem[] = $state([]);
	let isLoading = $state(false);
	let timer: NodeJS.Timeout;

	const pagination = paginationStore({
		page: 1,
		perPage: 50
	});

	let page = $state(1);
	pagination.subscribe((p) => {
		page = p.page;
		console.log(page);
	});

	$effect(() => {
		clearTimeout(timer);

		if ((searchQuery?.trim().length ?? 0) === 0) {
			results = [];
			isLoading = false;
			return;
		}

		// Set a debounce timer (300ms) before making the API call
		timer = setTimeout(async () => {
			isLoading = true;
			try {
				// Replace with your actual internal API route
				const response = await fetch(
					`/api/searchFood?search=${encodeURIComponent(searchQuery)}&page=${encodeURIComponent(page)}`
				);

				if (response.ok) {
					const res = (await response.json()) as {
						status: number;
						data: FoodPaginatedSearch;
						error: string;
					};
					if (res.status === 200) {
						console.log(res);
						pagination.setPage(res.data.currentPage);
						pagination.setTotal(res.data.totalHits);
						// Adjust based on your API's specific response structure
						results = res.data.foods;
					} else {
						console.error(res.error);
						results = [];
					}
				} else {
					console.error('Failed to fetch food data');
					results = [];
				}
			} catch (error) {
				console.error('Error during search:', error);
				results = [];
			} finally {
				isLoading = false;
			}
		}, 300);
		// Cleanup function for the effect
		return () => clearTimeout(timer);
	});
</script>

<div class="grid grid-cols-1 gap-4">
	<span class="text-xl mx-auto font-bold">Food search</span>
	<div class="max-w-xl mx-auto p-4 flex flex-col gap-4">
		<TextField
			label="Search Food Central"
			placeholder="e.g., Apple, Cheddar Cheese..."
			bind:value={searchQuery}
			clearable
		/>

		{#if isLoading}
			<div class="flex justify-center p-4">
				<ProgressCircle size={20} />
			</div>
		{/if}

		{#if results.length > 0 && !isLoading}
			<div class="border rounded-md shadow-sm overflow-hidden bg-surface-100">
				<Pagination {pagination} hideSinglePage />
				{#each results as food (food.fdcId)}
					<ListItem
						title={food.description}
						subheading={food.brandOwner ? `Brand: ${food.brandOwner}` : 'Generic'}
					>
						<svelte:fragment slot="avatar">
							<span class="text-sm text-surface-content/70">
								ID: {food.fdcId}
							</span>
						</svelte:fragment>
					</ListItem>
				{/each}
				<Pagination {pagination} hideSinglePage />
			</div>
		{:else if searchQuery.trim() && !isLoading && results.length === 0}
			<div class="p-4 text-center text-surface-content/60">
				No results found for "{searchQuery}".
			</div>
		{/if}
	</div>
</div>

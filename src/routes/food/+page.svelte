<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BriaPage from '$lib/components/BriaPage.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import QrCodeScanner from '$lib/components/QrCodeScanner.svelte';
	import type { FoodListItem } from '$lib/types/usda/FoodListItem';
	import { mdiBarcodeScan, mdiMagnify, mdiPlus, mdiPlusCircle } from '@mdi/js';
	import { Button, ButtonGroup, Dialog, ListItem, Tab, Tabs, TextField } from 'svelte-ux';

	let { data } = $props();

	const results: FoodListItem[] = $derived(data.results?.foods ?? []);
	let page = $derived(data.results?.currentPage ?? 1);
	const total = $derived(data.results?.totalHits ?? 0);
	let tab = $derived(data.tab);
	let searchQuery = $derived(data.search);
	let submit = $derived(data.submit);

	const search = async (searchQuery?: string, page?: number, submit?: boolean) => {
		try {
			goto(
				resolve(
					`/food?search=${encodeURIComponent(searchQuery ?? '')}&page=${page ?? 1}&tab=${encodeURIComponent(tab)}&submit=${encodeURIComponent(submit ?? false)}`
				),
				{
					replaceState: false,
					noScroll: true,
					keepFocus: true
				}
			);
		} catch (err) {
			console.error('Failed to search:', err);
		}
	};

	const updateSearchQuery = async (searchQuery?: string) => {
		search(searchQuery, 1, true);
	};

	const updatePage = async (page?: number) => {
		search(searchQuery, page ?? 1);
	};

	const updateTab = (tab: 'usda' | 'custom') =>
		goto(resolve(`/food?search=&page=1&tab=${encodeURIComponent(tab)}&submit=false`), {
			replaceState: false,
			noScroll: true,
			keepFocus: true
		});

	let qrCodeOpen = $state(false);
	let qrPaused = $state(false);
</script>

<BriaPage notification={data.notification}>
	<Dialog bind:open={qrCodeOpen}>
		<QrCodeScanner
			class="py-2"
			scanSuccess={(e: unknown) => {
				qrCodeOpen = false;
				updateSearchQuery(`${e}`);
			}}
			scanFailure={(e: unknown) => {
				console.log(e);
			}}
			width={250}
			height={250}
			bind:paused={qrPaused}
		/>
	</Dialog>

	<div class="grid grid-cols-1 gap-4">
		<span class="text-xl mx-auto font-bold">Food search</span>
		<div class="max-w-xl mx-auto p-4 flex flex-col gap-4">
			<Tabs value={tab}>
				<Tab selected={tab === 'usda'} on:click={() => updateTab('usda')}>USDA</Tab>
				<Tab selected={tab === 'custom'} on:click={() => updateTab('custom')}>Custom</Tab>
			</Tabs>
			<span class="flex flex-row gap-2">
				<TextField
					label="Search Food Central"
					placeholder="e.g., Apple, Cheddar Cheese..."
					bind:value={searchQuery}
					clearable
					on:clear={() => {
						search('', 1);
					}}
				>
					<span slot="append">
						<Button
							icon={mdiMagnify}
							on:click={() => {
								updateSearchQuery(searchQuery);
							}}
						/>
					</span>
				</TextField>
				<ButtonGroup class="gap-2" rounded>
					<Button
						icon={mdiBarcodeScan}
						iconOnly
						class="bg-slate-400"
						on:click={() => (qrCodeOpen = true)}
					/>
					<Button
						icon={mdiPlus}
						iconOnly
						class="bg-emerald-500 text-white"
						on:click={() => goto(resolve('/food/custom'))}
					/>
				</ButtonGroup>
			</span>

			{#if results.length > 0}
				<div class="border rounded-md shadow-sm overflow-hidden bg-surface-100">
					<Pagination {page} perPage={50} {total} onPageChange={(page) => updatePage(page)} />
					{#each results as food (food.fdcId)}
						<ListItem
							title={food.description}
							subheading={food.brandOwner ? `Brand: ${food.brandOwner}` : 'Generic'}
						>
							<svelte:fragment slot="actions">
								<Button
									icon={mdiPlusCircle}
									class="text-emerald-500"
									on:click={() =>
										goto(
											resolve(
												`/food/add?${tab === 'usda' ? `fdcId=${encodeURIComponent(food.fdcId)}` : `customId=${encodeURIComponent(food.fdcId)}`}`
											)
										)}
								/>
							</svelte:fragment>
						</ListItem>
					{/each}
					<Pagination {page} perPage={50} {total} onPageChange={(page) => updatePage(page)} />
				</div>
			{:else if searchQuery.trim() && submit && results.length === 0}
				<div class="p-4 text-center text-surface-content/60">
					No results found for "{searchQuery}".
				</div>
			{/if}
		</div>
	</div>
</BriaPage>

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import '../app.css';
	import { getSettings } from 'svelte-ux';
	import Web from './Web.svelte';
	import Mobile from './Mobile.svelte';
	import { beforeNavigate } from '$app/navigation';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();

	const { showDrawer } = getSettings();

	$effect(() => {
		$showDrawer = data.user != undefined;
	});

	let isLoading = $state(false);

	beforeNavigate((nav) => {
		isLoading = true;
		console.log(`Navigating from ${nav.from?.url.href} to ${nav.to?.url.href}`);
		nav.complete.finally(() => (isLoading = false));
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	{#if data.isMobile}
		<Mobile user={data.user} navbar={data.navbar} {isLoading}>
			{@render children()}
		</Mobile>
	{:else}
		<Web user={data.user} navbar={data.navbar} {isLoading}>
			{@render children()}
		</Web>
	{/if}
</div>

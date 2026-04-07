<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import '../app.css';
	import { getSettings } from 'svelte-ux';
	import Web from './Web.svelte';
	import Mobile from './Mobile.svelte';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();

	const { showDrawer } = getSettings();

	$effect(() => {
		$showDrawer = data.user != undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen">
	{#if data.isMobile}
		<Mobile user={data.user} navbar={data.navbar}>
			{@render children()}
		</Mobile>
	{:else}
		<Web user={data.user} navbar={data.navbar}>
			{@render children()}
		</Web>
	{/if}
</div>

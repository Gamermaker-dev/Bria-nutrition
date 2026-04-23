<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import '../app.css';
	import { getSettings } from 'svelte-ux';
	import Web from './Web.svelte';
	import Mobile from './Mobile.svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import Loading from '$lib/components/Loading.svelte';
	import { isLoading } from '$lib/stores';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();

	const { showDrawer } = getSettings();

	$effect(() => {
		$showDrawer = data.user != undefined;
	});

	beforeNavigate((nav) => {
		const timer = setTimeout(() => ($isLoading = true), 100);
		console.log(`Navigating from ${nav.from?.url.href} to ${nav.to?.url.href}`);
		nav.complete.finally(() => {
			clearTimeout(timer);
			$isLoading = false;
		});
	});

	afterNavigate((nav) => {
		if (nav.type === 'enter') {
			const timer = setTimeout(() => ($isLoading = true), 100);
			console.log(`Navigating to ${nav.to?.url.href}`);
			nav.complete.finally(() => {
				clearTimeout(timer);
				$isLoading = false;
			});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if $isLoading}
	<Loading />
{/if}

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

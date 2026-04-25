<script lang="ts">
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import favicon from '$lib/assets/favicon.svg';
	import ErrorBanner from '$lib/components/ErrorBanner.svelte';
	import Loading from '$lib/components/Loading.svelte';
	import { displayError, isLoading } from '$lib/stores';
	import { untrack, type Snippet } from 'svelte';
	import { getSettings } from 'svelte-ux';
	import '../app.css';
	import type { LayoutServerData } from './$types';
	import Mobile from './Mobile.svelte';
	import Web from './Web.svelte';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();

	$effect(() => {
		const _displayError = data.displayError;
		untrack(() => {
			$displayError = _displayError;
		});
	});

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
			if (nav.to?.url.searchParams.get('error')) {
				const newUrl = new URL(nav.to.url);
				newUrl.searchParams.delete('error');
				history.replaceState(null, '', newUrl);
			}
		}
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

<ErrorBanner />

<div class="flex flex-col min-h-screen relative">
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

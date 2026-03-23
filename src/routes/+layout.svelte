<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import { resolve } from '$app/paths';
	import Form from '$lib/components/form/Form.svelte';
	import '../app.css';
	import { AppBar, AppLayout, Avatar, Menu, NavItem, Toggle, Button, getSettings } from 'svelte-ux';
	import { goto } from '$app/navigation';
	import BriaPage from '$lib/components/BriaPage.svelte';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();

	const signout = () => {
		const formEl: HTMLFormElement | null = document.getElementById(
			'signOutForm'
		) as HTMLFormElement | null;
		if (formEl) formEl.submit();
	};

	const { showDrawer } = getSettings();

	$effect(() => {
		$showDrawer = data.user != undefined;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AppLayout>
	<AppBar menuIcon="" title="Bria Nutrition" class="bg-emerald-400 text-white">
		<div class="grid grid-flow-col gap-4 justify-center" slot="actions">
			{#if data.user}
				<Button onclick={() => goto(resolve('/'))}>Dashboard</Button>
				<Button onclick={() => goto(resolve('/admin'))}>Admin</Button>
				<Toggle let:on={open} let:toggle let:toggleOff>
					<Button onclick={toggle}>
						<Avatar class="bg-primary">
							<figure class="image is-32x32">
								<img class="rounded-xl" src={data.user.image} alt={data.user.name} />
							</figure>
						</Avatar>
						<Menu {open} onclose={toggleOff}>
							<Form id="signOutForm" action="/login?/signOut">
								<Button onclick={signout}>Sign out</Button>
							</Form>
						</Menu>
					</Button>
				</Toggle>
			{:else}
				<Button class="bg-slate-300 text-black" onclick={() => goto(resolve('/login'))}
					>Sign In</Button
				>
				<Button class="bg-black text-white" onclick={() => goto(resolve('/register'))}
					>Register</Button
				>
			{/if}
		</div>
	</AppBar>

	<main>
		<BriaPage>
			{#snippet body()}
				{@render children()}
			{/snippet}
		</BriaPage>
	</main>
</AppLayout>

<!--<section class="hero is-primary">-->
<!--	<div class="hero-head">-->
<!--		<nav class="navbar">-->
<!--			<div class="container">-->
<!--				<div class="navbar-brand">-->
<!--					<NavbarItem>-->
<!--						<p class="title has-text-light">BRIA NUTRITION</p>-->
<!--					</NavbarItem>-->
<!--					<span class="navbar-burger" data-target="navbarMenuHeroA">-->
<!--						<span></span>-->
<!--						<span></span>-->
<!--						<span></span>-->
<!--						<span></span>-->
<!--					</span>-->
<!--				</div>-->
<!--				<div id="navbarMenuHeroA" class="navbar-menu">-->
<!--					<div class="navbar-end">-->
<!--						{#each data.navbar as item (item.href)}-->
<!--							<NavbarItem {...item}>{item.text}</NavbarItem>-->
<!--						{/each}-->
<!--						{#if data.user}-->
<!--							<NavbarItem isDiv hasDropdown isHoverable>-->
<!--								&lt;!&ndash; svelte-ignore a11y_missing_attribute &ndash;&gt;-->
<!--								<a class="navbar-link">-->
<!--									{#if data.user.image}-->
<!--										<figure class="image is-32x32">-->
<!--											<img class="is-rounded" src={data.user.image} alt={data.user.name} />-->
<!--										</figure>-->
<!--									{:else}-->
<!--										<div-->
<!--											class="has-background-grey has-text-white is-flex is-justify-content-center is-align-items-center"-->
<!--											style="width: 32px; height: 32px; font-size: 1.5rem; font-weight: bold; border-radius: 50%;"-->
<!--										>-->
<!--											{data.user.name.charAt(0)}-->
<!--										</div>-->
<!--									{/if}-->
<!--								</a>-->

<!--								<div class="navbar-dropdown">-->
<!--									<NavbarItem isDiv>-->
<!--										<Form method="POST" id="signout" action="/login?/signOut">-->
<!--											&lt;!&ndash; svelte-ignore a11y_click_events_have_key_events &ndash;&gt;-->
<!--											&lt;!&ndash; svelte-ignore a11y_no_static_element_interactions &ndash;&gt;-->
<!--											<a-->
<!--												class="navbar-item"-->
<!--												onclick={() => {-->
<!--													const formEl = document.getElementById(-->
<!--														'signout'-->
<!--													) as HTMLFormElement | null;-->

<!--													if (formEl) formEl.submit();-->
<!--												}}-->
<!--											>-->
<!--												<strong>Sign Out</strong></a-->
<!--											>-->
<!--										</Form>-->
<!--									</NavbarItem>-->
<!--								</div>-->
<!--							</NavbarItem>-->
<!--						{:else}-->
<!--							<NavbarItem isDiv>-->
<!--								<div class="buttons">-->
<!--									<Button type="light" isLink href={resolve('/login')}>Sign In</Button>-->
<!--									<Button type="dark" isLink href={resolve('/register')}>Register</Button>-->
<!--								</div>-->
<!--							</NavbarItem>-->
<!--						{/if}-->
<!--					</div>-->
<!--				</div>-->
<!--			</div>-->
<!--		</nav>-->
<!--	</div>-->
<!--</section>-->

<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { resolve } from '$app/paths';
	import NavbarItem from '$lib/components/bulma/NavbarItem.svelte';
	import Form from '$lib/components/form/Form.svelte';

	let { data, children }: { data: LayoutServerData; children: Snippet<[]> } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<section class="hero is-primary">
	<div class="hero-head">
		<nav class="navbar">
			<div class="container">
				<div class="navbar-brand">
					<NavbarItem>
						<p class="title has-text-light">BRIA NUTRITION</p>
					</NavbarItem>
					<span class="navbar-burger" data-target="navbarMenuHeroA">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</span>
				</div>
				<div id="navbarMenuHeroA" class="navbar-menu">
					<div class="navbar-end">
						{#each data.navbar as item (item.href)}
							<NavbarItem {...item}>{item.text}</NavbarItem>
						{/each}
						{#if data.user}
							<NavbarItem isDiv hasDropdown isHoverable>
								<!-- svelte-ignore a11y_missing_attribute -->
								<a class="navbar-link">
									{#if data.user.image}
										<figure class="image is-32x32">
											<img class="is-rounded" src={data.user.image} alt={data.user.name} />
										</figure>
									{:else}
										<div
											class="has-background-grey has-text-white is-flex is-justify-content-center is-align-items-center"
											style="width: 32px; height: 32px; font-size: 1.5rem; font-weight: bold; border-radius: 50%;"
										>
											{data.user.name.charAt(0)}
										</div>
									{/if}
								</a>

								<div class="navbar-dropdown">
									<NavbarItem isDiv>
										<Form method="POST" id="signout" action="/login?/signOut">
											<!-- svelte-ignore a11y_click_events_have_key_events -->
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<a
												class="navbar-item"
												onclick={() => {
													const formEl = document.getElementById(
														'signout'
													) as HTMLFormElement | null;

													if (formEl) formEl.submit();
												}}
											>
												<strong>Sign Out</strong></a
											>
										</Form>
									</NavbarItem>
								</div>
							</NavbarItem>
						{:else}
							<NavbarItem isDiv>
								<div class="buttons">
									<Button type="light" isLink href={resolve('/login')}>Sign In</Button>
									<Button type="dark" isLink href={resolve('/register')}>Register</Button>
								</div>
							</NavbarItem>
						{/if}
					</div>
				</div>
			</div>
		</nav>
	</div>
</section>

<div class="container">
	{@render children()}
</div>

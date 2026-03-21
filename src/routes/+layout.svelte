<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import type { Snippet } from 'svelte';
	import type { LayoutServerData } from './$types';
	import Button from '$lib/components/Button.svelte';
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';

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
					<a class="navbar-item">
						<p class="title has-text-light">BRIA NUTRITION</p>
					</a>
					<span class="navbar-burger" data-target="navbarMenuHeroA">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</span>
				</div>
				<div id="navbarMenuHeroA" class="navbar-menu">
					<div class="navbar-end">
						<a class="navbar-item is-active"> Home </a>
						<a class="navbar-item"> Examples </a>
						<a class="navbar-item"> Documentation </a>
						{#if data.user}
							<span class="navbar-item">
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
							</span>
							<div class="navbar-item">
								<form method="POST" use:enhance>
									<Button type="light" formaction="/login?/signOut"
										><strong>Sign Out</strong></Button
									>
								</form>
							</div>
						{:else}
							<div class="navbar-item">
								<div class="buttons">
									<Button type="light" isLink href={resolve('/login')}>Sign In</Button>
									<Button type="dark" isLink href={resolve('/register')}>Register</Button>
								</div>
							</div>
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

<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import BriaPage from '$lib/components/BriaPage.svelte';
	import type { NavbarItemProps } from '$lib/types/NavbarItemProps';
	import type { Snippet } from 'svelte';
	import { Button, Menu, Toggle } from 'svelte-ux';

	let {
		user,
		navbar,
		children
	}: {
		user: unknown;
		navbar: NavbarItemProps[];
		children: Snippet<[]>;
	} = $props();
</script>

<header class="bg-primary-400 text-white p-4">BRIA</header>

<main class="grow h-screen relative">
	<BriaPage>
		{#snippet body()}
			{@render children()}
		{/snippet}
	</BriaPage>
</main>

<footer class="sticky bottom-0 left-0 w-full z-50">
	<div class="bg-slate-500 text-white p-4">
		<div class="grid grid-flow-col gap-4 justify-center">
			{#if user}
				{#each navbar as nav (nav.text)}
					{#if nav.subItems && nav.subItems.length > 0}
						<Toggle let:on={open} let:toggle let:toggleOff>
							<Button onclick={toggle}>
								{nav.text}
								<Menu matchWidth {open} onclose={toggleOff}>
									{#each nav.subItems as sub (sub.text)}
										{#if sub.href !== undefined}
											<Button onclick={() => goto(resolve(sub.href))}>{sub.text}</Button>
										{:else if sub.action !== undefined}
											<form method="post" action={sub.action} use:enhance>
												<Button type="submit">{sub.text}</Button>
											</form>
										{/if}
									{/each}
								</Menu>
							</Button>
						</Toggle>
					{/if}
					{#if nav.href !== undefined}
						<Button onclick={() => goto(resolve(nav.href))}>{nav.text}</Button>
					{:else if nav.action !== undefined}
						<form method="post" action={nav.action} use:enhance>
							<Button type="submit">{nav.text}</Button>
						</form>
					{/if}
				{/each}
			{:else}
				<Button class="bg-slate-300 text-black" onclick={() => goto(resolve('/login'))}
					>Sign In</Button
				>
				<Button class="bg-black text-white" onclick={() => goto(resolve('/register'))}
					>Register</Button
				>
			{/if}
		</div>
	</div>
</footer>

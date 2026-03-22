<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardHeaderProps = {
		bulma?: { root?: string; title?: string; icon?: string };
		title?: Snippet<[]>;
		icon?: Snippet<[]>;
	};

	let { bulma, title, icon }: CardHeaderProps = $props();
</script>

<header class="card-header {bulma?.root ?? ''}">
	{#if title}
		<p class="card-header-title {bulma?.title ?? ''}">
			{@render title()}
		</p>
	{/if}
	{#if icon}
		<button class="card-header-icon {bulma?.icon ?? ''}">
			{@render icon()}
		</button>
	{/if}
</header>

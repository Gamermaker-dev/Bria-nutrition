<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardProps = { header?: Snippet<[]>; image?: Snippet<[]>; content?: Snippet<[]> };

	let { header, image, content }: CardProps = $props();
</script>

<div class="card is-clickable">
	{#if header}
		{@render header()}
	{/if}

	{#if image}
		{@render image()}
	{/if}

	{#if content}
		{@render content()}
	{/if}
</div>

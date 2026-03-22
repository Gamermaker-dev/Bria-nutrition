<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardImageProps = { children: Snippet<[]> };

	let { children }: CardImageProps = $props();
</script>

<div class="card-image">
	{@render children()}
</div>

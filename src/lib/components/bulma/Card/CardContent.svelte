<script lang="ts">
	import type { Snippet } from 'svelte';

	type CardContentProps = { children: Snippet<[]> };
	let { children }: CardContentProps = $props();
</script>

<div class="card-content">
	{@render children()}
</div>

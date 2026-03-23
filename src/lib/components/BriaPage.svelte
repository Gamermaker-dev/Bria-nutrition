<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';

	let { nav, body }: { nav?: Snippet<[]>; body: Snippet<[]> } = $props();
</script>

<div class="container pt-4 pr-8">
	<div class={clsx('grid gap-2', nav && 'grid-cols-[auto,1fr]')}>
		{@render nav?.()}

		{@render body()}
	</div>
</div>

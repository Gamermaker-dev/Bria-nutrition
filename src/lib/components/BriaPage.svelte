<script lang="ts">
	import clsx from 'clsx';
	import type { Snippet } from 'svelte';

	let { body }: { body: Snippet<[]> } = $props();
</script>

<div class="bg-grey-200 pt-4 pr-8">
	<div class={clsx('grid gap-2')}>
		{@render body()}
	</div>
</div>

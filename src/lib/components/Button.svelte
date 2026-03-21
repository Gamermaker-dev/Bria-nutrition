<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import type { Snippet } from 'svelte';
	import type { MouseEventHandler } from 'svelte/elements';

	let {
		formaction,
		type = 'primary',
		children,
		onclick,
		isLink = false,
		...others
	}: {
		formaction?: string;
		type?: string;
		children?: Snippet<[]>;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		isLink?: boolean;
		href?: ResolvedPathname;
	} = $props();
</script>

{#if isLink}
	<a class="button is-{type}" {...others}>{@render children?.()}</a>
{:else}
	<button class="button is-{type}" {formaction} {onclick}>
		{@render children?.()}
	</button>
{/if}

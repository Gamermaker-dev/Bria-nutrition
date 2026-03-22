<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import type { Props } from '$lib/types/Props';
	import type { MouseEventHandler } from 'svelte/elements';

	type ButtonProps = Props & {
		formaction?: string;
		type?: string;
		onclick?: MouseEventHandler<HTMLButtonElement>;
		isLink?: boolean;
		href?: ResolvedPathname;
	}

	let {
		formaction,
		type = 'primary',
		children,
		onclick,
		isLink = false,
		...others
	}: ButtonProps = $props();
</script>

{#if isLink}
	<a class="button is-{type}" {...others}>{@render children?.()}</a>
{:else}
	<button class="button is-{type}" {formaction} {onclick}>
		{@render children?.()}
	</button>
{/if}

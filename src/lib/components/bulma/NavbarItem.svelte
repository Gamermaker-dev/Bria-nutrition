<script lang="ts" module>
	export type NavbarItemProps = Props & {
		isActive?: boolean;
		isExpanded?: boolean;
		isTab?: boolean;
		hasDropdown?: boolean;
		isDiv?: boolean;
		isSpan?: boolean;
		href?: ResolvedPathname;
		text?: string;
		isHoverable?: boolean;
	};
</script>

<script lang="ts">
	import type { ResolvedPathname } from '$app/types';
	import type { Props } from '$lib/types/Props';

	let {
		isActive = false,
		isExpanded = false,
		isTab = false,
		hasDropdown = false,
		isDiv = false,
		isSpan = false,
		isHoverable = false,
		children,
		...rest
	}: NavbarItemProps = $props();

	let htmlClass: string = $derived.by(() => {
		let _a: string = 'navbar-item has-text-white';

		if (isActive) _a = _a + ' is-active';
		if (isExpanded) _a = _a + ' is-expanded';
		if (isTab) _a = _a + ' is-tab';
		if (hasDropdown) _a = _a + ' has-dropdown';
		if (isHoverable) _a = _a + ' is-hoverable';

		return _a;
	});
</script>

{#if isDiv}
	<div class={htmlClass} {...rest}>{@render children?.()}</div>
{:else if isSpan}
	<span class={htmlClass} {...rest}>{@render children?.()}</span>
{:else}
	<a class={htmlClass} {...rest}>{@render children?.()}</a>
{/if}

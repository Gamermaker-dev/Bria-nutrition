<script lang="ts">
	import type { Props } from '$lib/types/Props';

	type ColumnSizes =
		| 'full'
		| 'two-thirds'
		| 'half'
		| 'one-third'
		| 'one-quarter'
		| 'four-fifths'
		| 'three-fifths'
		| 'two-fifths'
		| 'one-fifth';
	type ColumnGrid = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
	type ColumnProps = Props & {
		narrow?: 'default' | 'mobile' | 'tablet' | 'touch' | 'desktop' | 'widescreen' | 'fullhd';
		size?: ColumnSizes;
		grid?: ColumnGrid;
		offset?: ColumnSizes & ColumnGrid;
	};
	let { narrow, size, grid, offset, children }: ColumnProps = $props();

	let elClass = $derived.by(() => {
		let _e = 'column';

		if (narrow) {
			if (narrow === 'default') _e += ' is-narrow';
			else _e += ` is-narrow-${narrow}`;
		}

		if (size) _e += ` is-${size}`;
		if (grid) _e += ` is-${grid}`;
		if (offset) _e += ` is-offset-${offset}`;

		return _e;
	});
</script>

<div class={elClass}>
	{@render children?.()}
</div>

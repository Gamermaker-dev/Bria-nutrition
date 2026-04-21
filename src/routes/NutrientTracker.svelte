<script lang="ts">
	import clsx from 'clsx';
	import { ProgressCircle } from 'svelte-ux';

	let {
		actual,
		recommended,
		stats,
		label,
		size,
		width
	}: {
		actual: number;
		recommended: number;
		stats: number;
		label: string;
		size: number;
		width: number;
	} = $props();

	const value = $derived(Math.round((actual / recommended) * 100));
</script>

<span class="mx-auto flex flex-col gap-2 p-2">
	<ProgressCircle
		class={clsx(
			'p-4',
			value < 50 && 'text-yellow-300',
			value < 120 && value > 50 && 'text-emerald-500',
			value > 120 && 'text-red-500'
		)}
		value={stats > 100 ? 100 : stats}
		{size}
		{width}
	>
		{value}%
	</ProgressCircle>
	<span class="p-4 font-sm">{label} {actual.toFixed(0)} / {recommended.toFixed(0)}</span>
</span>

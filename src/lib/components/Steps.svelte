<script lang="ts">
	import type { Props } from '$lib/types/Props';
	import Icon from '$lib/components/bulma/Icon.svelte';

	type StepProps = Props & { steps: { id: number; name: string; icon: string }[]; phase: number; }
	let { steps = [], phase }: StepProps = $props();
</script>

<nav class="level">
	{#each steps as step, i (step.id)}
		<div class="level-item has-text-centered is-block-inline">
			<div class="{phase > step.id ? 'has-background-success has-text-white' : ''}"
					 style="width: 32px; height: 32px; font-size: 1.5rem; font-weight: bold; border-radius: 50%;">
				<Icon icon={step.icon} />
			</div>
			{#if i < (steps.length - 1)}
				<progress class="progress is-success" value="100" max="100">100%</progress>
			{/if}
		</div>
	{/each}
</nav>
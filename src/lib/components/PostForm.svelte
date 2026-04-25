<script lang="ts">
	let { errors = undefined }: { errors?: string[] } = $props();
</script>

{#if errors != undefined}
	<div class="flex flex-col bg-red-200 border-4 border-red-600 rounded-sm">
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each errors as error, i (i)}
			<p>{error}</p>
		{/each}
	</div>
{/if}

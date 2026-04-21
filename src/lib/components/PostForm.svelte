<script lang="ts">
	let {
		form
	} = $props();

	$effect(() => console.log(form));
</script>

{#if form?.errors}
	<div class="flex flex-col bg-red-200 border-4 border-red-600 rounded-sm">
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each Object.entries(form.errors.properties) as error}
			<p>{error[1].errors.join('\n')}</p>
		{/each}
	</div>
{:else if form?.message && form.message.length > 0}
	<div class="flex flex-col bg-emerald-200 border-4 border-emerald-600 rounded-sm">
		<p>{form.message}</p>
	</div>
{/if}

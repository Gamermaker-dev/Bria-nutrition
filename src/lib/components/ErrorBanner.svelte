<script lang="ts">
	import { displayError } from '$lib/stores';
	import { mdiCancel } from '@mdi/js';
	import { Button } from 'svelte-ux';
</script>

{#if $displayError}
	<div class="p-8 bg-black text-white grid grid-cols-2">
		<span class="place-self-start">
			We are very sorry. An unexpected error has occured.
			<br />
			Please try again later. If problem persists, please contact an administrator.
		</span>
		<span class="place-self-end"
			><Button icon={mdiCancel} on:click={() => ($displayError = false)} /></span
		>
	</div>
{/if}

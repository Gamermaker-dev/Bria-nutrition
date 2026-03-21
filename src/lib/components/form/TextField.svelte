<script lang="ts">
	let { label, type = 'text', name }: { label: string; type?: string; name: string } = $props();
</script>

<div class="field">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="label">{label}</label>
	<div class="control">
		<input class="input" {type} {name} />
	</div>
</div>

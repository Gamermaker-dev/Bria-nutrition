<script lang="ts">
	let { children } = $props();
</script>

<div class="border-2 border-black rounded-md grid flex-grow">
	{@render children()}
</div>

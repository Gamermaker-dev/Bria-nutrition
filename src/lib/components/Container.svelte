<script lang="ts">
	let { children } = $props();
</script>

<div
	class="flex flex-col flex-1 gap-4 border-4 border-black rounded-sm elevation-10 bg-white mx-auto p-2"
>
	{@render children()}
</div>

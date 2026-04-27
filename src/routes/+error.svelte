<script lang="ts">
	import { page } from "$app/state";
</script>

<div class="p-8 bg-black text-white">
	<h1>{page.status}: {page.error?.message}</h1>
</div>

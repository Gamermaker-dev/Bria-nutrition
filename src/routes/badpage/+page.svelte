<script lang="ts">
	import BriaPage from '$lib/components/BriaPage.svelte';

    let { data } = $props();

    throw new Error();
</script>

<BriaPage>
    <span>I should not load!</span>
</BriaPage>
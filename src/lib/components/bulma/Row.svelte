<script lang="ts">
	import type { Props } from "$lib/types/Props";

    let { elClass, children }: Props = $props();

    let componentClass = $derived(`columns ${elClass}`.trim());
</script>

<div class="{componentClass}">
    {@render children?.()}
</div>
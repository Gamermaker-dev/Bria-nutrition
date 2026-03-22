<script lang="ts">
	import SvgIcon from '@jamescoyle/svelte-icon';

	type IconProps = { icon: string };

	let { icon }: IconProps = $props();
</script>

<span class="icon">
     <SvgIcon type="mdi" path={icon} />
</span>

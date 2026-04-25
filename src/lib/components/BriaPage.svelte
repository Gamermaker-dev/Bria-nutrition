<script lang="ts">
	import { notifications } from '$lib/stores';
	import type { BriaNotification } from '$lib/types/BriaNotification';
	import clsx from 'clsx';
	import { untrack, type Snippet } from 'svelte';
	import PostForm from './PostForm.svelte';

	let {
		children,
		errors = undefined,
		notification = undefined
	}: {
		children: Snippet<[]>;
		errors?: string[];
		notification?: BriaNotification;
	} = $props();

	$effect(() => {
		const notif = notification;
		untrack(() => {
			if (notif) $notifications = [...$notifications, notif];
		});
	});
</script>

<div class="bg-grey-200 pt-4 pr-8">
	<PostForm {errors} />
	<div class={clsx('grid gap-2')}>
		{@render children()}
	</div>
</div>

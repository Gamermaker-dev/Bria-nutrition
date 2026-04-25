<script lang="ts">
	import { notifications } from '$lib/stores';
	import { mdiCheckCircle, mdiExclamation, mdiSignCaution } from '@mdi/js';
	import { Notification } from 'svelte-ux';

	const icons = {
		success: mdiCheckCircle,
		warning: mdiSignCaution,
		danger: mdiExclamation
	} as const;

	const notifs = $derived($notifications);
	let timer: NodeJS.Timeout | undefined = $state(undefined);

	$effect(() => {
		if ($notifications.length > 0) {
			timer = setInterval(() => {
				$notifications = $notifications.filter((n, i) => i !== 0);
			}, 5000);
		} else {
			clearInterval(timer);
		}
	});
</script>

<div class="fixed bottom-5 right-5 grid grid-cols-1 gap-2 w-[400px] max-w-xs items-center">
	{#each notifs as notif, i (i)}
		<Notification
			title={notif.title}
			description={notif.description}
			icon={icons[notif.type as 'success' | 'warning' | 'danger']}
			color={notif.type}
			closeIcon
			on:close={() => {
				$notifications = $notifications.filter((n, j) => j !== i);
			}}
		/>
	{/each}
</div>

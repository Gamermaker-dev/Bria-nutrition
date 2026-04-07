<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ResolvedPathname } from '$app/types';
	import { mdiAccount, mdiFile, mdiRun, mdiSeed } from '@mdi/js';
	import { ListItem } from 'svelte-ux';
	import { goto } from '$app/navigation';

	let cards: { title: string; icon: string; link: ResolvedPathname; description: string }[] = [
		{ title: 'Users', icon: mdiAccount, link: '/admin/users', description: 'List of Users' },
		{
			title: 'Activity Levels',
			icon: mdiRun,
			link: '/admin/activity_levels',
			description: 'List of activity levels.'
		},
		{
			title: 'Nutrients',
			icon: mdiSeed,
			link: '/admin/nutrients',
			description: 'List of nutrients.'
		},
		{
			title: 'Import',
			icon: mdiFile,
			link: '/admin/import',
			description: 'Import data from CSV files.'
		}
	];
</script>

<div class="max-w-xl mx-auto flex flex-col gap-4">
	{#each cards as card (card.title)}
		<ListItem
			title={card.title}
			subheading={card.description}
			icon={card.icon}
			classes={{ root: 'hover:cursor-pointer' }}
			on:click={() => goto(resolve(card.link))}
		/>
	{/each}
</div>

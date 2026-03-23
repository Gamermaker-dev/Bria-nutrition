<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ResolvedPathname } from '$app/types';
	import Card from '$lib/components/bulma/Card/Card.svelte';
	import CardContent from '$lib/components/bulma/Card/CardContent.svelte';
	import CardHeader from '$lib/components/bulma/Card/CardHeader.svelte';
	import Icon from '$lib/components/bulma/Icon.svelte';
	import { mdiAccount, mdiFile, mdiSeed } from '@mdi/js';
	import { ListItem } from 'svelte-ux';
	import { goto } from '$app/navigation';

	let cards: { title: string; icon: string; link: ResolvedPathname; description: string }[] = [
		{ title: 'Users', icon: mdiAccount, link: '/admin/users', description: 'List of Users' },
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

<div class="grid grid-cols-2 gap-4">
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

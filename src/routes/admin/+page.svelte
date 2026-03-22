<script lang="ts">
	import { resolve } from '$app/paths';
	import type { ResolvedPathname } from '$app/types';
	import Card from '$lib/components/bulma/Card/Card.svelte';
	import CardContent from '$lib/components/bulma/Card/CardContent.svelte';
	import CardHeader from '$lib/components/bulma/Card/CardHeader.svelte';
	import Icon from '$lib/components/bulma/Icon.svelte';
	import { mdiAccount, mdiSeed } from '@mdi/js';

	let cards: { title: string; icon: string; link: ResolvedPathname; description: string }[] = [
		{ title: 'Users', icon: mdiAccount, link: '/admin/users', description: 'List of Users' },
		{
			title: 'Nutrients',
			icon: mdiSeed,
			link: '/admin/nutrients',
			description: 'List of nutrients.'
		}
	];
</script>

<section class="section">
	<div class="grid">
		{#each cards as card (card.title)}
			<div class="cell">
				<a href={resolve(card.link)}>
					<Card>
						{#snippet header()}
							<CardHeader bulma={{ title: 'has-text-primary', icon: 'has-text-primary' }}>
								{#snippet title()}
									{card.title}
								{/snippet}
								{#snippet icon()}
									<Icon icon={card.icon} />
								{/snippet}
							</CardHeader>
						{/snippet}
						{#snippet content()}
							<CardContent>
								<div class="content">{card.description}</div>
							</CardContent>
						{/snippet}
					</Card>
				</a>
			</div>
		{/each}
	</div>
</section>

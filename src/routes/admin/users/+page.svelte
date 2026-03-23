<script lang="ts">
	import type { PageServerData } from './$types';
	import { Table } from 'svelte-ux';

	export let data: PageServerData;

	const formatEmailVerified = (val: boolean) => (val ? 'YES' : 'NO');

	const formatDate = (val: Date | string) => {
		let date = new Date(val);
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	};
</script>

<div class="container p-4">
	<div class="grid grid-flow-col gap-4">
		<Table
			data={data.users}
			classes={{ thead: 'bg-blue-500 text-white font-bold' }}
			columns={[
				{ name: 'id', align: 'left', header: 'ID' },
				{ name: 'name', align: 'left', header: 'Name' },
				{ name: 'email', align: 'left', header: 'Email' },
				{
					name: 'emailVerified',
					align: 'left',
					header: 'Email Verified',
					format: formatEmailVerified
				},
				{ name: 'createdAt', align: 'left', header: 'Date Created', format: formatDate },
				{ name: 'updatedAt', align: 'left', header: 'Date Updated', format: formatDate }
			]}
		/>
	</div>
</div>

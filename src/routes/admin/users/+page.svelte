<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;
</script>

<section class="section">
	<table class="table is-bordered is-hoverable">
		<thead>
			<tr class="is-primary">
				<th>ID</th>
				<th>Name</th>
				<th>Email</th>
				<th>Email Verified</th>
				<th>Image</th>
				<th>Date Created</th>
				<th>Date Updated</th>
			</tr>
		</thead>
		<tbody>
			{#each data.users as user (user.id)}
				<tr>
					<td>{user.id}</td>
					<td>{user.name}</td>
					<td>{user.email}</td>
					<td>{user.emailVerified}</td>
					<td>{user.image}</td>
					<td>{user.createdAt}</td>
					<td>{user.updatedAt}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

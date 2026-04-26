<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from 'svelte-ux';

	import BriaPage from '$lib/components/BriaPage.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<BriaPage errors={form?.errors} notification={form?.notification}>
	<div class="container p-4">
		<span class="text-xl font-bold">Register</span>
		<form method="post" action="?/signUp" use:enhance>
			<div class="grid gap-4">
				<TextField label="Email" type="email" name="email" />
				<TextField label="Password" type="password" name="password" />
				<TextField label="Confirm Password" type="password" name="confirmPassword" />
				<TextField label="Name" name="name" />
				<Button class="bg-primary-400 text-white place-self-start" type="submit">Sign up</Button>
			</div>
		</form>
	</div>
</BriaPage>

<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from 'svelte-ux';

	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container p-4">
	<span class="text-xl font-bold">Register</span>
	<form method="post" action="?/signUp" use:enhance>
		<div class="grid gap-4">
			<TextField label="Email" type="email" name="email" />
			<TextField label="Password" type="password" name="password" />
			<TextField label="Name" name="name" />
			<Button class="bg-primary-400 text-white place-self-start" type="submit">Sign up</Button>
		</div>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
</div>

<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import TextField from '$lib/components/form/TextField.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="section">
	<h1 class="title">Register</h1>
	<form method="post" action="?/signUp" use:enhance>
		<TextField label="Email" type="email" name="email" />
		<TextField label="Password" type="password" name="password" />
        <TextField label="Name" name="name" />
		<Button type="primary">Sign up</Button>
	</form>
	<p style="color: red">{form?.message ?? ''}</p>
</section>

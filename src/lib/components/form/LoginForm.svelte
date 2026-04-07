<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from 'svelte-ux';
</script>

<form method="post" id="signInForm" action="/login?/signInEmail" use:enhance>
	<div class="flex flex-col gap-2">
		<TextField label="Email" type="email" name="email" />
		<TextField label="Password" type="password" name="password" />
		<Button class="bg-primary-400" type="submit">Sign in</Button>
	</div>
</form>

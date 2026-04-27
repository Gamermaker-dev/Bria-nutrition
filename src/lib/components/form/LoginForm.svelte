<script lang="ts">
	import { enhance } from '$app/forms';
	import { isLoading } from '$lib/stores';
	import { Button, TextField } from 'svelte-ux';
</script>

<form method="post" id="signInForm" action="/login?/signInEmail" use:enhance={() => {
			const timer = setTimeout(() => ($isLoading = true), 100);

			return async ({ update }) => {
				await update();
				clearTimeout(timer);
				$isLoading = false;
			}
		}}>
	<div class="flex flex-col gap-2">
		<TextField label="Email" type="email" name="email" />
		<TextField label="Password" type="password" name="password" />
		<Button class="bg-primary-400" type="submit">Sign in</Button>
	</div>
</form>

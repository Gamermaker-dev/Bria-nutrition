<script lang="ts">
	import { Button } from 'svelte-ux';
	import { mdiGithub } from '@mdi/js';
	import { enhance } from '$app/forms';
	import { isLoading } from '$lib/stores';
</script>

<form method="post" action="/login?/signInSocial" use:enhance={() => {
			const timer = setTimeout(() => ($isLoading = true), 100);

			return async ({ update }) => {
				await update();
				clearTimeout(timer);
				$isLoading = false;
			}
		}}>
	<div class="flex flex-col gap-2">
		<input type="hidden" name="provider" value="github" />
		<input type="hidden" name="callbackURL" value="/" />
		<Button class="bg-black text-white" icon={mdiGithub} type="submit">Sign in with GitHub</Button>
	</div>
</form>

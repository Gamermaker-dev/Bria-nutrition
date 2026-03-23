<script lang="ts">
	import Form from './Form.svelte';
	import { Button } from 'svelte-ux';
	import { mdiGithub } from '@mdi/js';
</script>

<Form action="?/signInSocial">
	<input type="hidden" name="provider" value="github" />
	<input type="hidden" name="callbackURL" value="/" />
	<Button class="bg-black text-white" icon={mdiGithub} type="submit">Sign in with GitHub</Button>
</Form>

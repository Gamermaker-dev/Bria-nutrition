<script lang="ts">
	import Form from './Form.svelte';
	import { Button, TextField } from 'svelte-ux';
</script>

<Form id="signInForm" action="?/signInEmail">
	<div class="grid grid-cols-1 gap-4 content-center justify-start justify-items-start place-content-center">
		<TextField label="Email" type="email" name="email" />
		<TextField label="Password" type="password" name="password" />
		<Button class="bg-primary-400" type="submit">Sign in</Button>
	</div>
</Form>

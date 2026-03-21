<script lang="ts">
	import Button from '../Button.svelte';
	import Form from './Form.svelte';
</script>

<Form action="?/signInSocial">
	<input type="hidden" name="provider" value="github" />
	<input type="hidden" name="callbackURL" value="/" />
	<Button type="black">Sign in with GitHub</Button>
</Form>

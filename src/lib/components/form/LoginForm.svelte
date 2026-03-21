<script lang="ts">
	import Button from '../Button.svelte';
	import Form from './Form.svelte';
	import TextField from './TextField.svelte';
</script>

<Form action="?/signnEmail">
	<TextField label="Email" type="email" name="email" />
	<TextField label="Password" type="password" name="password" />
	<Button type="primary">Sign in</Button>
</Form>

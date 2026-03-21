<script lang="ts">
	import LoginForm from '$lib/components/form/LoginForm.svelte';
	import SocialLoginForm from '$lib/components/form/SocialLoginForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<section class="section">
	<h1 class="title">Login</h1>
	<LoginForm />
	<p style="color: red">{form?.message ?? ''}</p>

	<hr />
	<SocialLoginForm />
</section>

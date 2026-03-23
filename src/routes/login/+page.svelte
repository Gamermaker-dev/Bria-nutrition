<script lang="ts">
	import LoginForm from '$lib/components/form/LoginForm.svelte';
	import SocialLoginForm from '$lib/components/form/SocialLoginForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="grid grid-cols-1 gap-4">
	<div class="text-xl font-bold">Login</div>
	<LoginForm />
	<p class="text-danger-400">{form?.message ?? ''}</p>

	<hr />
	<SocialLoginForm />
</div>

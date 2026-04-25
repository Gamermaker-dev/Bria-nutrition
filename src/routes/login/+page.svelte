<script lang="ts">
	import BriaPage from '$lib/components/BriaPage.svelte';
	import LoginForm from '$lib/components/form/LoginForm.svelte';
	import SocialLoginForm from '$lib/components/form/SocialLoginForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<BriaPage errors={form?.errors} notification={form?.notification}>
	<div class="max-w-xl mx-auto flex flex-col gap-4">
		<div class="text-xl font-bold">Login</div>
		<LoginForm />
		<hr />
		<SocialLoginForm />
	</div>
</BriaPage>

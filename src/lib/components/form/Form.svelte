<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Props } from '$lib/types/Props';

	type FormMethods = 'post' | 'dialog' | 'get' | 'DIALOG' | 'GET' | 'POST' | null | undefined;

	type FormProps = Props & { id?: string; method?: FormMethods; action?: string };

	let { id, children, method = 'post', action }: FormProps = $props();
</script>

<form {id} {method} {action} use:enhance>
	{@render children?.()}
</form>

<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Snippet } from "svelte";

    type FormMethods = "post" | "dialog" | "get" | "DIALOG" | "GET" | "POST" | null | undefined;

    let { children, method = "post", action }: { children: Snippet<[]>, method?: FormMethods, action?: string } = $props();
</script>

<form {method} {action} use:enhance>
    {@render children()}
</form>
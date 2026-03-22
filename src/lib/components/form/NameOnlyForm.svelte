<script lang="ts">
	import Form from "./Form.svelte";
	import TextField from "./TextField.svelte";

    let { ...rest} = $props();
</script>

<Form method="POST" action={rest.action}>
    <TextField label="Name" name="name"  />
</Form>
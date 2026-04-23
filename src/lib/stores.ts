import { writable } from 'svelte/store';

export const notifications = writable<
	{ type: 'success' | 'warning' | 'danger'; title: string; description: string }[]
>([]);

export const isLoading = writable<boolean>(false);
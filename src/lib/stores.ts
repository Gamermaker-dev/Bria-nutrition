import { writable } from 'svelte/store';

export const notifications = writable<
	{ type: 'success' | 'warning' | 'danger'; title: string; description: string }[]
>([]);

export const displayError = writable<boolean>(false);
export const isLoading = writable<boolean>(false);
import { writable } from 'svelte/store';
import type { BriaNotification } from './types/BriaNotification';

export const notifications = writable<
	BriaNotification[]
>([]);

export const displayError = writable<boolean>(false);
export const isLoading = writable<boolean>(false);
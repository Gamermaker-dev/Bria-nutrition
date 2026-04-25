import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		version: {
			name: '1.00.00',
			pollInterval: (1000*60*60*6)
		}
	},
	preprocess: vitePreprocess(),
};

export default config;

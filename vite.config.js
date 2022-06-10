import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	// https://vitejs.dev/config/#base
	base: '/asgardex-stats/',
	plugins: [svelte()]
});

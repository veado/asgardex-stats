<script lang="ts">
	import Downloads from './Downloads.svelte';
	import type { CountsAD } from '../types/api';

	export let counts: CountsAD;
	export let headline = '';
	export let subheadline = '';
</script>

<article class="w-full pt-24">
	<h1 class="text-4xl text-center text-gray-800">{headline}</h1>
	<h2 class="text-xl text-center text-gray-400 italic">{subheadline}</h2>
	<Downloads {counts} />
</article>

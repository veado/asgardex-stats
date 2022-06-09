<script lang="ts">
	import type { TotalDownloads } from '../types/app';

	import { INITIAL_TOTAL_DOWNLOADS } from '../stores/const';

	import Downloads from './Downloads.svelte';
	export let downloads: TotalDownloads = INITIAL_TOTAL_DOWNLOADS;
	export let headline = '';
	export let subheadline = '';
</script>

<article class="w-full pt-24">
	<h1 class="text-4xl text-center text-gray-800">{headline}</h1>
	<h1 class="text-xl text-center text-gray-400 italic">{subheadline}</h1>
	<Downloads counts={downloads.counts} />
</article>

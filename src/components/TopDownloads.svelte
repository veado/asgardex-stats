<script lang="ts">
	import type { TopDownloads } from '../types/app';

	import { INITIAL_TOP_DOWNLOADS } from '../stores/const';

	import Downloads from './Downloads.svelte';

	export let headline = '';

	export let downloads: TopDownloads = INITIAL_TOP_DOWNLOADS;

	$: date = downloads.date.toLocaleDateString('en-us', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});

	$: subheadline = `${downloads.version} (${date})`;
</script>

<article class="w-full pt-32">
	<h1 class="text-4xl text-center text-gray-800">{headline}</h1>
	<h2 class="text-xl text-center text-gray-400 italic">{subheadline}</h2>
	<Downloads counts={downloads.counts} />
</article>

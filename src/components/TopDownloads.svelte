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
</script>

<article>
	<h1>{headline}</h1>
	<h2>{downloads.version} ({date})</h2>
	<Downloads counts={downloads.counts} />
</article>

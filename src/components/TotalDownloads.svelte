<script lang="ts">
	import type { TotalDownloads } from '../types/app';

	import { INITIAL_TOTAL_DOWNLOADS } from '../stores/const';

	import Downloads from './Downloads.svelte';
	export let downloads: TotalDownloads = INITIAL_TOTAL_DOWNLOADS;
</script>

<article>
	<h1>Total downloads</h1>
	<Downloads counts={downloads.counts} />
</article>
